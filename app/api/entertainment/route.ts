import { NextResponse } from 'next/server'

export const revalidate = 3600

type Item = {
  id: string
  type: string
  title: string
  originalTitle: string
  year: string
  image: string
  summary: string
  genres: string[]
  rating: number | null
  url: string
  trailerUrl: string
}

const SEARCH_SEEDS: Record<string, Record<string, string[]>> = {
  movie: {
    trending: ['blockbuster movie', 'award winning movie', 'action movie', 'drama movie'],
    anticipated: ['upcoming movie', 'coming soon movie', 'new movie trailer', '2026 movie'],
    default: ['popular movie', 'cinema film', 'family movie'],
  },
  series: {
    trending: ['popular tv series', 'netflix series', 'hbo series', 'drama series'],
    anticipated: ['upcoming tv series', 'new season series', 'coming soon series'],
    default: ['popular tv series', 'drama series', 'comedy series'],
  },
  cartoon: {
    trending: ['animated movie', 'cartoon series', 'family animation', 'kids animation'],
    anticipated: ['upcoming animated movie', 'new cartoon series', 'coming soon animation'],
    default: ['animation cartoon', 'kids animation', 'animated series'],
  },
}

function stripHtml(value?: string) {
  return (value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function highResArtwork(url?: string) {
  return (url || '').replace(/100x100bb/i, '600x900bb').replace(/60x60bb/i, '600x900bb')
}

function normalizeGenre(value?: string) {
  if (!value) return []
  return value.split(/[,&/]/).map(x => x.trim()).filter(Boolean)
}

async function searchItunes(query: string, type: string) {
  try {
    const entity = type === 'series' ? 'tvSeason' : 'movie'
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=${entity}&country=US&limit=25`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return (Array.isArray(data?.results) ? data.results : []).map((row: any) => {
      const title = row.trackName || row.collectionName || row.artistName || 'Untitled'
      const year = row.releaseDate ? String(row.releaseDate).slice(0, 4) : ''
      const genres = normalizeGenre(row.primaryGenreName)
      return {
        id: `it-${row.trackId || row.collectionId || title}`,
        type,
        title,
        originalTitle: title,
        year,
        image: highResArtwork(row.artworkUrl100 || row.artworkUrl60),
        summary: stripHtml(row.longDescription || row.shortDescription || row.description || `${title} · ${genres.join(', ')}`),
        genres,
        rating: null,
        url: row.trackViewUrl || row.collectionViewUrl || `https://www.google.com/search?q=${encodeURIComponent(title)}`,
        trailerUrl: row.previewUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' official trailer')}`,
      } as Item
    })
  } catch {
    return []
  }
}

async function searchTvMaze(query: string, type: string) {
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return (Array.isArray(data) ? data : []).map((row: any) => {
      const show = row.show
      return {
        id: `tv-${show.id}`,
        type,
        title: show.name,
        originalTitle: show.name,
        year: show.premiered ? String(show.premiered).slice(0, 4) : '',
        image: show.image?.medium || show.image?.original || '',
        summary: stripHtml(show.summary),
        genres: show.genres || [],
        rating: show.rating?.average || null,
        url: show.officialSite || show.url,
        trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + ' official trailer')}`,
      } as Item
    })
  } catch {
    return []
  }
}

async function translate(texts: string[], lang: string) {
  if (!lang || lang === 'en' || texts.length === 0) return texts
  try {
    const res = await fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + lang + '&dt=t&q=' + encodeURIComponent(texts.join('\n---\n')))
    const data = await res.json()
    const joined = data?.[0]?.map((x: any) => x?.[0]).join('') || texts.join('\n---\n')
    return joined.split('\n---\n')
  } catch {
    return texts
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'all'
  const genre = searchParams.get('genre') || ''
  const lang = searchParams.get('lang') || 'en'
  const query = searchParams.get('q') || ''
  const yearFrom = Number(searchParams.get('yearFrom') || '1900')
  const yearTo = Number(searchParams.get('yearTo') || new Date().getFullYear() + 3)
  const mode = searchParams.get('mode') || 'default'
  const types = type === 'all' ? ['movie', 'series', 'cartoon'] : [type]

  const allResults = await Promise.all(types.flatMap(t => {
    const seeds = query ? [query] : (SEARCH_SEEDS[t]?.[mode] || SEARCH_SEEDS[t]?.default || ['movie'])
    return seeds.flatMap(seed => [searchItunes(seed, t), searchTvMaze(seed, t)])
  }))

  const map = new Map<string, Item>()
  allResults.flat().forEach(item => {
    if (!item.image) return
    map.set(item.id, item)
  })

  let items = Array.from(map.values())
  if (type === 'cartoon' || types.includes('cartoon')) {
    items = items.map(item => item.type === 'cartoon' ? item : item)
  }
  if (genre) items = items.filter(item => item.genres.some(g => g.toLowerCase().includes(genre.toLowerCase())))
  items = items.filter(item => {
    const y = Number(item.year)
    if (!y) return true
    return y >= yearFrom && y <= yearTo
  })

  items = items.slice(0, 60)

  if (lang !== 'en' && items.length) {
    const titles = await translate(items.map(i => i.title), lang)
    const summaries = await translate(items.map(i => i.summary || ''), lang)
    items = items.map((item, index) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary }))
  }

  return NextResponse.json(items)
}
