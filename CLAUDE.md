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
- Routes: `/` (home), `/resume`, `/services`, `/contact`, `/music`, `/funStuff`

### Component Structure
- **UI Components**: Located in `components/ui/` - built with Radix UI primitives and styled with Tailwind
- **Feature Components**: Located in `components/` - includes Header, Nav, PageTransition, StairTransition, Photo, Social, Stats
- **Responsive Navigation**: Desktop nav in Nav.jsx, mobile nav in MobileNav.jsx (appears below xl breakpoint)

### Styling & Theming
- **Tailwind CSS** with custom configuration in tailwind.config.js
- **Custom Colors**:
  - Primary: `#15202b` (dark background)
  - Accent: `#29d4ff` (cyan blue), hover: `#1d9bf0`
- **Breakpoints**: sm: 640px, md: 768px, lg: 960px, xl: 1200px
- **Font**: Fira Code loaded via next/font/google
- Uses `tailwind-merge` and `class-variance-authority` for dynamic styling

### Page Transitions
- All pages wrapped in PageTransition component (Framer Motion)
- StairTransition provides animated stair-step effect between route changes
- Both components are client-side rendered ('use client' directive)

### API Architecture
- **Legacy Pages API**: API routes in `pages/api/` directory (not App Router)
- `pages/api/get-albums.js`: Spotify integration endpoint
  - Refreshes OAuth token using refresh_token grant
  - Fetches user's saved albums (limit 50)
  - Shuffles and returns random subset of 35 albums
  - Cleans album names by removing parenthetical text (remaster info, etc.)

### Music Section
- Displays albums from Spotify API via `/api/get-albums` endpoint
- Falls back to static `music.json` if API fails
- Random selection changes on each page reload
- Images loaded from Spotify CDN (i.scdn.co)

### Contact Form
- Uses EmailJS for form submission (client-side email service)
- Form clears after successful submission
- Includes client-side validation with real-time error feedback
- Custom toast notifications for success/error states
- Environment variables: EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, EMAIL_SERVICE_UID

### Environment Variables
Required in `.env.local`:
- `SPOTIFY_CLIENT_ID` - Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Spotify app secret
- `SPOTIFY_REFRESH_TOKEN` - OAuth refresh token
- `EMAIL_SERVICE_ID` - EmailJS service ID (exposed to client via next.config.mjs)
- `EMAIL_TEMPLATE_ID` - EmailJS template ID (exposed to client via next.config.mjs)
- `EMAIL_SERVICE_UID` - EmailJS user ID (exposed to client via next.config.mjs)

Note: These variables are made available to client components through the `env` configuration in `next.config.mjs`, not the `NEXT_PUBLIC_` prefix.

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
