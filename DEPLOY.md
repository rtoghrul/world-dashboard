# World Dashboard — Deploy Instructions

## Local

```bash
npm install
npm run dev          # http://localhost:3000
```

Before pushing, run the same checks the build runs:

```bash
npm run lint && npm run typecheck && npm run build
```

## Vercel (recommended, current production)

1. Import the GitHub repo in Vercel (**New Project → Import**). The framework preset is detected as Next.js; no build settings need changing.
2. Add any optional environment variables from the README (**Settings → Environment Variables**). Set `NEXT_PUBLIC_ADMIN_EMAILS` to the account(s) allowed to open `/admin`.
3. Deploy. Every push to `main` deploys production; every pull request gets a preview URL.

The cron jobs in `vercel.json` (Supabase keep-alive and the daily Horizon refresh) are picked up automatically.

## Netlify

This is a server-rendered Next.js app (API routes, middleware), so it can't be uploaded as static files. Netlify runs it through its Next.js runtime, which it enables automatically:

1. **Add new site → Import an existing project** and pick the GitHub repo.
2. Build command: `npm run build`. Leave the publish directory as Netlify suggests for Next.js (`.next`); don't upload the folder by hand.
3. Add the same environment variables as on Vercel.

Note that `vercel.json` crons don't run on Netlify. Use Netlify Scheduled Functions or an external cron to call `/api/keepalive` and `/api/horizon` daily if you need them.

## Environment variables

None are required. All data sources work with free public APIs. See the README for the optional variables.
