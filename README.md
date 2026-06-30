# Weather

**Weather without the clutter.** [skanga.github.io/weather](https://skanga.github.io/weather/)

A fast, ad-free, privacy-respecting weather website. No tracking, no cookies, no bloat. Just weather.

## Why?

Weather websites are some of the most bloated pages on the internet. A typical weather page loads 6-12MB of JavaScript, tracking scripts, and ads just to show you the temperature. This app loads in under 530KB total — that's 10-20x lighter.

## Features

- Current conditions with feels-like, humidity, dew point, wind, gusts, UV index, and air quality
- 24-hour hourly forecast
- 10-day forecast with interactive charts (temperature, humidity/cloud/pressure, precipitation, wind)
- Animated weather radar with play/pause and speed controls
- Sunrise, sunset, solar noon, moonrise, moonset, and moon phase
- NWS severe weather alerts (US)
- Weather summary sentence generated from forecast data
- Dark mode (auto-detects OS preference, manual toggle)
- Fahrenheit/Celsius and 12H/24H toggles (auto-detects from country)
- Optional layout customization — reorder, resize, minimize, or hide sections
- Bookmarkable URLs with direct lat/lon for instant loading
- Installable as a PWA (Progressive Web App)
- International postal code support (60+ countries)
- Zero cookies, zero tracking, zero analytics

## Tech Stack

- **Frontend:** Plain HTML, CSS, vanilla JavaScript — no frameworks, no bundler, no npm dependencies at runtime
- **Hosting:** GitHub Pages (free)
- **Weather data:** [Open-Meteo API](https://open-meteo.com/) (free, no API key)
- **Radar:** [RainViewer API](https://www.rainviewer.com/api.html) (free) + [CartoDB](https://carto.com/basemaps/) map tiles
- **Alerts:** [NWS API](https://www.weather.gov/documentation/services-web-api) (free, US only)
- **Air quality:** [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (free)
- **Postal codes:** [Zippopotam](https://api.zippopotam.us/) (free, 60+ countries)

## Running Locally

No build step is required to serve the site. Just serve the files:

```bash
npx http-server . -p 8080
```

Then open `http://localhost:8080`.

## Project Structure

```
index.html          — Single-page app entry
404.html            — Redirects old city-page URLs into app deep links
css/style.css       — All styles with CSS custom properties for theming
js/app.js           — All application logic
js/i18n.js          — TRANSLATIONS object (15 languages)
fonts/, img/        — Static assets
alerts-proxy/       — Cloud Run proxy for NWS alerts
robots.txt
LICENSE             — MIT License
```

## How It Works

1. User searches a city name or postal code
2. Geocoding converts the search to lat/lon coordinates (Open-Meteo for cities, Zippopotam for postal codes)
3. All weather APIs are called in parallel from the browser — no backend needed
4. Sections render progressively as each API responds
5. User preferences (layout, units, theme) are saved in localStorage

## Cost

- **Hosting:** Free (GitHub Pages)
- **APIs:** Free (Open-Meteo, RainViewer, NWS, Zippopotam)
- **Total:** $0/year

## License

MIT — see [LICENSE](LICENSE)
