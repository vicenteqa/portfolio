# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website built with Next.js 15, showcasing professional experience, projects, and personal interests. The site features smooth page transitions with Framer Motion, a contact form via EmailJS, and a unique music section that displays Spotify albums from the user's vinyl collection.

## Recommended Claude Code Skills

This project benefits from the following managed skills:

### frontend-design
Use this skill for UI/UX improvements, designing new pages, or enhancing visual components. This skill was used to:
- Redesign the Services page with real QA/testing content
- Add form validation and custom toast notifications to Contact page
- Enhance typography with Syne and DM Sans fonts
- Create loading skeletons for the Music page
- Add micro-interactions (button ripples, hover effects)
- Improve mobile experience and accessibility

**When to use**: Any time you need to create or improve frontend components, design new pages, or enhance visual aesthetics.

### find-skills
Use this skill to discover additional skills from the marketplace.

**When to use**: When looking for specialized functionality not covered by existing skills.

## Common Commands

### Development
```bash
npm run dev         # Start development server at http://localhost:3000
npm run build       # Build production bundle
npm start           # Start production server
npm run lint        # Run ESLint
```

### Testing
```bash
npx playwright test                    # Run all Playwright tests
npx playwright test --project=chromium # Run tests in specific browser
npx playwright test tests/home-page.spec.ts # Run specific test file
npx playwright show-report             # View test report
```

The Playwright config (playwright.config.ts) automatically starts the dev server before running tests.

## Architecture

### Framework & Routing
- **Next.js 15** with App Router architecture
- Pages are located in `app/` directory using the file-based routing convention
- Routes: `/` (home), `/resume`, `/contact`, `/collection` (vinyl + games; `/music` redirects here) (`/funStuff` exists but is hidden from the nav until its content is updated; nav list lives in `lib/routes.js`)

### Component Structure
- **UI Components**: Located in `components/ui/` - built with Radix UI primitives and styled with Tailwind
- **Feature Components**: Located in `components/` - Header, Nav, MobileNav, CommandPalette (Ctrl/Cmd+K or `/`), StatusBar, PageHeader, HeroRecord, ReportCard, CrateDigger (music game)
- **Responsive Navigation**: Desktop nav in Nav.jsx, mobile nav in MobileNav.jsx (below xl). MobileNav is a controlled Sheet that closes on route change: a portal sheet otherwise outlives client navigation and covers the new page.

### Styling & Theming
- Concept: the site is a CI run. Mono labels (`// 02 resume`), pass/pending test rows, an editor-style status bar, terminal route curtain.
- **Tailwind** config in tailwind.config.js. Tokens: `ink` (page bg), `primary` (navy panels), `accent` cyan `#29d4ff`, `amber`, `success`, `error`.
- **Fonts** (next/font in app/layout.jsx, exposed as CSS vars): `font-display` Bricolage Grotesque, `font-body` Hanken Grotesk, `font-mono` Fira Code. Do not use undefined families/colors: Tailwind silently ignores unknown classes.
- Global look (grid background, film grain, selection, `.eyebrow`, `.panel`) lives in app/globals.css.
- **Breakpoints**: sm: 640px, md: 768px, lg: 960px, xl: 1200px
- Uses `tailwind-merge` and `class-variance-authority` for dynamic styling

### Page Transitions
- `app/template.jsx` re-mounts on each navigation and plays a pure-CSS "playwright test" curtain (`.route-run` in globals.css) plus a fade-in. No AnimatePresence/exit animations: nothing to wait on, nothing that can block clicks.
- Header is `z-50`, curtain `z-40` with `pointer-events: none`.

### API Architecture
- **Legacy Pages API**: API routes in `pages/api/` directory (not App Router)
- `pages/api/get-albums.js`: thin GET-only endpoint over `lib/albums.js` (Spotify service: 1h cache, stale-if-error, 5 min failure cache, single in-flight refresh, page cap, only follows api.spotify.com URLs; unit-testable via injected `http`). nginx rate-limits `/api/` (5 r/s, burst 20) in `deploy/nginx/portfolio.conf`.
  - Refreshes OAuth token using refresh_token grant
  - Fetches all of the user's saved albums (pages of 50, following `next`)
  - Shuffles and returns them all; serves `app/music/music.json` if Spotify fails
  - Cleans album names by removing parenthetical text (remaster info, etc.)

