# Architecture

This doc is for developers who need to understand how the site works, not just update content.

## Jekyll Basics

Jekyll is a static site generator. You write templates and content, Jekyll compiles them into plain HTML files. No server-side code, no database.

Key concepts:

- **Layouts** - Page templates in `_layouts/`
- **Includes** - Reusable snippets in `_includes/`
- **Data files** - YAML files in `_data/` that templates can access
- **Collections** - Groups of related content (like our principles)
- **Front matter** - YAML at the top of files that sets variables

## Layouts

Layouts are hierarchical. Here's how ours work:

```
base.html
├── home_style.html      (homepage)
├── default_style.html   (standard pages)
├── principle_style.html (individual principles)
├── department_style.html (department pages)
└── resources_style.html (resources page)
```

`base.html` has the outer HTML structure (doctype, head, body). Child layouts use `layout: base` and fill in the content.

Every page specifies its layout in front matter:

```yaml
---
layout: default_style
title: About
---
```

## Includes

Reusable chunks in `_includes/`:

- `head.html` - Meta tags, CSS links
- `header.html` - Navigation bar
- `footer.html` - Footer with contact info
- `script.html` - JavaScript includes
- `staff-card.html` - Reusable component for displaying staff members

Use them in templates with:

```liquid
{% include header.html %}
```

Some includes take parameters:

```liquid
{% include staff-card.html person=minister %}
```

## Data Files

`_data/` contains YAML files that templates can access through `site.data`:

```liquid
{% for minister in site.data.ministers.ministers %}
  {{ minister.name }}
{% endfor %}
```

Current data files:
- `ministers.yml` - Staff organized by role (ministers, pastors, workers)
- `gallery.yml` - Image galleries by section
- `principles.yml` - Metadata for the 25 principles

## Collections

Collections are groups of related documents. We have two:

**Principles** (`_principles/`)
```yaml
# in _config.yml
collections:
  principles:
    output: true
```

Access in templates with `site.principles`. Each file in `_principles/` becomes an item.

**Departments** (`_departments/`)

Same pattern, for department pages.

## Config Files

**`_config.yml`** - Main config. Contains:
- Site metadata (title, description, URLs)
- Contact information
- Social links
- Theme colors
- Build settings
- Collection definitions

**`_config.dev.yml`** - Development overrides. Currently just clears the baseurl so localhost works correctly.

When running locally:
```bash
jekyll serve --config _config.yml,_config.dev.yml
```

The second config overrides values from the first.

## CSS Organization

All styles are in `assets/css/style.css`. It's one file (not ideal, but it works).

Rough sections:
1. Base styles and resets
2. Typography
3. Navigation
4. Footer
5. Homepage specific
6. Page-specific styles
7. Components (cards, buttons)
8. Responsive breakpoints

Key variables are set via `_config.yml`:
```yaml
navbar_color: "#0A245E"
```

And used in templates:
```html
<style>
  .navbar { background-color: {{ site.navbar_color }}; }
</style>
```

## Templating Language (Liquid)

Jekyll uses Liquid for templating. Common patterns:

**Output a variable:**
```liquid
{{ site.title }}
{{ page.title }}
```

**Loops:**
```liquid
{% for item in site.data.ministers.pastors %}
  {{ item.name }}
{% endfor %}
```

**Conditionals:**
```liquid
{% if page.sidebar %}
  {% include sidebar.html %}
{% endif %}
```

**Filters:**
```liquid
{{ '/assets/img/photo.jpg' | relative_url }}
{{ page.title | downcase }}
```

## Asset Paths

Always use `relative_url` filter for assets:

```html
<img src="{{ '/assets/img/logo.jpg' | relative_url }}">
<link href="{{ '/assets/css/style.css' | relative_url }}">
```

This prepends the baseurl (`/union-website` in production) automatically.

## Build Output

Jekyll compiles everything into `_site/`. This folder is gitignored - you don't commit it. GitHub Pages rebuilds it on every push.

To see what Jekyll generates:
```bash
docker compose up
# then check _site/ folder
```

## Debugging

**Page not rendering?**
- Check front matter syntax (dashes, colons)
- Look at terminal output for Jekyll errors

**Layout not applying?**
- Make sure the layout file exists in `_layouts/`
- Check the `layout:` value in front matter matches the filename (without .html)

**Styles not showing?**
- Clear browser cache
- Check the CSS file path

**Data not loading?**
- Verify YAML syntax in `_data/` files
- Restart Jekyll after changing `_config.yml`
