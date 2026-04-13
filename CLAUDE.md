# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Read this first

`AGENTS.md` at the repo root is the authoritative operating guide — scope, core constraints, per-app notes, and change boundaries. Read it before making changes. This file only covers what's specific to Claude Code or not already in AGENTS.md.

## Repository shape

Collection of standalone single-page HTML apps. Each `*.html` file at the repo root is fully self-contained (HTML + CSS + JS in one file) and opens directly in a browser — no build, no bundler, no framework scaffolding.

- `index.html` — landing page with cards linking to each app
- `fengshui.html` — feng shui compass + AI analysis
- `xuanxue.html` — BaZi / ZiWei / Western / Vedic charts
- `laohuangli.html` — 老黄历 almanac (Meeus-based lunar engine)
- `qr-code.html` — QR code generator (URL / text / vCard) with emoji or photo center overlay; uses QRious via CDN
- `tmp/` — experimental; do not touch unless asked.

The "single self-contained HTML file per app" rule (AGENTS.md) is the hard constraint. Don't introduce a build step, extract shared JS into separate files, or pull in a framework to "clean things up." External libraries come in via CDN `<script>` tags with graceful fallback.

## Deploy

GitHub Pages, via `.github/workflows/deploy-pages.yml`. Pushes to `main` deploy the whole repo root as-is. No build step runs in CI — whatever is on `main` is what ships. This means:
- Every file you edit ships as-is; there's no transpile step to rescue syntax that works locally but not in target browsers.
- The `.tsx` file is never served usefully (Pages won't transpile it).

## Commands

No test suite, no build. The only tooling is Biome for lint diagnostics on the HTML files:

```sh
biome check fengshui.html
biome check xuanxue.html
biome check laohuangli.html
```

To preview locally, open the HTML file directly in a browser, or serve the directory (e.g. `python3 -m http.server`) if you need to exercise `fetch` / geolocation / relative links.

## Working conventions

- Chinese-first copy in the UI. Preserve it; don't translate to English on a whim.
- Mobile layouts matter — the feng shui compass and calendar grid both get used on phones. Eyeball mobile width after layout changes.
- External network calls (map tiles, IP geolocation, LLM endpoint) must stay explicit and optional — the apps should degrade, not break, when offline or when the user hasn't configured an API key.
- No secrets in files. The feng shui app takes an LLM endpoint + key as runtime input.