### Games shelf (`/collection`, "games" tab)
- Physical games live in `data/games.csv` (title, platform, note, optional igdb_id). `npm run sync:games` builds `app/collection/games.json` and, with `IGDB_CLIENT_ID`/`IGDB_CLIENT_SECRET` in `.env`, downloads year + cover art from IGDB into `public/games/*.webp` (resized to 264px). It only fetches what is missing; `--refresh` redoes everything; low-confidence matches and misses are listed at the end: fix them by putting the right IGDB id in the CSV. Visitors never hit IGDB.
- UI: `components/GameShelf.jsx` (a shelf per platform; cases without a cover render as tinted title cards). `/music` redirects to `/collection` (next.config.mjs).

### Music Section
- Displays albums from Spotify API via `/api/get-albums` endpoint
- Falls back to static `music.json` if the API fails
- Returns the whole library (follows Spotify pagination), shuffled on each request
- UI is `components/CrateDigger.jsx`: a looping record crate (wheel/swipe/arrows). Pull a record out, drag it onto the turntable; the spinning record links to the album. No Spotify branding in the UI.
- Spotify refresh tokens expire (app setting `refreshTokenTtlMillis`, ~180 days). Regenerate with `node --env-file=.env scripts/get-spotify-token.mjs` (needs redirect URI `http://127.0.0.1:4000/callback` registered).
- Images loaded from Spotify CDN (i.scdn.co)

### Contact Form
- Posts to `app/api/contact/route.js` (nodemailer over SMTP, Gmail app password). Validation, escaping and the mail body live in `lib/contact.js`; the route adds a honeypot (`bot-field`) and a per-IP limit (5/hour, in memory). Messages go to `CONTACT_EMAIL`; the visitor is in Reply-To.
- Form clears after successful submission
- Includes client-side validation with real-time error feedback
- Custom toast notifications for success/error states
- Environment variables: SMTP_USER, SMTP_PASS (required), SMTP_HOST (default smtp.gmail.com), SMTP_PORT (default 465), CONTACT_EMAIL (default SMTP_USER)

### Environment Variables
Required in `.env.local`:
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify app secret
- `SPOTIFY_REFRESH_TOKEN` - OAuth refresh token
- `SMTP_USER`, `SMTP_PASS` - mailbox used by `/api/contact` (optional: `SMTP_HOST`, `SMTP_PORT`, `CONTACT_EMAIL`)

Note: Spotify variables are exposed through the `env` block in `next.config.mjs`, not the `NEXT_PUBLIC_` prefix.

### Testing Strategy
- **Playwright** for E2E testing
- **Page Object Model**: Test helpers in `page-object/` directory
- Visual regression testing with screenshots (maxDiffPixelRatio: 0.05)
- Tests run across multiple browsers: chromium, firefox, webkit, Mobile Chrome, Mobile Safari
- Custom wait logic for animation completion (opacity checks)

### ESLint Configuration
- Extends `next/core-web-vitals`
- Disables quote-related rules for flexibility
- Allows unescaped entities in JSX
- No strict escape validation

## Key Implementation Details

### Image Optimization
- Next.js Image component used throughout
- Remote image domains whitelisted in next.config.mjs: `i.scdn.co`, `open.spotify.com`

### Client vs Server Components
- Default to Server Components unless 'use client' directive is present
- Client components: Contact form, Music page, PageTransition, StairTransition, Nav components
- Uses React hooks (useState, useEffect) in client components

### Animation & Interaction
- Framer Motion for page transitions and micro-interactions
- Swiper.js for carousel functionality (WorkSliderBtns component)
- React CountUp for animated statistics
- Radix UI for accessible, unstyled component primitives

### Development Notes
- The project uses ES modules (`"type": "module"` in package.json)
- React Strict Mode enabled in next.config.mjs
- Static assets in `public/assets/` directory
