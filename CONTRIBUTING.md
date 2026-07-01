# Contributing to Weather

Thanks for your interest in contributing! This project is intentionally simple — plain HTML, CSS, and vanilla JavaScript with no runtime build step or frameworks.

## Principles

- **No bloat.** Every byte matters. No frameworks, no runtime npm packages, no bundlers.
- **No tracking.** No analytics, no cookies, no fingerprinting. Ever.
- **Free APIs only.** All weather data must come from free, no-API-key-required sources.
- **Fast.** The site should load in under 1 second on any connection.
- **Privacy first.** No user data is collected, stored, or transmitted beyond what's needed to fetch weather.

## How to Contribute

1. Fork the repo
2. Create a branch (`git checkout -b my-feature`)
3. Make your changes
4. Test locally (`npx http-server . -p 8080`)
5. Submit a pull request

## What We're Looking For

- Bug fixes
- Accessibility improvements
- New free weather data sources
- International postal code support for more countries
- Performance optimizations
- Mobile UX improvements
- Translations (multi-language support is planned)

## What We're NOT Looking For

- Adding frameworks (React, Vue, etc.)
- Adding build tools (webpack, vite, etc.)
- Adding npm dependencies
- Analytics or tracking of any kind
- Ads or monetization beyond the donation link
- Features that require user accounts or sign-up

## Code Style

- Plain vanilla JavaScript — no TypeScript, no JSX
- CSS custom properties (`var(--text)`) for theming
- Descriptive function names
- Comments on non-obvious logic — `js/app.js` is the canonical source
- Keep it simple — if you can do it in 5 lines instead of 50, do it in 5

## Testing

There's no test suite (yet). Test manually:
- Search a US city and zip code
- Search an international city and postal code
- Toggle dark mode
- Toggle F/C and 12H/24H
- Customize sections if needed
- Minimize and hide sections
- Test on mobile
- Test the radar animation controls

## Questions?

Open an issue or reach out. We're friendly. Usually.
