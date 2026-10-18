# World Dashboard

A real-time, multilingual dashboard that brings crypto and stock markets, world news, prediction markets, AI tools, entertainment, education, travel and more into one place.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **SWR** and **Supabase** (optional auth), and deployed on **Vercel**.

## Features

- Live crypto, stocks and market stats (CoinGecko, Yahoo Finance, Fear & Greed)
- World news by category from public RSS feeds, plus the daily "Horizon" briefing
- Polymarket prediction markets, trending videos, movies and series
- AI tools, software, education, travel, health and Germany directories
- 12 interface languages (including RTL Arabic)
- Command palette (`⌘K` / `Ctrl+K`), keyboard shortcuts (`?`) and a PWA service worker

## Getting started

Requires Node.js 18.17 or newer.

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Scripts

| Command             | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | Production build (also lints and type-checks) |
| `npm start`         | Serve the production build           |
| `npm run lint`      | ESLint (`next/core-web-vitals`)      |
| `npm run typecheck` | TypeScript check with no emit        |

## Environment variables

Everything works without keys, using free public APIs. These optional variables unlock extra features. Put them in `.env.local` for local development, or in the Vercel project settings.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sign-in, the `/admin` page and page-view stats |
| `NEXT_PUBLIC_SITE_URL` | Site URL sent with AI assistant requests |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | The AI assistant |
| `TMDB_API_KEY`, `TMDB_READ_ACCESS_TOKEN`, `OMDB_API_KEY` | Movies and series data |
| `YOUTUBE_API_KEY` | YouTube trending |
| `MYMEMORY_EMAIL` | Higher quota for on-the-fly translations |

## Project layout

```
app/          Pages (App Router) and API routes under app/api/*
components/   Widgets and UI components
lib/          Translations, language/theme context, Supabase client, helpers
public/       Web manifest and service worker
vercel.json   Daily cron jobs (Supabase keep-alive, Horizon refresh)
```

## Deployment

The site deploys on Vercel: pushing to `main` builds and publishes production. See [DEPLOY.md](./DEPLOY.md) for details.
