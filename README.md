# PeekersNest

PeekersNest is a full-stack AI-powered shopping deals scouting app built with Next.js, TypeScript, Tailwind CSS, and the OpenAI API. It ranks product listings, compares shopping options, and generates concise deal insights. The current build uses live eBay results through ScraperAPI.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn-style reusable UI primitives
- OpenAI API via server-side routes only
- Deployment target: Vercel

## Features

- Natural-language product search
- Live eBay listing retrieval
- Weighted ranking engine with 0-100 deal score
- Filters for price, rating, seller, stock, and sorting
- OpenAI-generated best overall, budget, and premium picks
- Product detail modal with pros, cons, and specs
- 2-4 product comparison flow with AI-written summary
- Lightweight in-app recent search history
- ScraperAPI-powered eBay retrieval

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
copy .env.example .env.local
```

3. Set the required variables in `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
SCRAPERAPI_KEY=your_scraperapi_key
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Running with Docker

A `Dockerfile` and `.dockerignore` are included at the project root.

1. Build the image:

```bash
docker build -t peekers-nest .
```

2. Run the container, passing in your environment file:

```bash
docker run -p 3000:3000 --env-file .env.local peekers-nest
```

Open `http://localhost:3000`.

Notes:

- `SCRAPERAPI_KEY`, `OPENAI_API_KEY`, and `OPENAI_MODEL` must be present in the file you pass to `--env-file`, or search and AI routes will return errors at request time.
- If your keys live in `.env.local` and your database URL in `.env`, pass both (later files override earlier ones):

```bash
docker run -p 3000:3000 --env-file .env --env-file .env.local peekers-nest
```

- Never bake secrets into the image — always pass them at run time via `--env-file` or `-e KEY=value`.

## Project Structure

```text
app/
  api/
  compare/
  search/
components/
  cards/
  compare/
  insights/
  layout/
  search/
  states/
  ui/
lib/
  ai/
  data/
  providers/
  ranking/
  validation/
prisma/
```

## Architecture Notes

- `lib/providers/*` contains the provider abstraction used for live eBay retrieval.
- `lib/providers/ebay.ts` calls ScraperAPI's structured eBay search endpoint and normalizes the results into the app's shared listing schema.
- `lib/ranking/engine.ts` calculates normalized price competitiveness, rating, discount, source trust, and shipping advantage into a final 0-100 deal score.
- `lib/ai/openai.ts` handles all OpenAI calls server-side and falls back safely if the key is missing or the response is malformed.
- `app/api/*` exposes `search`, `compare`, `ai-summary`, and `search-history`.
- `lib/history.ts` provides a no-database recent-search and cache fallback so the core app runs immediately.

## Deployment Notes

- The app is structured for Vercel deployment with server-side API routes.
- Add `OPENAI_API_KEY`, `OPENAI_MODEL`, and `SCRAPERAPI_KEY` as Vercel environment variables.
- A database can be added later for persisted history and caching, but it is not required for the current core flow.

## Resume-Ready Description

Built PeekersNest, a full-stack AI shopping deals scouting platform using Next.js, TypeScript, Prisma, Tailwind, and the OpenAI API; aggregated multi-source product listings, designed a weighted deal-ranking engine, and shipped AI-generated comparison and recommendation workflows that reduced manual deal analysis into a single searchable interface.
