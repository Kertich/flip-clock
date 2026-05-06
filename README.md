# Flip Clock UI

A premium Apple-inspired flip clock built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Highlights

- Realistic `HH:MM:SS` flip animation with smooth cubic-bezier transitions
- Component-based architecture for maintainability:
  - `FlipClock`
  - `FlipUnit`
  - `FlipCard`
- Fully responsive for mobile, tablet, and desktop
- Modern minimal UI with subtle depth, gradients, and glassmorphism
- Optional enhancements:
  - Dark/Light mode toggle
  - Timezone selector (UI-only)
  - Flip sound toggle (Web Audio API)

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- ESLint

## Local Development

### Install dependencies

```bash
npm install
```

### Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

### Option 1: Vercel Dashboard (recommended)

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com/new) and import the repository.
3. Keep default Next.js settings and click **Deploy**.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

If you use token auth:

```bash
vercel --prod --token <YOUR_VERCEL_TOKEN>
```

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  flip-clock/
    FlipCard.tsx
    FlipClock.tsx
    FlipUnit.tsx
```

## Notes

- Frontend-only implementation (no backend, no external APIs).
- Timezone handling is fully client-side via `Intl.DateTimeFormat`.
