# APEX F1 — Race Control Dashboard

A live Formula 1 race control dashboard built in React — championship standings, session countdowns, and circuit info, pulling real-time data from public F1 APIs.

**Live Demo:** https://racing-web-assignment-j3y7.vercel.app/

## Overview

APEX F1 gives you a quick, glanceable view of the current F1 season: a rotating hero section with a live countdown to the next session, a scrollable carousel of the race calendar (with a full session-schedule modal per race), and driver/constructor standings you can search and click into for more detail. No backend, no API keys — everything is fetched client-side from public F1 data sources.

## Features

- **Live session countdown** — real-time countdown to the next practice/qualifying/race session, sourced from OpenF1, with an "ongoing" state when a session is live.
- **Circuit details** — upcoming Grand Prix location and meeting info for the next race weekend.
- **Race calendar carousel** — swipeable calendar of the season (Embla Carousel) centered on the current/next round, with a "Next Race" badge.
- **Session schedule modal** — click any race card to see the full weekend schedule (Practice, Qualifying, Sprint, Race) with correctly localized dates/times.
- **Driver & Constructor standings** — tabbed table (Drivers / Constructors) fetched from Jolpica-F1 (Ergast-compatible API), sorted by championship position.
- **Search** — filter standings live by driver name or team.
- **Driver detail modal** — click a driver row to see an expanded view of their standing.
- **Live header clock** + animated scroll-to-standings button for navigation.
- **Responsive, animated UI** — custom dark racing theme built with Tailwind CSS v4.

## Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **Tailwind CSS v4** (via `@tailwindcss/vite`) — styling
- **Embla Carousel** (`embla-carousel-react`) — race calendar carousel
- **ESLint** — linting
- **Data sources:**
  - [Jolpica-F1](https://github.com/jolpica/jolpica-f1) — driver/constructor standings, race schedule (Ergast-compatible)
  - [OpenF1](https://openf1.org/) — live sessions, weather, upcoming meeting info
- **Deployment:** Vercel

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node)

### Installation

```bash
# Clone the repo
git clone https://github.com/Lyrisink/Racing-Web-Assignment.git

# Move into this project's folder
cd Racing-Web-Assignment/Race-Control-Dashboard-Q1

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

This starts the Vite dev server — open the URL it prints (usually `http://localhost:5173`) in your browser. No `.env` file or API keys are required; both Jolpica-F1 and OpenF1 are public, key-free APIs.

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Build a production-ready bundle into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint over the codebase |

## Project Structure

```
src/
├── api/            # Fetch wrappers for Jolpica-F1 and OpenF1
├── components/      # UI components (Hero, StandingsTable, modals, carousel, etc.)
├── App.jsx          # Top-level layout
└── main.jsx          # Entry point
```

## Design Notes & Scope

- The driver detail modal intentionally shows only current-season standings data. Career stats and race-history endpoints were left out on purpose to avoid extra API calls and latency, not because they were overlooked.
- Both APIs are public and unauthenticated, so there's no rate-limit handling beyond basic try/catch error states shown in the UI.