# Flight Log

A personal paragliding logbook: log flights (date, duration, venue, wing,
description), and see total hours flown, hours flown this year, hours by
wing, hours by year, and a few other stats. Seeded with your existing
logbook (flights 36–415, plus your basic training block of 35 flights /
8:14 logged as one entry).

Built with Next.js (App Router) + Postgres (via Neon's serverless driver,
which is what Vercel's own Postgres storage runs on) + Recharts.

## 1. Push this to GitHub

```bash
cd flightlog
git init
git add .
git commit -m "Initial paragliding logbook"
gh repo create flightlog --private --source=. --push
# or, without the gh CLI:
# create an empty repo on github.com, then:
git remote add origin https://github.com/<your-username>/flightlog.git
git branch -M main
git push -u origin main
```

## 2. Create a Postgres database

You have two easy options — pick one:

**Option A — Vercel's built-in Postgres (simplest)**
1. Go to your Vercel dashboard → your project (create it first by importing
   the GitHub repo, see step 3) → **Storage** tab → **Create Database** →
   **Postgres** (this is powered by Neon under the hood).
2. Once created, click **Connect** to your project. Vercel will automatically
   add `DATABASE_URL` (and a few related variables) to your project's
   Environment Variables — you don't need to copy/paste anything.

**Option B — Neon directly (also free)**
1. Create a database at [neon.com](https://neon.com) (free tier is plenty
   for a personal logbook).
2. Copy the connection string it gives you.
3. In your Vercel project → **Settings** → **Environment Variables**, add
   `DATABASE_URL` with that value (for Production, Preview, and Development).

## 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new), import the GitHub repo
   you just created.
2. Vercel auto-detects Next.js — no build settings to change.
3. Make sure `DATABASE_URL` is set (see step 2) before or right after the
   first deploy.
4. Deploy.

## 4. Create the table and load your existing flights

The app will auto-create the `flights` table on first API call (see
`lib/db.ts` → `ensureSchema()`), but you still need to load your existing
379 flights once. Easiest way is to run the seed script from your own
machine, pointed at the same database:

```bash
npm install
cp .env.example .env.local
# paste your DATABASE_URL into .env.local

npm run db:init   # creates the table (idempotent, safe to re-run)
npm run db:seed   # loads flights 36-415 + the training aggregate
```

If you ever want to wipe and reload from the original source data:

```bash
npm run db:seed -- --force
```

Note: the seed script only inserts the flights that were in your original
paper/spreadsheet log. Anything you add afterwards through the web app
lives permanently in the database and is untouched by re-seeding (as long
as you don't pass `--force`).

## 5. Local development

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL
npm run db:init
npm run db:seed
npm run dev
```

Visit `http://localhost:3000`.

## Notes on the source data

- Flights 1–35 (your basic training course) were logged as a single
  aggregate entry — 8:14 total — since only the total was provided, not
  per-flight detail. It shows up in the log table as "1–35".
- A few obvious date typos in the original spreadsheet were corrected
  during import based on surrounding flight order (e.g. two 2021-dated
  rows sitting between 2022 entries, one 2014-dated row sitting between
  2024 entries). If any of these guesses are wrong, just edit the row
  directly in your database, or delete and re-add it through the app.
- Flight #396 doesn't exist in your original log (it jumps from 395 to
  397) — that's preserved as-is, not a parsing error.
- "XC flights" on the dashboard is a simple heuristic: any flight whose
  description mentions "xc" or "cross country". It won't catch cross
  country flights you didn't label that way.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Neon serverless Postgres driver** (`@neondatabase/serverless`) — works
  great on Vercel's serverless functions, no persistent connections needed
- **Recharts** for the year/wing charts
- **Tailwind CSS** for styling

## Project structure

```
app/
  page.tsx              Dashboard + form + table (client component)
  layout.tsx            Fonts, global metadata
  api/flights/route.ts       GET (list), POST (add)
  api/flights/[id]/route.ts  DELETE
  api/stats/route.ts         GET computed stats
components/
  Hero.tsx, StatCard.tsx, YearChart.tsx, WingChart.tsx,
  FlightForm.tsx, FlightTable.tsx
lib/
  db.ts        Database access (Neon driver)
  types.ts     Shared TypeScript types
  schema.sql   Reference schema (also inlined in scripts + db.ts)
scripts/
  init-db.mjs         Creates the flights table
  seed.mjs            Loads your original 379 flights + training aggregate
  flights_seed.json   Your parsed logbook data
```
