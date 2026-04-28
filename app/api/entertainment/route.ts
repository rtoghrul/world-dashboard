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

type Seed = {
  type: 'movie' | 'series' | 'cartoon'
  title: string
  year: number
  genres: string[]
  trend?: boolean
  anticipated?: boolean
}

const CATALOG: Seed[] = [
  // Movies
  { type: 'movie', title: 'Casablanca', year: 1942, genres: ['Drama', 'Romance'] },
  { type: 'movie', title: '12 Angry Men', year: 1957, genres: ['Drama', 'Crime'] },
  { type: 'movie', title: 'Psycho', year: 1960, genres: ['Thriller', 'Crime'] },
  { type: 'movie', title: 'The Good, the Bad and the Ugly', year: 1966, genres: ['Adventure', 'Action'] },
  { type: 'movie', title: '2001: A Space Odyssey', year: 1968, genres: ['Science-Fiction', 'Adventure'] },
  { type: 'movie', title: 'The Godfather', year: 1972, genres: ['Drama', 'Crime'], trend: true },
  { type: 'movie', title: 'The Godfather Part II', year: 1974, genres: ['Drama', 'Crime'] },
  { type: 'movie', title: 'Jaws', year: 1975, genres: ['Thriller', 'Adventure'] },
  { type: 'movie', title: 'Rocky', year: 1976, genres: ['Drama'] },
  { type: 'movie', title: 'Star Wars: A New Hope', year: 1977, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'Alien', year: 1979, genres: ['Science-Fiction', 'Thriller'] },
  { type: 'movie', title: 'The Empire Strikes Back', year: 1980, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'Raiders of the Lost Ark', year: 1981, genres: ['Adventure', 'Action'] },
  { type: 'movie', title: 'Blade Runner', year: 1982, genres: ['Science-Fiction', 'Thriller'] },
  { type: 'movie', title: 'Scarface', year: 1983, genres: ['Crime', 'Drama'] },
  { type: 'movie', title: 'The Terminator', year: 1984, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'Back to the Future', year: 1985, genres: ['Science-Fiction', 'Comedy', 'Adventure'] },
  { type: 'movie', title: 'Aliens', year: 1986, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'Die Hard', year: 1988, genres: ['Action', 'Thriller'] },
  { type: 'movie', title: 'Goodfellas', year: 1990, genres: ['Crime', 'Drama'] },
  { type: 'movie', title: 'Terminator 2: Judgment Day', year: 1991, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'The Silence of the Lambs', year: 1991, genres: ['Thriller', 'Crime', 'Drama'] },
  { type: 'movie', title: 'Jurassic Park', year: 1993, genres: ['Adventure', 'Science-Fiction'] },
  { type: 'movie', title: 'The Shawshank Redemption', year: 1994, genres: ['Drama'] },
  { type: 'movie', title: 'Pulp Fiction', year: 1994, genres: ['Crime', 'Drama'] },
  { type: 'movie', title: 'Forrest Gump', year: 1994, genres: ['Drama', 'Romance'] },
  { type: 'movie', title: 'Seven', year: 1995, genres: ['Crime', 'Thriller'] },
  { type: 'movie', title: 'Braveheart', year: 1995, genres: ['Drama', 'Action'] },
  { type: 'movie', title: 'Titanic', year: 1997, genres: ['Drama', 'Romance'] },
  { type: 'movie', title: 'The Matrix', year: 1999, genres: ['Action', 'Science-Fiction'] },
  { type: 'movie', title: 'Fight Club', year: 1999, genres: ['Drama', 'Thriller'] },
  { type: 'movie', title: 'Gladiator', year: 2000, genres: ['Action', 'Drama', 'Adventure'] },
  { type: 'movie', title: 'Memento', year: 2000, genres: ['Thriller', 'Drama'] },
  { type: 'movie', title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, genres: ['Fantasy', 'Adventure', 'Action'] },
  { type: 'movie', title: 'The Pianist', year: 2002, genres: ['Drama'] },
  { type: 'movie', title: 'Pirates of the Caribbean: The Curse of the Black Pearl', year: 2003, genres: ['Adventure', 'Fantasy', 'Action'] },
  { type: 'movie', title: 'Eternal Sunshine of the Spotless Mind', year: 2004, genres: ['Romance', 'Drama', 'Science-Fiction'] },
  { type: 'movie', title: 'The Departed', year: 2006, genres: ['Crime', 'Drama', 'Thriller'] },
  { type: 'movie', title: 'The Prestige', year: 2006, genres: ['Drama', 'Thriller'] },
  { type: 'movie', title: 'No Country for Old Men', year: 2007, genres: ['Crime', 'Thriller', 'Drama'] },
  { type: 'movie', title: 'The Dark Knight', year: 2008, genres: ['Action', 'Crime', 'Drama'], trend: true },
  { type: 'movie', title: 'Avatar', year: 2009, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'movie', title: 'Inception', year: 2010, genres: ['Science-Fiction', 'Action', 'Thriller'], trend: true },
  { type: 'movie', title: 'The Social Network', year: 2010, genres: ['Drama'] },
  { type: 'movie', title: 'Drive', year: 2011, genres: ['Crime', 'Drama', 'Thriller'] },
  { type: 'movie', title: 'Django Unchained', year: 2012, genres: ['Drama', 'Action'] },
  { type: 'movie', title: 'Gravity', year: 2013, genres: ['Science-Fiction', 'Drama'] },
  { type: 'movie', title: 'Interstellar', year: 2014, genres: ['Science-Fiction', 'Drama', 'Adventure'], trend: true },
  { type: 'movie', title: 'Whiplash', year: 2014, genres: ['Drama'] },
  { type: 'movie', title: 'Mad Max: Fury Road', year: 2015, genres: ['Action', 'Adventure', 'Science-Fiction'] },
  { type: 'movie', title: 'The Revenant', year: 2015, genres: ['Drama', 'Adventure'] },
  { type: 'movie', title: 'Arrival', year: 2016, genres: ['Science-Fiction', 'Drama'] },
  { type: 'movie', title: 'La La Land', year: 2016, genres: ['Romance', 'Drama'] },
  { type: 'movie', title: 'Get Out', year: 2017, genres: ['Thriller'] },
  { type: 'movie', title: 'Blade Runner 2049', year: 2017, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'movie', title: 'A Star Is Born', year: 2018, genres: ['Drama', 'Romance'] },
  { type: 'movie', title: 'Parasite', year: 2019, genres: ['Drama', 'Thriller'] },
  { type: 'movie', title: 'Joker', year: 2019, genres: ['Drama', 'Crime', 'Thriller'] },
  { type: 'movie', title: 'Tenet', year: 2020, genres: ['Science-Fiction', 'Action', 'Thriller'] },
  { type: 'movie', title: 'Dune', year: 2021, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Top Gun: Maverick', year: 2022, genres: ['Action', 'Drama'] },
  { type: 'movie', title: 'Everything Everywhere All at Once', year: 2022, genres: ['Science-Fiction', 'Comedy', 'Action'] },
  { type: 'movie', title: 'Oppenheimer', year: 2023, genres: ['Drama', 'Thriller'], trend: true },
  { type: 'movie', title: 'Barbie', year: 2023, genres: ['Comedy', 'Fantasy'] },
  { type: 'movie', title: 'Dune: Part Two', year: 2024, genres: ['Science-Fiction', 'Adventure', 'Action'], trend: true },
  { type: 'movie', title: 'Furiosa: A Mad Max Saga', year: 2024, genres: ['Action', 'Adventure', 'Science-Fiction'] },
  { type: 'movie', title: 'Mission: Impossible - The Final Reckoning', year: 2025, genres: ['Action', 'Adventure', 'Thriller'], anticipated: true },
  { type: 'movie', title: 'Avatar: Fire and Ash', year: 2025, genres: ['Science-Fiction', 'Adventure', 'Action'], anticipated: true },
  { type: 'movie', title: 'Superman', year: 2025, genres: ['Action', 'Adventure', 'Fantasy'], anticipated: true },

  // Series
  { type: 'series', title: 'The Twilight Zone', year: 1959, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'series', title: 'Doctor Who', year: 1963, genres: ['Science-Fiction', 'Adventure', 'Drama'] },
  { type: 'series', title: 'Star Trek', year: 1966, genres: ['Science-Fiction', 'Adventure'] },
  { type: 'series', title: 'The Simpsons', year: 1989, genres: ['Comedy', 'Animation'] },
  { type: 'series', title: 'Friends', year: 1994, genres: ['Comedy', 'Romance'] },
  { type: 'series', title: 'The X-Files', year: 1993, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'series', title: 'The Sopranos', year: 1999, genres: ['Drama', 'Crime'] },
  { type: 'series', title: 'The Wire', year: 2002, genres: ['Drama', 'Crime'] },
  { type: 'series', title: 'Lost', year: 2004, genres: ['Drama', 'Adventure', 'Fantasy'] },
  { type: 'series', title: 'Prison Break', year: 2005, genres: ['Action', 'Crime', 'Thriller'] },
  { type: 'series', title: 'Dexter', year: 2006, genres: ['Crime', 'Drama', 'Thriller'] },
  { type: 'series', title: 'Mad Men', year: 2007, genres: ['Drama'] },
  { type: 'series', title: 'Breaking Bad', year: 2008, genres: ['Drama', 'Crime', 'Thriller'], trend: true },
  { type: 'series', title: 'Sherlock', year: 2010, genres: ['Crime', 'Drama'] },
  { type: 'series', title: 'The Walking Dead', year: 2010, genres: ['Drama', 'Thriller'] },
  { type: 'series', title: 'Game of Thrones', year: 2011, genres: ['Fantasy', 'Drama', 'Adventure'], trend: true },
  { type: 'series', title: 'Black Mirror', year: 2011, genres: ['Science-Fiction', 'Drama', 'Thriller'] },
  { type: 'series', title: 'House of Cards', year: 2013, genres: ['Drama', 'Thriller'] },
  { type: 'series', title: 'True Detective', year: 2014, genres: ['Crime', 'Drama', 'Thriller'] },
  { type: 'series', title: 'Better Call Saul', year: 2015, genres: ['Crime', 'Drama'] },
  { type: 'series', title: 'Mr. Robot', year: 2015, genres: ['Drama', 'Thriller'] },
  { type: 'series', title: 'Stranger Things', year: 2016, genres: ['Science-Fiction', 'Drama', 'Fantasy'], trend: true },
  { type: 'series', title: 'The Crown', year: 2016, genres: ['Drama'] },
  { type: 'series', title: 'Dark', year: 2017, genres: ['Science-Fiction', 'Thriller', 'Drama'] },
  { type: 'series', title: 'Money Heist', year: 2017, genres: ['Crime', 'Drama', 'Thriller'] },
  { type: 'series', title: 'The Mandalorian', year: 2019, genres: ['Science-Fiction', 'Adventure', 'Action'] },
  { type: 'series', title: 'The Witcher', year: 2019, genres: ['Fantasy', 'Adventure', 'Action'] },
  { type: 'series', title: 'Squid Game', year: 2021, genres: ['Drama', 'Thriller', 'Action'], trend: true },
  { type: 'series', title: 'House of the Dragon', year: 2022, genres: ['Fantasy', 'Drama', 'Action'], trend: true },
  { type: 'series', title: 'Wednesday', year: 2022, genres: ['Comedy', 'Fantasy'] },
  { type: 'series', title: 'The Last of Us', year: 2023, genres: ['Drama', 'Action', 'Adventure'], trend: true },
  { type: 'series', title: 'Fallout', year: 2024, genres: ['Science-Fiction', 'Action', 'Drama'], trend: true },
  { type: 'series', title: 'Shogun', year: 2024, genres: ['Drama', 'Adventure', 'Action'], trend: true },
  { type: 'series', title: 'Stranger Things Season 5', year: 2025, genres: ['Science-Fiction', 'Drama', 'Fantasy'], anticipated: true },
  { type: 'series', title: 'The Last of Us Season 2', year: 2025, genres: ['Drama', 'Action', 'Adventure'], anticipated: true },
  { type: 'series', title: 'House of the Dragon Season 3', year: 2026, genres: ['Fantasy', 'Drama', 'Action'], anticipated: true },

  // Cartoons / animation
  { type: 'cartoon', title: 'Snow White and the Seven Dwarfs', year: 1937, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Pinocchio', year: 1940, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Bambi', year: 1942, genres: ['Animation', 'Family', 'Drama'] },
  { type: 'cartoon', title: 'Cinderella', year: 1950, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Peter Pan', year: 1953, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'Sleeping Beauty', year: 1959, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'The Jungle Book', year: 1967, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'The Little Mermaid', year: 1989, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Beauty and the Beast', year: 1991, genres: ['Animation', 'Family', 'Fantasy', 'Romance'] },
  { type: 'cartoon', title: 'Aladdin', year: 1992, genres: ['Animation', 'Family', 'Adventure', 'Fantasy'] },
  { type: 'cartoon', title: 'The Lion King', year: 1994, genres: ['Animation', 'Family', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Toy Story', year: 1995, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Mulan', year: 1998, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'Monsters, Inc.', year: 2001, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Shrek', year: 2001, genres: ['Animation', 'Family', 'Comedy', 'Fantasy'] },
  { type: 'cartoon', title: 'Finding Nemo', year: 2003, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'The Incredibles', year: 2004, genres: ['Animation', 'Family', 'Action'] },
  { type: 'cartoon', title: 'Cars', year: 2006, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Ratatouille', year: 2007, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Kung Fu Panda', year: 2008, genres: ['Animation', 'Family', 'Action', 'Comedy'] },
  { type: 'cartoon', title: 'WALL-E', year: 2008, genres: ['Animation', 'Family', 'Science-Fiction'] },
  { type: 'cartoon', title: 'Up', year: 2009, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'How to Train Your Dragon', year: 2010, genres: ['Animation', 'Family', 'Adventure', 'Fantasy'] },
  { type: 'cartoon', title: 'Despicable Me', year: 2010, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Tangled', year: 2010, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Frozen', year: 2013, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Big Hero 6', year: 2014, genres: ['Animation', 'Family', 'Action'] },
  { type: 'cartoon', title: 'Inside Out', year: 2015, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Zootopia', year: 2016, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Moana', year: 2016, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'Coco', year: 2017, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Spider-Man: Into the Spider-Verse', year: 2018, genres: ['Animation', 'Action', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'Toy Story 4', year: 2019, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Soul', year: 2020, genres: ['Animation', 'Family', 'Drama'] },
  { type: 'cartoon', title: 'Luca', year: 2021, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Encanto', year: 2021, genres: ['Animation', 'Family', 'Fantasy'] },
  { type: 'cartoon', title: 'Turning Red', year: 2022, genres: ['Animation', 'Family', 'Comedy'] },
  { type: 'cartoon', title: 'Puss in Boots: The Last Wish', year: 2022, genres: ['Animation', 'Family', 'Adventure'] },
  { type: 'cartoon', title: 'Spider-Man: Across the Spider-Verse', year: 2023, genres: ['Animation', 'Action', 'Adventure'], trend: true },
  { type: 'cartoon', title: 'The Super Mario Bros. Movie', year: 2023, genres: ['Animation', 'Family', 'Adventure', 'Comedy'] },
  { type: 'cartoon', title: 'Inside Out 2', year: 2024, genres: ['Animation', 'Family', 'Comedy'], trend: true },
  { type: 'cartoon', title: 'Kung Fu Panda 4', year: 2024, genres: ['Animation', 'Family', 'Action', 'Comedy'] },
  { type: 'cartoon', title: 'Toy Story 5', year: 2026, genres: ['Animation', 'Family', 'Comedy'], anticipated: true },
  { type: 'cartoon', title: 'Frozen 3', year: 2027, genres: ['Animation', 'Family', 'Fantasy'], anticipated: true },
]

function stablePoster(seed: Seed) {
  const colors: Record<string, [string, string]> = {
    movie: ['#7c3aed', '#0f172a'],
    series: ['#0891b2', '#0f172a'],
    cartoon: ['#f59e0b', '#7c2d12'],
  }
  const [a, b] = colors[seed.type]
  const safeTitle = seed.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const safeGenre = seed.genres.slice(0, 2).join(' · ').replace(/&/g, '&amp;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="r" cx="50%" cy="25%" r="70%"><stop offset="0" stop-color="white" stop-opacity="0.22"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect width="600" height="900" fill="url(#g)"/><rect width="600" height="900" fill="url(#r)"/><circle cx="500" cy="120" r="90" fill="white" opacity="0.08"/><circle cx="90" cy="780" r="140" fill="white" opacity="0.08"/><text x="44" y="95" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#f8fafc" opacity="0.82" font-weight="700">${seed.type.toUpperCase()}</text><text x="44" y="150" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#f8fafc" opacity="0.75">${seed.year}</text><foreignObject x="44" y="250" width="512" height="320"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,Helvetica,sans-serif;color:#fff;font-size:54px;font-weight:800;line-height:1.05;word-break:break-word;text-shadow:0 8px 30px rgba(0,0,0,.45)">${safeTitle}</div></foreignObject><text x="44" y="760" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#f8fafc" opacity="0.75">${safeGenre}</text><rect x="44" y="800" width="190" height="44" rx="22" fill="white" opacity="0.14"/><text x="70" y="830" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#f8fafc" font-weight="700">Trailer</text></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
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

function toItem(seed: Seed): Item {
  return {
    id: `${seed.type}-${seed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    type: seed.type,
    title: seed.title,
    originalTitle: seed.title,
    year: String(seed.year),
    image: stablePoster(seed),
    summary: `${seed.title} · ${seed.year} · ${seed.genres.join(', ')}`,
    genres: seed.genres,
    rating: null,
    url: `https://www.google.com/search?q=${encodeURIComponent(seed.title + ' official where to watch')}`,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(seed.title + ' official trailer')}`,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'all'
  const genre = searchParams.get('genre') || ''
  const lang = searchParams.get('lang') || 'en'
  const query = searchParams.get('q') || ''
  const yearFromRaw = searchParams.get('yearFrom')
  const yearToRaw = searchParams.get('yearTo')
  const yearFrom = yearFromRaw ? Number(yearFromRaw) : null
  const yearTo = yearToRaw ? Number(yearToRaw) : null
  const mode = searchParams.get('mode') || 'default'

  let seeds = CATALOG.filter(item => type === 'all' || item.type === type)
  if (mode === 'trending') seeds = seeds.filter(item => item.trend)
  if (mode === 'anticipated') seeds = seeds.filter(item => item.anticipated || item.year >= new Date().getFullYear())
  if (query) seeds = seeds.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
  if (genre) seeds = seeds.filter(item => item.genres.some(g => g.toLowerCase() === genre.toLowerCase()))
  if (yearFrom) seeds = seeds.filter(item => item.year >= yearFrom)
  if (yearTo) seeds = seeds.filter(item => item.year <= yearTo)

  seeds = seeds.sort((a, b) => {
    if (mode === 'anticipated') return a.year - b.year
    if (mode === 'trending') return Number(b.trend) - Number(a.trend) || b.year - a.year
    return b.year - a.year
  }).slice(0, 120)

  let items = seeds.map(toItem)
  if (lang !== 'en' && items.length) {
    const titles = await translate(items.map(i => i.title), lang)
    const summaries = await translate(items.map(i => i.summary || ''), lang)
    items = items.map((item, index) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary }))
  }
  return NextResponse.json(items)
}
