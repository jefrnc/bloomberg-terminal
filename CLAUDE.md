# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bloomberg Terminal clone — a financial terminal UI built with Next.js 15 (App Router), React 19, and TypeScript. Displays simulated real-time market data with regional views (Americas, EMEA, Asia-Pacific), watchlists, keyboard shortcuts, and AI-powered market analysis.

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Lint with Biome.js
pnpm format           # Format with Biome.js
pnpm typecheck        # TypeScript type checking (no emit)
```

Package manager: **pnpm**

## Architecture

### Data Flow

1. `/api/market-data` generates realistic market movements using sentiment factors, regional correlations, and per-index volatility
2. Data is cached in Upstash Redis (1-hour TTL) with fallback data if Redis is unavailable
3. Client polls via React Query — 30s intervals in real-time mode, 5min in standard mode
4. Jotai atoms hold UI state (view, filters, dark mode, watchlists)
5. `/api/ai` provides streaming GPT-4 market commentary (rate-limited, Zod-validated, origin-checked)

### State Management

- **Jotai atoms** (`components/bloomberg/atoms/`) — all UI state: current view, filters, theme, modals, watchlists
- **React Query** — server/market data with automatic polling configured in `useMarketDataQuery`
- **Custom hooks** (`components/bloomberg/hooks/`) — compose Jotai + React Query: `useTerminalUI`, `useMarketDataQuery`, `useAiMarketAnalysis`

### Key Component Structure

- `components/bloomberg/layout/bloomberg-terminal.tsx` — main orchestrator, keyboard shortcuts, view switching
- `components/bloomberg/views/` — full-screen views (market, movers, news, volatility, rmi)
- `components/bloomberg/ui/` — terminal-specific UI (market-table, sparklines, market-row)
- `components/bloomberg/core/` — reusable primitives (buttons, modals)
- `components/ui/` — shadcn/ui base components

### API Routes

| Route | Purpose |
|---|---|
| `/api/market-data` | GET fetches data, POST with `action: "update"` triggers simulation |
| `/api/ai` | Streaming AI analysis (Edge Runtime, 20 req/min rate limit) |
| `/api/seed-redis` | Initialize Redis with market data |
| `/api/init-scheduler` | Start background refresh scheduler |

### External Services

- **Upstash Redis** — data persistence with retry logic and graceful fallback
- **Alpha Vantage** — real market data fetching (`lib/alpha-vantage.ts`)
- **OpenAI** via AI SDK — market analysis streaming

## Code Style

Biome.js enforces: 2-space indentation, double quotes, trailing commas (ES5), semicolons always, organized imports. Line width 100.

## Environment Variables

See `.env.local.example`: requires `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `ALPHA_VANTAGE_API_KEY`, `OPENAI_API_KEY`, and `ALLOWED_ORIGINS` for CORS.
