# CargoNova Logistics — Premium Logistics Website

A production-quality, marketing-grade website for a modern ground-freight and cargo
transportation company. Built to feel like a serious, technology-forward international
logistics operator — not a template.

**Brand (temporary, centralized):** CargoNova Logistics · *Move Smarter. Deliver Better.*

## Overview

The site covers the full B2B logistics journey:

- **Conversion:** quick quote on the homepage, a 5-step quote flow, contextual CTAs
- **Trust:** animated metrics, enterprise case-study testimonials, fleet and safety details
- **Education:** service detail pages, industries, coverage/corridors, FAQ, blog
- **Tools:** real-time shipment tracking with a mock tracking API and animated timeline

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme` tokens) |
| UI primitives | shadcn/ui-style components (Radix + CVA) |
| Animation | Framer Motion (scroll reveals, counters, route drawing) |
| 3D | React Three Fiber (lazy-loaded hero scene, desktop only) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React + custom vehicle line icons |
| Maps | Custom animated SVG network map (no API key; Mapbox-ready structure) |
| Tests | Vitest |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest (tracking + validation logic)
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. The app runs fully without
any of them — database, email, and map keys are prepared integrations, not
requirements.

## Project structure

```
src/
  app/                  # routes: services, tracking, quote, coverage, fleet, blog, …
  components/
    layout/             # Header, Footer, MobileMenu, MobileCta
    sections/           # homepage sections (Hero, ServicesOverview, DashboardMockup, …)
    forms/              # QuoteForm (5 steps), ContactForm, CareerForm
    tracking/           # TrackingForm, TrackingResult, TrackingTimeline
    three/              # LogisticsScene (lazy 3D hero)
    map/                # NetworkMap (SVG, data-driven)
    ui/                 # shadcn-style primitives
  data/                 # content: services, industries, fleet, faq, blog, jobs, routes
  lib/                  # utils, validations, tracking, quote, seo, analytics, constants
```

## Architecture notes

- **Brand config** (`src/lib/constants.ts`) — company name, contact, and social links are
  centralized; swap the identity in one file.
- **Mock backends** — tracking lookup (`lib/tracking.ts`) and quote persistence
  (`lib/quote.ts`) are isolated behind server actions so a real TMS/API, Prisma +
  PostgreSQL, and Resend can replace them without touching UI code.
- **Analytics** — `lib/analytics.ts` defines conversion events (`quote_started`,
  `quote_completed`, `tracking_search`, …) as a no-op with provider hooks documented.
- **Maps** — `data/routes.ts` holds hubs/corridors on a normalized canvas; swap for
  lon/lat + Mapbox when a token is available.
- **SEO** — per-page metadata factory, canonical URLs, Open Graph/Twitter, sitemap,
  robots, and JSON-LD (Organization, Service, Breadcrumb, FAQ, Article).
- **Accessibility & motion** — skip link, visible focus states, semantic structure, and
  `prefers-reduced-motion` respected by every animated component.

## Future integrations

- Prisma schema + PostgreSQL persistence for quotes
- Resend transactional email (quote confirmation, notifications)
- Mapbox maps behind the coverage visualizations
- Customer portal (`/dashboard/*` routes are reserved but not linked publicly)
- Analytics providers, rate limiting, and Turnstile CAPTCHA on forms
