import { NextResponse } from 'next/server'

export const revalidate = 3600

type MediaType = 'movie' | 'series' | 'cartoon'
type Item = { id: string; type: MediaType; title: string; originalTitle: string; year: string; image: string; summary: string; genres: string[]; rating: number | null; url: string; trailerUrl: string; source: string }
type Seed = { type: MediaType; title: string; year: number; genres: string[]; trend?: boolean; anticipated?: boolean }

const H = 'https://'
const TMDB_KEY = process.env.TMDB_API_KEY || ''
const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN || ''
const OMDB_KEY = process.env.OMDB_API_KEY || ''
const IMG = H + 'image.tmdb.org/t/p/w500'

const MOVIE_GENRES: Record<string, number> = { Action: 28, Adventure: 12, Animation: 16, Comedy: 35, Crime: 80, Drama: 18, Family: 10751, Fantasy: 14, Romance: 10749, Thriller: 53, 'Science-Fiction': 878 }
const TV_GENRES: Record<string, number> = { Action: 10759, Adventure: 10759, Animation: 16, Comedy: 35, Crime: 80, Drama: 18, Family: 10751, Fantasy: 10765, Thriller: 9648, 'Science-Fiction': 10765 }

const SEEDS: Seed[] = [
  { type: 'movie', title: 'The Godfather', year: 1972, genres: ['Drama', 'Crime'], trend: true }, { type: 'movie', title: 'The Matrix', year: 1999, genres: ['Action', 'Science-Fiction'] }, { type: 'movie', title: 'The Dark Knight', year: 2008, genres: ['Action', 'Crime', 'Drama'], trend: true }, { type: 'movie', title: 'Inception', year: 2010, genres: ['Science-Fiction', 'Action', 'Thriller'], trend: true }, { type: 'movie', title: 'Interstellar', year: 2014, genres: ['Science-Fiction', 'Drama'], trend: true }, { type: 'movie', title: 'Dune', year: 2021, genres: ['Science-Fiction', 'Adventure'], trend: true }, { type: 'movie', title: 'Oppenheimer', year: 2023, genres: ['Drama', 'Thriller'], trend: true }, { type: 'movie', title: 'Dune: Part Two', year: 2024, genres: ['Science-Fiction', 'Adventure'], trend: true }, { type: 'movie', title: 'Superman', year: 2025, genres: ['Action', 'Adventure'], anticipated: true },
  { type: 'series', title: 'Breaking Bad', year: 2008, genres: ['Drama', 'Crime'], trend: true }, { type: 'series', title: 'Game of Thrones', year: 2011, genres: ['Fantasy', 'Drama'], trend: true }, { type: 'series', title: 'Stranger Things', year: 2016, genres: ['Science-Fiction', 'Drama'], trend: true }, { type: 'series', title: 'Squid Game', year: 2021, genres: ['Drama', 'Thriller'], trend: true }, { type: 'series', title: 'The Last of Us', year: 2023, genres: ['Drama', 'Action'], trend: true }, { type: 'series', title: 'Fallout', year: 2024, genres: ['Science-Fiction', 'Action'], trend: true },
  { type: 'cartoon', title: 'The Lion King', year: 1994, genres: ['Animation', 'Family'], trend: true }, { type: 'cartoon', title: 'Toy Story', year: 1995, genres: ['Animation', 'Family'] }, { type: 'cartoon', title: 'Shrek', year: 2001, genres: ['Animation', 'Comedy'] }, { type: 'cartoon', title: 'Finding Nemo', year: 2003, genres: ['Animation', 'Family'] }, { type: 'cartoon', title: 'Frozen', year: 2013, genres: ['Animation', 'Family'], trend: true }, { type: 'cartoon', title: 'Inside Out', year: 2015, genres: ['Animation', 'Family'], trend: true }, { type: 'cartoon', title: 'Inside Out 2', year: 2024, genres: ['Animation', 'Family'], trend: true }, { type: 'cartoon', title: 'Toy Story 5', year: 2026, genres: ['Animation', 'Family'], anticipated: true },
]

