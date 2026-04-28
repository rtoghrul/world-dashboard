import { NextResponse } from 'next/server'

export const revalidate = 3600

type MediaType = 'movie' | 'series' | 'cartoon'

type Item = {
  id: string
  type: MediaType
  title: string
  originalTitle: string
  year: string
  image: string
  backdrop?: string
  summary: string
  genres: string[]
  rating: number | null
  url: string
  trailerUrl: string
  source: string
}

type Seed = {
  type: MediaType
  title: string
  year: number
  genres: string[]
  trend?: boolean
  anticipated?: boolean
}

const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN || ''
const OMDB_API_KEY = process.env.OMDB_API_KEY || ''

const TMDB_IMAGE = 'https://image.tmdb.org/t/p/w500'
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w780'

const MOVIE_GENRES: Record<string, number> = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  Romance: 10749,
  Thriller: 53,
  'Science-Fiction': 878,
}

const TV_GENRES: Record<string, number> = {
  Action: 10759,
  Adventure: 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Family: 10751,
  Fantasy: 10765,
  Thriller: 9648,
  'Science-Fiction': 10765,
}

const FALLBACK: Seed[] = [
  { type: 'movie', title: 'The Godfather', year: 1972, genres: ['Drama', 'Crime'], trend: true },
  { type: 'movie', title: 'Star Wars: A New Hope', year: 1977, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'Back to the Future', year: 1985, genres: ['Science-Fiction', 'Comedy', 'Adventure'] },
  { type: 'movie', title: 'Die Hard', year: 1988, genres: ['Action', 'Thriller'] },
  { type: 'movie', title: 'The Matrix', year: 1999, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'The Dark Knight', year: 2008, genres: ['Action', 'Crime', 'Drama'], trend: true },
  { type: 'movie', title: 'Inception', year: 2010, genres: ['Science-Fiction', 'Action', 'Thriller'], trend: true },
  { type: 'movie', title: 'Interstellar', year: 2014, genres: ['Science-Fiction', 'Drama', 'Adventure'], trend: true },
  { type: 'movie', title: 'Dune', year: 2021, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Oppenheimer', year: 2023, genres: ['Drama', 'Thriller'], trend: true },
  { type: 'movie', title: 'Dune: Part Two', year: 2024, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Superman', year: 2025, genres: ['Action', 'Adventure', 'Fantasy'], anticipated: true },
  { type: 'series', title: 'Breaking Bad', year: 2008, genres: ['Drama', 'Crime', 'Thriller'], trend: true },
  { type: 'series', title: 'Game of Thrones', year: 2011, genres: ['Fantasy', 'Drama', 'Adventure'], trend: true },
  { type: 'series', title: 'Stranger Things', year: 2016, genres: ['Science-Fiction', 'Drama', 'Fantasy'], trend: true },
  { type: 'series', title: 'The Mandalorian', year: 2019, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'series', title: 'Squid Game', year: 2021, genres: ['Drama', 'Thriller', 'Action'], trend: true },
  { type: 'series', title: 'The Last of Us', year: 2023, genres: ['Drama', 'Action', 'Adventure'], trend: true },
  { type: 'series', title: 'Fallout', year: 2024, genres: ['Science-Fiction', 'Action', 'Drama'], trend: true },
  { type: 'series', title: 'Stranger Things Season 5', year: 2025, genres: ['Science-Fiction', 'Drama', 'Fantasy'], anticipated: true },
  { type: 'cartoon', title: 'The Lion King', year: 1994, genres: ['Animation', 'Family', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Toy Story', year: 1995, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Shrek', year: 2001, genres: ['Animation', 'Family', 'Comedy', 'Fantasy'] },
  { type: 'cartoon', title: 'Finding Nemo', year: 2003, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'WALL-E', year: 2008, genres: ['Animation', 'Family', 'Science-Fiction'] },
  { type: 'cartoon', title: 'Frozen', year: 2013, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Inside Out', year: 2015, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Coco', year: 2017, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Spider-Man: Into the Spider-Verse', year: 2018, genres: ['Animation', 'Action', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Inside Out 2', year: 2024, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Toy Story 5', year: 2026, genres: ['Animation', 'Family', 'Comedy'], anticipated: true },
]

function langToTmdb(lang: string) {
  const map: Record<string, string> = { az: 'az-AZ', ru: 'ru-RU', de: 'de-DE', tr: 'tr-TR', en: 'en-US', fr: 'fr-FR', es: 'es-ES', it: 'it-IT' }
  return map[lang] || 'en-US'
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function stripHtml(value?: string) {
  return (value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

async function tmdbFetch(path: string, params: Record<string, string | number | undefined> = {}) {
  if (!TMDB_API_KEY && !TMDB_READ_ACCESS_TOKEN) return null
  const url = new URL(`https://api.themoviedb.org/3${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  })
  if (TMDB_API_KEY) url.searchParams.set('api_key', TMDB_API_KEY)
  const headers: HeadersInit = {}
  if (TMDB_READ_ACCESS_TOKEN) headers.Authorization = `Bearer ${TMDB_READ_ACCESS_TOKEN}`
  try {
    const res = await fetch(url.toString(), { headers, next: { revalidate: 3600 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function omdbByTitle(title: string, year?: string) {
  if (!OMDB_API_KEY) return null
  try {
    const url = new URL('https://www.omdbapi.com/')
    url.searchParams.set('apikey', OMDB_API_KEY)
    url.searchParams.set('t', title)
    if (year) url.searchParams.set('y', year)
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.Response === 'False') return null
    return data
  } catch {
    return null
  }
}

async function fetchTvMaze(query: string, type: MediaType): Promise<Item[]> {
  if (type === 'movie' || type === 'cartoon') return []
  try {
    const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    return (Array.isArray(data) ? data : []).slice(0, 20).map((row: any) => {
      const show = row.show
      return {
        id: `tvmaze-${show.id}`,
        type: 'series',
        title: show.name,
        originalTitle: show.name,
        year: show.premiered ? String(show.premiered).slice(0, 4) : '',
        image: show.image?.original || show.image?.medium || stablePoster({ type: 'series', title: show.name, year: Number(String(show.premiered || '0').slice(0, 4)) || 0, genres: show.genres || [] }),
        summary: stripHtml(show.summary),
        genres: show.genres || [],
        rating: show.rating?.average || null,
        url: show.officialSite || show.url,
        trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(show.name + ' official trailer')}`,
        source: 'TVMaze',
      }
    })
  } catch {
    return []
  }
}

async function fetchItunes(seed: Seed): Promise<Partial<Item> | null> {
  try {
    const entity = seed.type === 'series' ? 'tvSeason' : 'movie'
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(seed.title)}&entity=${entity}&country=US&limit=12`, { next: { revalidate: 3600 } })
    const data = await res.json()
    const rows = Array.isArray(data?.results) ? data.results : []
    const cleanSeed = normalize(seed.title)
    const best = rows
      .filter((row: any) => row.artworkUrl100 || row.artworkUrl60)
      .map((row: any) => {
        const name = row.trackName || row.collectionName || ''
        const year = row.releaseDate ? Number(String(row.releaseDate).slice(0, 4)) : 0
        let score = 0
        const cleanName = normalize(name)
        if (cleanName === cleanSeed) score += 10
        if (cleanName.includes(cleanSeed) || cleanSeed.includes(cleanName)) score += 5
        if (year && Math.abs(year - seed.year) <= 1) score += 3
        return { row, score }
      })
      .sort((a: any, b: any) => b.score - a.score)[0]?.row
    if (!best) return null
    const artwork = (best.artworkUrl100 || best.artworkUrl60 || '').replace(/100x100bb/i, '1000x1000bb').replace(/60x60bb/i, '1000x1000bb')
    return {
      originalTitle: best.trackName || best.collectionName || seed.title,
      image: artwork,
      summary: stripHtml(best.longDescription || best.shortDescription || best.description || ''),
      url: best.trackViewUrl || best.collectionViewUrl,
    }
  } catch {
    return null
  }
}

async function fetchWiki(seed: Seed): Promise<Partial<Item> | null> {
  const variants = seed.type === 'series'
    ? [seed.title, `${seed.title} (TV series)`, `${seed.title} (television series)`]
    : [seed.title, `${seed.title} (film)`, `${seed.title} (${seed.year} film)`]
  for (const title of variants) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, { next: { revalidate: 3600 } })
      if (!res.ok) continue
      const data = await res.json()
      const image = data?.thumbnail?.source || data?.originalimage?.source
      if (!image && !data?.extract) continue
      return { image, summary: stripHtml(data?.extract || ''), url: data?.content_urls?.desktop?.page }
    } catch {}
  }
  return null
}

function stablePoster(seed: Seed) {
  const colors: Record<MediaType, [string, string]> = {
    movie: ['#7c3aed', '#0f172a'],
    series: ['#0891b2', '#0f172a'],
    cartoon: ['#f59e0b', '#7c2d12'],
  }
  const [a, b] = colors[seed.type]
  const safeTitle = seed.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeGenre = seed.genres.slice(0, 2).join(' · ').replace(/&/g, '&amp;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><text x="44" y="95" font-family="Arial" font-size="28" fill="#f8fafc" font-weight="700">${seed.type.toUpperCase()}</text><text x="44" y="150" font-family="Arial" font-size="24" fill="#f8fafc">${seed.year || ''}</text><foreignObject x="44" y="260" width="512" height="340"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial;color:#fff;font-size:54px;font-weight:800;line-height:1.05;word-break:break-word">${safeTitle}</div></foreignObject><text x="44" y="760" font-family="Arial" font-size="24" fill="#f8fafc">${safeGenre}</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function tmdbToItem(row: any, type: MediaType, lang: string, genreMap: Record<number, string>): Item {
  const title = row.title || row.name || row.original_title || row.original_name || 'Untitled'
  const originalTitle = row.original_title || row.original_name || title
  const date = row.release_date || row.first_air_date || ''
  const year = date ? String(date).slice(0, 4) : ''
  const genres = Array.isArray(row.genre_ids) ? row.genre_ids.map((id: number) => genreMap[id]).filter(Boolean) : []
  const media = type === 'series' ? 'tv' : 'movie'
  return {
    id: `tmdb-${media}-${row.id}`,
    type,
    title,
    originalTitle,
    year,
    image: row.poster_path ? `${TMDB_IMAGE}${row.poster_path}` : stablePoster({ type, title, year: Number(year) || 0, genres }),
    backdrop: row.backdrop_path ? `${TMDB_BACKDROP}${row.backdrop_path}` : undefined,
    summary: row.overview || `${title} · ${year} · ${genres.join(', ')}`,
    genres,
    rating: typeof row.vote_average === 'number' ? Number(row.vote_average.toFixed(1)) : null,
    url: `https://www.themoviedb.org/${media}/${row.id}`,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(originalTitle + ' official trailer')}`,
    source: 'TMDb',
  }
}

async function fetchTmdbItems(type: MediaType, mode: string, lang: string, query: string, genre: string, yearFrom: number | null, yearTo: number | null) {
  const language = langToTmdb(lang)
  const media = type === 'series' ? 'tv' : 'movie'
  const genreId = type === 'series' ? TV_GENRES[genre] : MOVIE_GENRES[genre]
  const allGenres = type === 'series' ? TV_GENRES : MOVIE_GENRES
  const reverseGenreMap = Object.fromEntries(Object.entries(allGenres).map(([name, id]) => [id, name]))

  let endpoint = `/discover/${media}`
  const params: Record<string, string | number | undefined> = {
    language,
    sort_by: mode === 'anticipated' ? 'popularity.desc' : 'popularity.desc',
    include_adult: 'false',
    page: 1,
  }

  if (query) {
    endpoint = `/search/${media}`
    params.query = query
  } else if (mode === 'trending') {
    endpoint = `/trending/${media}/week`
  } else if (mode === 'anticipated') {
    if (type === 'series') endpoint = '/discover/tv'
    else endpoint = '/movie/upcoming'
  }

  if (!query && endpoint.includes('/discover/')) {
    if (type === 'cartoon') params.with_genres = genreId ? `${MOVIE_GENRES.Animation},${genreId}` : `${MOVIE_GENRES.Animation}`
    else if (genreId) params.with_genres = genreId
    if (yearFrom) params[type === 'series' ? 'first_air_date.gte' : 'primary_release_date.gte'] = `${yearFrom}-01-01`
    if (yearTo) params[type === 'series' ? 'first_air_date.lte' : 'primary_release_date.lte'] = `${yearTo}-12-31`
  }

  const data = await tmdbFetch(endpoint, params)
  const rows = Array.isArray(data?.results) ? data.results : []
  let items = rows.map((row: any) => tmdbToItem(row, type, lang, reverseGenreMap))

  if (query && type === 'cartoon') items = items.filter(item => item.genres.includes('Animation'))
  if (genre) items = items.filter(item => item.genres.includes(genre) || type === 'cartoon')
  if (yearFrom) items = items.filter(item => !item.year || Number(item.year) >= yearFrom)
  if (yearTo) items = items.filter(item => !item.year || Number(item.year) <= yearTo)
  return items
}

async function enrichWithOmdb(item: Item) {
  if (!OMDB_API_KEY) return item
  const omdb = await omdbByTitle(item.originalTitle || item.title, item.year)
  if (!omdb) return item
  return {
    ...item,
    image: item.image.startsWith('data:') && omdb.Poster && omdb.Poster !== 'N/A' ? omdb.Poster : item.image,
    summary: item.summary || omdb.Plot || item.summary,
    rating: item.rating || (omdb.imdbRating && omdb.imdbRating !== 'N/A' ? Number(omdb.imdbRating) : null),
    url: omdb.imdbID ? `https://www.imdb.com/title/${omdb.imdbID}/` : item.url,
    source: `${item.source}+OMDb`,
  }
}

async function fallbackItems(type: MediaType, mode: string, lang: string, query: string, genre: string, yearFrom: number | null, yearTo: number | null) {
  let seeds = FALLBACK.filter(item => item.type === type)
  if (mode === 'trending') seeds = seeds.filter(item => item.trend)
  if (mode === 'anticipated') seeds = seeds.filter(item => item.anticipated || item.year >= new Date().getFullYear())
  if (query) seeds = seeds.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  if (genre) seeds = seeds.filter(item => item.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
  if (yearFrom) seeds = seeds.filter(item => item.year >= yearFrom)
  if (yearTo) seeds = seeds.filter(item => item.year <= yearTo)
  const items = await Promise.all(seeds.map(async seed => {
    const [itunes, wiki] = await Promise.all([fetchItunes(seed), fetchWiki(seed)])
    return {
      id: `${seed.type}-${seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      type: seed.type,
      title: seed.title,
      originalTitle: itunes?.originalTitle || seed.title,
      year: String(seed.year),
      image: itunes?.image || wiki?.image || stablePoster(seed),
      summary: itunes?.summary || wiki?.summary || `${seed.title} · ${seed.year} · ${seed.genres.join(', ')}`,
      genres: seed.genres,
      rating: null,
      url: itunes?.url || wiki?.url || `https://www.google.com/search?q=${encodeURIComponent(seed.title + ' official where to watch')}`,
      trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(seed.title + ' official trailer')}`,
      source: itunes?.image ? 'iTunes' : wiki?.image ? 'Wikipedia' : 'Local',
    } as Item
  }))
  if (type === 'series' && query) return [...items, ...(await fetchTvMaze(query, type))]
  return items
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
  const type = (searchParams.get('type') || 'movie') as MediaType | 'all'
  const genre = searchParams.get('genre') || ''
  const lang = searchParams.get('lang') || 'en'
  const query = searchParams.get('q') || ''
  const yearFromRaw = searchParams.get('yearFrom')
  const yearToRaw = searchParams.get('yearTo')
  const yearFrom = yearFromRaw ? Number(yearFromRaw) : null
  const yearTo = yearToRaw ? Number(yearToRaw) : null
  const mode = searchParams.get('mode') || 'default'
  const types: MediaType[] = type === 'all' ? ['movie', 'series', 'cartoon'] : [type as MediaType]

  let items: Item[] = []
  for (const t of types) {
    const tmdbItems = await fetchTmdbItems(t, mode, lang, query, genre, yearFrom, yearTo)
    const sourceItems = tmdbItems.length ? tmdbItems : await fallbackItems(t, mode, lang, query, genre, yearFrom, yearTo)
    items.push(...sourceItems)
  }

  if (OMDB_API_KEY) items = await Promise.all(items.slice(0, 40).map(enrichWithOmdb))

  const seen = new Set<string>()
  items = items
    .filter(item => {
      const key = `${item.type}-${normalize(item.originalTitle || item.title)}-${item.year}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .sort((a, b) => Number(!a.image.startsWith('data:')) - Number(!b.image.startsWith('data:')) || Number(b.year || 0) - Number(a.year || 0))
    .slice(0, 80)

  if (lang !== 'en' && items.length) {
    const titles = await translate(items.map(i => i.title), lang)
    const summaries = await translate(items.map(i => i.summary || ''), lang)
    items = items.map((item, index) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary }))
  }

  return NextResponse.json(items)
}
