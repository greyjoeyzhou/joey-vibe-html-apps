# joey-vibe-html-apps

Standalone single-page HTML apps — each file is fully self-contained (HTML + CSS + JS). No build step, no framework, open in a browser.

## Apps

### `xuanxue.html`

Multi-system astrology calculator. Enter a birth date/time/location and get BaZi (八字), Zi Wei Dou Shu (紫微斗数), Western natal chart, and Vedic chart in a single tabbed UI, all computed client-side.

Features: BaZi, ZiWei, Western and Vedic charts, custom calculations, tabbed UI.

### `fengshui.html`

Feng shui site analysis tool. Enter a location or use GPS/IP geolocation to get a compass reading on a Leaflet map, then run an AI-powered feng shui analysis via a configurable LLM API endpoint (bring your own key).

Features: location input, GPS/IP geolocation, Leaflet map layers, compass canvas, AI analysis.

## Development

No build tooling required. Edit the HTML files directly and open in a browser.

For linting, [Biome](https://biomejs.dev/) is available:

```sh
biome check fengshui.html
biome check xuanxue.html
```

See `AGENTS.md` for coding agent guidelines.