function norm(v: string) { return v.toLowerCase().replace(/[^a-z0-9]+/g, '') }
function strip(v?: string) { return (v || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() }
function apiLang(l: string) { return ({ az: 'az-AZ', ru: 'ru-RU', de: 'de-DE', tr: 'tr-TR', en: 'en-US' } as Record<string, string>)[l] || 'en-US' }
function fallback(seed: Seed) { const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900"><rect width="600" height="900" fill="#111827"/><rect width="600" height="900" fill="#7c3aed" opacity=".35"/><text x="40" y="100" fill="white" font-family="Arial" font-size="28" font-weight="700">${seed.type.toUpperCase()} · ${seed.year}</text><text x="40" y="430" fill="white" font-family="Arial" font-size="44" font-weight="800">${seed.title.replace(/&/g, '&amp;')}</text></svg>`; return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` }
function pass(item: Item, type: MediaType, genre: string, from: number | null, to: number | null, q: string) { return item.type === type && (!genre || item.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase()) || (type === 'cartoon' && genre === 'Animation')) && (!from || !item.year || Number(item.year) >= from) && (!to || !item.year || Number(item.year) <= to) && (!q || item.title.toLowerCase().includes(q.toLowerCase()) || item.originalTitle.toLowerCase().includes(q.toLowerCase())) }

async function tmdbFetch(path: string, params: Record<string, string | number | undefined>) {
  if (!TMDB_KEY && !TMDB_TOKEN) return null
  const url = new URL(H + 'api.themoviedb.org/3' + path)
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') url.searchParams.set(key, String(value)) })
  if (TMDB_KEY) url.searchParams.set('api_key', TMDB_KEY)
  const headers: HeadersInit = {}
  if (TMDB_TOKEN) headers.Authorization = `Bearer ${TMDB_TOKEN}`
  try { const res = await fetch(url.toString(), { headers, next: { revalidate: 3600 } }); return res.ok ? await res.json() : null } catch { return null }
}

function tmdbItem(row: any, type: MediaType, genreMap: Record<number, string>): Item {
  const title = row.title || row.name || row.original_title || row.original_name || 'Untitled'
  const originalTitle = row.original_title || row.original_name || title
  const date = row.release_date || row.first_air_date || ''
  const year = date ? String(date).slice(0, 4) : ''
  const genres = Array.isArray(row.genre_ids) ? row.genre_ids.map((id: number) => genreMap[id]).filter(Boolean) : []
  const media = type === 'series' ? 'tv' : 'movie'
  return { id: `tmdb-${media}-${row.id}`, type, title, originalTitle, year, image: row.poster_path ? IMG + row.poster_path : fallback({ type, title, year: Number(year) || 0, genres }), summary: row.overview || `${title} · ${year}`, genres, rating: typeof row.vote_average === 'number' ? Number(row.vote_average.toFixed(1)) : null, url: H + `www.themoviedb.org/${media}/${row.id}`, trailerUrl: H + 'www.youtube.com/results?search_query=' + encodeURIComponent(originalTitle + ' official trailer'), source: 'TMDb' }
}

async function getTmdb(type: MediaType, mode: string, l: string, q: string, genre: string, from: number | null, to: number | null, page: number): Promise<Item[]> {
  const media = type === 'series' ? 'tv' : 'movie'
  const genreSource = type === 'series' ? TV_GENRES : MOVIE_GENRES
  const genreMap: Record<number, string> = Object.fromEntries(Object.entries(genreSource).map(([name, id]) => [id, name]))
  const genreId = genreSource[genre]
  let endpoint = `/discover/${media}`
  const params: Record<string, string | number | undefined> = { language: apiLang(l), sort_by: 'popularity.desc', include_adult: 'false', page }
  if (q) { endpoint = `/search/${media}`; params.query = q } else if (mode === 'trending') endpoint = `/trending/${media}/week`; else if (mode === 'anticipated') endpoint = type === 'series' ? '/discover/tv' : '/movie/upcoming'
  if (!q && endpoint.includes('/discover/')) { if (type === 'cartoon') params.with_genres = genreId ? `${MOVIE_GENRES.Animation},${genreId}` : `${MOVIE_GENRES.Animation}`; else if (genreId) params.with_genres = genreId; if (from) params[type === 'series' ? 'first_air_date.gte' : 'primary_release_date.gte'] = `${from}-01-01`; if (to) params[type === 'series' ? 'first_air_date.lte' : 'primary_release_date.lte'] = `${to}-12-31` }
  const data = await tmdbFetch(endpoint, params)
  return (Array.isArray(data?.results) ? data.results : []).map((row: any) => tmdbItem(row, type, genreMap)).filter((item: Item) => pass(item, type, genre, from, to, q))
}

async function getTvMaze(q: string, page: number): Promise<Item[]> {
  try {
    const url = q ? H + 'api.tvmaze.com/search/shows?q=' + encodeURIComponent(q) : H + 'api.tvmaze.com/shows?page=' + String(Math.max(0, page - 1))
    const data = await (await fetch(url, { next: { revalidate: 3600 } })).json()
    const rows = q ? (Array.isArray(data) ? data.map((x: any) => x.show) : []) : (Array.isArray(data) ? data : [])
    return rows.slice(0, 80).map((show: any): Item => ({ id: `tvmaze-${show.id}`, type: 'series', title: show.name, originalTitle: show.name, year: show.premiered ? String(show.premiered).slice(0, 4) : '', image: show.image?.original || show.image?.medium || fallback({ type: 'series', title: show.name, year: 0, genres: show.genres || [] }), summary: strip(show.summary), genres: show.genres || [], rating: show.rating?.average || null, url: show.officialSite || show.url, trailerUrl: H + 'www.youtube.com/results?search_query=' + encodeURIComponent(show.name + ' official trailer'), source: 'TVMaze' }))
  } catch { return [] }
}

async function getJikan(q: string, mode: string, page: number): Promise<Item[]> {
  try {
    const url = q ? H + 'api.jikan.moe/v4/anime?q=' + encodeURIComponent(q) + '&limit=24&page=' + String(page) : H + 'api.jikan.moe/v4/top/anime?limit=24&page=' + String(page) + (mode === 'anticipated' ? '&filter=upcoming' : '')
    const data = await (await fetch(url, { next: { revalidate: 3600 } })).json()
    return (Array.isArray(data?.data) ? data.data : []).map((anime: any): Item => ({ id: `jikan-${anime.mal_id}`, type: 'cartoon', title: anime.title_english || anime.title, originalTitle: anime.title, year: anime.year ? String(anime.year) : (anime.aired?.from ? String(anime.aired.from).slice(0, 4) : ''), image: anime.images?.jpg?.large_image_url || anime.images?.webp?.large_image_url || fallback({ type: 'cartoon', title: anime.title, year: 0, genres: ['Animation'] }), summary: strip(anime.synopsis), genres: ['Animation', ...(anime.genres || []).map((g: any) => g.name).slice(0, 2)], rating: anime.score || null, url: anime.url, trailerUrl: anime.trailer?.url || H + 'www.youtube.com/results?search_query=' + encodeURIComponent(anime.title + ' trailer'), source: 'Jikan' }))
  } catch { return [] }
}

async function wiki(seed: Seed) { for (const title of [seed.title, `${seed.title} (film)`, `${seed.title} (TV series)`]) { try { const res = await fetch(H + 'en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title), { next: { revalidate: 3600 } }); if (!res.ok) continue; const data = await res.json(); return { image: data?.thumbnail?.source || data?.originalimage?.source, summary: strip(data?.extract), url: data?.content_urls?.desktop?.page } } catch {} } return null }
async function seedItems(type: MediaType, mode: string, q: string, genre: string, from: number | null, to: number | null): Promise<Item[]> { let seeds = SEEDS.filter((seed: Seed) => seed.type === type); if (mode === 'trending') seeds = seeds.filter((seed: Seed) => seed.trend); if (mode === 'anticipated') seeds = seeds.filter((seed: Seed) => seed.anticipated || seed.year >= new Date().getFullYear()); seeds = seeds.filter((seed: Seed) => (!q || seed.title.toLowerCase().includes(q.toLowerCase())) && (!genre || seed.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase())) && (!from || seed.year >= from) && (!to || seed.year <= to)); return Promise.all(seeds.map(async (seed: Seed): Promise<Item> => { const w = await wiki(seed); return { id: `seed-${seed.type}-${norm(seed.title)}`, type: seed.type, title: seed.title, originalTitle: seed.title, year: String(seed.year), image: w?.image || fallback(seed), summary: w?.summary || `${seed.title} · ${seed.year}`, genres: seed.genres, rating: null, url: w?.url || H + 'www.google.com/search?q=' + encodeURIComponent(seed.title), trailerUrl: H + 'www.youtube.com/results?search_query=' + encodeURIComponent(seed.title + ' trailer'), source: w?.image ? 'Wikipedia' : 'Local' } })) }
async function enrich(item: Item): Promise<Item> { if (!OMDB_KEY) return item; try { const url = new URL(H + 'www.omdbapi.com/'); url.searchParams.set('apikey', OMDB_KEY); url.searchParams.set('t', item.originalTitle || item.title); if (item.year) url.searchParams.set('y', item.year); const data = await (await fetch(url.toString(), { next: { revalidate: 3600 } })).json(); if (data?.Response === 'False') return item; return { ...item, image: item.image.startsWith('data:') && data.Poster && data.Poster !== 'N/A' ? data.Poster : item.image, summary: item.summary || data.Plot || item.summary, rating: item.rating || (data.imdbRating && data.imdbRating !== 'N/A' ? Number(data.imdbRating) : null), url: data.imdbID ? H + `www.imdb.com/title/${data.imdbID}/` : item.url, source: `${item.source}+OMDb` } } catch { return item } }
function unique(items: Item[]) { const seen = new Set<string>(); return items.filter((item: Item) => { const key = `${item.type}-${norm(item.originalTitle || item.title)}-${item.year}`; if (seen.has(key)) return false; seen.add(key); return true }) }
async function trTexts(texts: string[], l: string) { if (!l || l === 'en' || !texts.length) return texts; try { const res = await fetch(H + 'translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + l + '&dt=t&q=' + encodeURIComponent(texts.join('\n---\n'))); const data = await res.json(); return (data?.[0]?.map((x: any) => x?.[0]).join('') || texts.join('\n---\n')).split('\n---\n') } catch { return texts } }

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams
  const type = (sp.get('type') || 'movie') as MediaType | 'all'
  const genre = sp.get('genre') || ''
  const l = sp.get('lang') || 'en'
  const q = sp.get('q') || ''
  const mode = sp.get('mode') || 'default'
  const page = Math.max(1, Number(sp.get('page') || '1'))
  const from = sp.get('yearFrom') ? Number(sp.get('yearFrom')) : null
  const to = sp.get('yearTo') ? Number(sp.get('yearTo')) : null
  const types: MediaType[] = type === 'all' ? ['movie', 'series', 'cartoon'] : [type as MediaType]
  let items: Item[] = []
  for (const mediaType of types) {
    const parts: Item[][] = await Promise.all([getTmdb(mediaType, mode, l, q, genre, from, to, page), mediaType === 'series' ? getTvMaze(q, page) : Promise.resolve([] as Item[]), mediaType === 'cartoon' ? getJikan(q, mode, page) : Promise.resolve([] as Item[]), seedItems(mediaType, mode, q, genre, from, to)])
    for (const group of parts) items.push(...group.filter((item: Item) => pass(item, mediaType, genre, from, to, q)))
  }
  items = unique(items).sort((a: Item, b: Item) => Number(!a.image.startsWith('data:')) - Number(!b.image.startsWith('data:')) || Number(b.rating || 0) - Number(a.rating || 0) || Number(b.year || 0) - Number(a.year || 0)).slice(0, 80)
  if (OMDB_KEY) items = await Promise.all(items.slice(0, 50).map((item: Item) => enrich(item)))
  if (l !== 'en') { const titles = await trTexts(items.map((item: Item) => item.title), l); const summaries = await trTexts(items.map((item: Item) => item.summary || ''), l); items = items.map((item: Item, index: number) => ({ ...item, title: titles[index] || item.title, summary: summaries[index] || item.summary })) }
  return NextResponse.json(items)
}
