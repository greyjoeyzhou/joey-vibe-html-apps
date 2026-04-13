# AGENTS.md

This directory contains standalone single-page HTML apps. Treat this file as the operating guide for coding agents working here.

## Scope

- Primary apps in scope:
  - `fengshui.html`
  - `xuanxue.html`
  - `laohuangli.html`
- Ignore anything under `tmp/` unless explicitly requested.

## Core Constraint

- Keep each app as a **single self-contained HTML file** (HTML + CSS + JS together).
- Do not split into multi-file bundles, build pipelines, or framework scaffolding unless explicitly requested.

## Working Style

- Prefer small, surgical edits inside existing structure.
- Preserve current visual language and Chinese-first copy style.
- Maintain offline-friendly behavior where possible; external requests should be explicit and optional.
- Avoid adding heavy dependencies. If a library is needed, prefer CDN usage and graceful fallback.

## Existing App Notes

### `fengshui.html`

- Features: location input, GPS/IP geolocation, Leaflet map layers, compass canvas, AI feng shui analysis via configurable API endpoint.
- Key risks:
  - Network dependency (map tiles, IP geolocation, LLM endpoint).
  - Sensor permission variance across devices/browsers.
- Preferred enhancements:
  - Better state persistence (`localStorage`, URL params).
  - Robust API response validation and failure UX.
  - Mobile UX polish for map + compass interaction.

### `xuanxue.html`

- Features: BaZi, ZiWei, Western natal chart, and Vedic chart in one page with custom calculations and tabbed UI.
- Key risks:
  - Algorithmic correctness (astronomy/astrology approximations).
  - Input validation and timezone handling.
- Preferred enhancements:
  - Clear precision disclaimers and configurable calculation modes.
  - Profile persistence and export/print capabilities.
  - Performance tuning for large render blocks.

### `laohuangli.html`

- Features: traditional Chinese almanac (老黄历) with monthly calendar grid, lunar date conversion, Gan-Zhi (天干地支) day/month/year pillars, 24 solar terms, zodiac, Wu Xing, and daily Yi/Ji (宜忌) recommendations.
- Key risks:
  - Algorithmic correctness (lunar calendar computation relies on Meeus-based astronomical engine for new moons and solar longitude).
  - Yi/Ji generation uses a seeded pseudo-random selection rather than a canonical almanac source.
- Preferred enhancements:
  - Date deep-linking via URL params or `localStorage` persistence.
  - Print/export for a selected date or month.
  - Accessibility and screen-reader support for the calendar grid.

## Quality Bar

- Validate core user flows after edits:
  - App loads with no console errors.
  - Main calculate/analyze buttons still work.
  - Mobile layout remains usable.
- For HTML lint diagnostics, Biome is available in this environment.

## Change Boundaries

- Do not remove current features unless explicitly requested.
- Do not hardcode secrets or keys.
- Do not edit unrelated experimental files under `tmp/`.
