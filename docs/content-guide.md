# Content Guide

This is your go-to reference for updating website content. You don't need to be a programmer - most updates are just editing text in files.

## Updating Staff / Ministers

The staff page pulls from `_data/ministers.yml`. It's organized by role:

```yaml
ministers:
  - name: Jary Reyes
    state: Ministro Ordenado
    photo: Jary_Reyes.jpg

pastors:
  - name: Daniel Alberto Contreras Cruz
    state: Pastor Ordenando
    photo: Daniel_Contreras.jpg
```

**To add someone:**

Add a new entry under the right section:

```yaml
pastors:
  - name: New Person Name
    state: Pastor Ordenando
    photo: New_Person.jpg
```

**Photo requirements:**
- Put the photo in `assets/img/team/`
- Use underscore naming: `First_Last.jpg`
- Photos without a file just show a placeholder - that's fine

**To remove someone:** Delete their entry.

**To change someone's role:** Move their entry to a different section, or update the `state` field.

## Updating Gallery Images

Gallery images live in `_data/gallery.yml`:

```yaml
general:
  folder: slider
  images:
    - file: slide1.jpg
      alt: Foto de la iglesia

departments:
  folder: departments
  images:
    - file: jovenes_union.jpg
      alt: Departamento de Jóvenes
```

**To add a gallery image:**

1. Put the image in the right folder (e.g., `assets/img/slider/`)
2. Add an entry to `gallery.yml`:

```yaml
- file: new-image.jpg
  alt: Description in Spanish
```

**Image sizes:**
- Slider images: 1920x1080 works well
- Department images: Square or 4:3 ratio
- Keep file sizes under 500KB if possible (compress them)

## Updating Contact Info

Contact details are in `_config.yml`:

```yaml
company_name: Unión Hondureña
address_line: J47F+658, Siguatepeque, Comayagua
telephone_number: +504 9540-7686
company_email: asdmruh@gmail.com
```

Just edit the values. The footer and contact page pull from here automatically.

**Note:** After editing `_config.yml`, you need to restart the development server.

## Updating Social Links

Also in `_config.yml`:

```yaml
facebook_link: https://www.facebook.com/profile.php?id=100064555941818
youtube_link: https://www.youtube.com/@unionhondurenaasdmr8339
whatsapp_number: "5048777922"
```

The WhatsApp number should be digits only, no spaces or dashes. It gets used to generate the `wa.me` link.

## Editing Pages

Main pages are HTML files in `pages/`:

| Page | File |
|------|------|
| About | `pages/about.html` |
| Contact | `pages/contact.html` |
| Principles overview | `pages/sections/principles.html` |
| Ministry (staff) | `pages/sections/ministry.html` |
| Gallery | `pages/sections/gallery.html` |
| Departments | `pages/sections/departments.html` |

Open the file, find the text you want to change, edit it. The HTML might look intimidating but the actual content is usually plain text between tags.

Example - changing a heading in `about.html`:

```html
<h2>Nuestra Historia</h2>
<p>Some paragraph text here...</p>
```

Just change the text inside the tags.

## Individual Principles

The 25 principles live in `_principles/` as separate files (`principle_1.html` through `principle_25.html`).

Each file has front matter at the top:

```yaml
---
layout: principle_style
title: "La Palabra de Dios"
permalink: /principle_1
num: 1
---
```

The content below that is the actual principle text in HTML.

## Adding Images Anywhere

1. Put the image in `assets/img/` (or a subfolder)
2. Reference it in HTML:

```html
<img src="{{ '/assets/img/your-image.jpg' | relative_url }}" alt="Description">
```

The `relative_url` filter is important - it makes sure the path works both locally and on GitHub Pages.

## Tips

- **Test locally first.** Always run `docker compose up` and preview changes before pushing.
- **Keep backups.** Git tracks everything, but it doesn't hurt to be careful with deletes.
- **Spanish content.** All public-facing text should be in Spanish.
- **Compress images.** Big images slow down the site. Use a tool like [TinyPNG](https://tinypng.com/).
- **When in doubt,** look at how existing content is structured and follow the pattern.
