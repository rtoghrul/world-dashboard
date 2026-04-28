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

type Seed = { type: 'movie' | 'series' | 'cartoon'; title: string; year: number; genres: string[]; trend?: boolean; anticipated?: boolean }

const CATALOG: Seed[] = [
  // Movies — classics and modern, so old year filters are populated
  { type: 'movie', title: 'The Godfather', year: 1972, genres: ['Drama', 'Crime'], trend: true },
  { type: 'movie', title: 'The Godfather Part II', year: 1974, genres: ['Drama', 'Crime'] },
  { type: 'movie', title: 'Star Wars: A New Hope', year: 1977, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'The Empire Strikes Back', year: 1980, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'Raiders of the Lost Ark', year: 1981, genres: ['Adventure', 'Action'] },
  { type: 'movie', title: 'Back to the Future', year: 1985, genres: ['Science-Fiction', 'Comedy', 'Adventure'] },
  { type: 'movie', title: 'Die Hard', year: 1988, genres: ['Action', 'Thriller'] },
  { type: 'movie', title: 'Goodfellas', year: 1990, genres: ['Crime', 'Drama'] },
  { type: 'movie', title: 'Terminator 2: Judgment Day', year: 1991, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'Jurassic Park', year: 1993, genres: ['Adventure', 'Science-Fiction'] },
  { type: 'movie', title: 'The Shawshank Redemption', year: 1994, genres: ['Drama'] },
  { type: 'movie', title: 'Pulp Fiction', year: 1994, genres: ['Crime', 'Drama'] },
  { type: 'movie', title: 'Forrest Gump', year: 1994, genres: ['Drama', 'Romance'] },
  { type: 'movie', title: 'The Matrix', year: 1999, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'Gladiator', year: 2000, genres: ['Action', 'Drama', 'Adventure'] },
  { type: 'movie', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, genres: ['Fantasy', 'Adventure', 'Action'] },
  { type: 'movie', title: 'The Dark Knight', year: 2008, genres: ['Action', 'Crime', 'Drama'], trend: true },
  { type: 'movie', title: 'Inception', year: 2010, genres: ['Science-Fiction', 'Action', 'Thriller'], trend: true },
  { type: 'movie', title: 'Interstellar', year: 2014, genres: ['Science-Fiction', 'Drama', 'Adventure'], trend: true },
  { type: 'movie', title: 'Mad Max: Fury Road', year: 2015, genres: ['Action', 'Adventure', 'Science-Fiction'] },
  { type: 'movie', title: 'Arrival', year: 2016, genres: ['Science-Fiction', 'Drama'] },
  { type: 'movie', title: 'La La Land', year: 2016, genres: ['Romance', 'Drama'] },
  { type: 'movie', title: 'Blade Runner 2049', year: 2017, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'movie', title: 'Joker', year: 2019, genres: ['Drama', 'Crime', 'Thriller'] },
  { type: 'movie', title: 'Dune', year: 2021, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Top Gun: Maverick', year: 2022, genres: ['Action', 'Drama'] },
  { type: 'movie', title: 'Oppenheimer', year: 2023, genres: ['Drama', 'Thriller'], trend: true },
  { type: 'movie', title: 'Dune: Part Two', year: 2024, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Mission: Impossible - The Final Reckoning', year: 2025, genres: ['Action', 'Adventure', 'Thriller'], anticipated: true },
  { type: 'movie', title: 'Avatar 3', year: 2025, genres: ['Science-Fiction', 'Adventure', 'Action'], anticipated: true },
  { type: 'movie', title: 'Superman', year: 2025, genres: ['Action', 'Adventure', 'Fantasy'], anticipated: true },

  // Series only
  { type: 'series', title: 'The Sopranos', year: 1999, genres: ['Drama', 'Crime'] },
  { type: 'series', title: 'The Wire', year: 2002, genres: ['Drama', 'Crime'] },
  { type: 'series', title: 'Lost', year: 2004, genres: ['Drama', 'Adventure', 'Fantasy'] },
  { type: 'series', title: 'Breaking Bad', year: 2008, genres: ['Drama', 'Crime', 'Thriller'], trend: true },
  { type: 'series', title: 'Game of Thrones', year: 2011, genres: ['Fantasy', 'Drama', 'Adventure'], trend: true },
  { type: 'series', title: 'Sherlock', year: 2010, genres: ['Crime', 'Drama'] },
  { type: 'series', title: 'Black Mirror', year: 2011, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'series', title: 'Stranger Things', year: 2016, genres: ['Science-Fiction', 'Drama', 'Fantasy'], trend: true },
  { type: 'series', title: 'The Crown', year: 2016, genres: ['Drama'] },
  { type: 'series', title: 'Dark', year: 2017, genres: ['Science-Fiction', 'Thriller', 'Drama'] },
  { type: 'series', title: 'The Mandalorian', year: 2019, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'series', title: 'The Witcher', year: 2019, genres: ['Fantasy', 'Adventure', 'Action'] },
  { type: 'series', title: 'House of the Dragon', year: 2022, genres: ['Fantasy', 'Drama', 'Action'], trend: true },
  { type: 'series', title: 'The Last of Us', year: 2023, genres: ['Drama', 'Action', 'Adventure'], trend: true },
  { type: 'series', title: 'Fallout', year: 2024, genres: ['Science-Fiction', 'Action', 'Drama'], trend: true },
  { type: 'series', title: 'Stranger Things Season 5', year: 2025, genres: ['Science-Fiction', 'Drama', 'Fantasy'], anticipated: true },
  { type: 'series', title: 'The Last of Us Season 2', year: 2025, genres: ['Drama', 'Action', 'Adventure'], anticipated: true },

  // Cartoons / animation only
  { type: 'cartoon', title: 'Snow White and the Seven Dwarfs', year: 1937, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'The Lion King', year: 1994, genres: ['Animation', 'Family', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Toy Story', year: 1995, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Shrek', year: 2001, genres: ['Animation', 'Family', 'Comedy', 'Fantasy'] },
  { type: 'cartoon', title: 'Finding Nemo', year: 2003, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'The Incredibles', year: 2004, genres: ['Animation', 'Family', 'Action'] },
  { type: 'cartoon', title: 'Ratatouille', year: 2007, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'WALL-E', year: 2008, genres: ['Animation', 'Family', 'Science-Fiction'] },
  { type: 'cartoon', title: 'Up', year: 2009, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'How to Train Your Dragon', year: 2010, genres: ['Animation', 'Family', 'Adventure', 'Fantasy'] },
  { type: 'cartoon', title: 'Frozen', year: 2013, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Inside Out', year: 2015, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Zootopia', year: 2016, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Coco', year: 2017, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Spider-Man: Into the Spider-Verse', year: 2018, genres: ['Animation', 'Action', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Soul', year: 2020, genres: ['Animation', 'Family', 'Drama'] },
  { type: 'cartoon', title: 'Encanto', year: 2021, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Puss in Boots: The Last Wish', year: 2022, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'Spider-Man: Across the Spider-Verse', year: 2023, genres: ['Animation', 'Action', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Inside Out 2', year: 2024, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Toy Story 5', year: 2026, genres: ['Animation', 'Family', 'Comedy'], anticipated: true },
  { type: 'cartoon', title: 'Frozen 3', year: 2027, genres: ['Animation', 'Family', 'Fantasy'], anticipated: true },
]

function stripHtml(value?: string) {
  return (value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function highResArtwork(url?: string) {
  return (url || '').replace(/100x100bb/i, '600x900bb').replace(/60x60bb/i, '600x900bb')
}

async function searchItunes(seed: Seed) {
  try {
    const entity = seed.type === 'series' ? 'tvSeason' : 'movie'
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(seed.title)}&entity=${entity}&country=US&limit=5`, { next: { revalidate: 3600 } })
    const data = await res.json()
    const row = Array.isArray(data?.results) ? data.results[0] : null
    if (!row) return makeFallback(seed)
    const title = row.trackName || row.collectionName || seed.title
    const image = highResArtwork(row.artworkUrl100 || row.artworkUrl60)
    return {
      id: `${seed.type}-${seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      type: seed.type,
      title: seed.title,
      originalTitle: title,
      year: String(seed.year),
      image,
      summary: stripHtml(row.longDescription || row.shortDescription || row.description || `${seed.title} · ${seed.genres.join(', ')}`),
      genres: seed.genres,
      rating: null,
      url: row.trackViewUrl || row.collectionViewUrl || `https://www.google.com/search?q=${encodeURIComponent(seed.title)}`,
      trailerUrl: row.previewUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(seed.title + ' official trailer')}`,
    } as Item
  } catch {
    return makeFallback(seed)
  }
}

function makeFallback(seed: Seed): Item {
  return {
    id: `${seed.type}-${seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    type: seed.type,
    title: seed.title,
    originalTitle: seed.title,
    year: String(seed.year),
    image: `https://placehold.co/600x900/1e293b/f8fafc?text=${encodeURIComponent(seed.title)}`,
    summary: `${seed.title} · ${seed.year} · ${seed.genres.join(', ')}`,
    genres: seed.genres,
    rating: null,
    url: `https://www.google.com/search?q=${encodeURIComponent(seed.title + ' official')}`,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(seed.title + ' official trailer')}`,
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

  let seeds = CATALOG.filter(item => type === 'all' || item.type === type)
  if (mode === 'trending') seeds = seeds.filter(item => item.trend)
  if (mode === 'anticipated') seeds = seeds.filter(item => item.anticipated || item.year >= new Date().getFullYear())
  if (query) seeds = seeds.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  if (genre) seeds = seeds.filter(item => item.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
  seeds = seeds.filter(item => item.year >= yearFrom && item.year <= yearTo)

  seeds = seeds.sort((a, b) => {
    if (mode === 'anticipated') return a.year - b.year
    if (mode === 'trending') return Number(b.trend) - Number(a.trend) || b.year - a.year
    return b.year - a.year
  }).slice(0, 60)

  let items = await Promise.all(seeds.map(searchItunes))

  if (lang !== 'en' && items.length) {
    const titles = await translate(items.map(i => i.title), lang)
    const summaries = await translate(items.map(i => i.summary || ''), lang)
    items = items.map((item, index) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary }))
  }

  return NextResponse.json(items)
}
