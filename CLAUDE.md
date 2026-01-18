# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based website for the **Unión Hondureña** of the Seventh Day Adventist Reform Movement church (Iglesia Adventista del Séptimo Día Movimiento de Reforma). Based on the Business Jekyll Theme with Bootstrap 3.

## Development Commands

```bash
# Local development with Docker (recommended)
docker compose up

# Alternative: Direct Jekyll serve for development
bundle exec jekyll serve --config _config.yml,_config.dev.yml

# Build for production
bundle exec jekyll build
```

Site runs at `localhost:4000` during development.

## Architecture

### Jekyll Configuration
- `_config.yml` - Production config (uses `/union-website` baseurl for GitHub Pages)
- `_config.dev.yml` - Dev overrides (empty baseurl for local development)

### Layouts (`_layouts/`)
- `home_style.html` - Homepage with carousel and services grid
- `default_style.html` - Standard pages with sidebar support
- `principle_style.html` - Individual principle/doctrine pages
- `resources_style.html` - Resources page layout

### Collections
- `_principles/` - 25 fundamental beliefs (principle_1.html through principle_25.html)
- Each principle uses front matter: `layout`, `title`, `permalink`, `num`

### Data Files (`_data/`)
- `ministers.yml` - Staff directory (ministers, pastors, workers with photos)
- `principles.yml` - Principles metadata (id, title, link, pdf)

### Pages Structure
- `pages/` - Main pages (about, contact, resource, 404)
- `pages/sections/` - Section pages (principles, ministry, departments, gallery, volunteering, donations)

### Key Includes (`_includes/`)
- `header.html` - Navigation bar
- `footer.html` - Site footer with contact info
- `head.html` - Meta tags and CSS
- `script.html` - JavaScript includes

## Content Guidelines

- All public-facing content is in **Spanish**
- Site configuration in `_config.yml` contains contact info, social links, Google Maps embed
- Images go in `assets/img/` with appropriate subdirectories
- Staff photos referenced from `_data/ministers.yml` should be placed in `assets/img/team/`

## Deployment

Site deploys to GitHub Pages on the `gh-pages` branch. The baseurl `/union-website` is required for production.
