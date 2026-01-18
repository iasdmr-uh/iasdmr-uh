# Getting Started

This guide walks you through setting up the website on your computer for local development.

## What You'll Need

**Docker** (recommended) - The easiest way to run Jekyll without installing Ruby.

- [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

If you don't want Docker, you can install Ruby and Jekyll directly, but it's more hassle and we won't cover that here.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/argushn/union-website.git
   cd union-website
   ```

2. **Start the development server**

   ```bash
   docker compose up
   ```

   First run downloads the Jekyll image and installs dependencies - this takes a few minutes. After that, startups are fast.

3. **Open the site**

   Go to http://localhost:4000 in your browser. You should see the homepage.

4. **Make edits**

   The site rebuilds automatically when you save changes. Just refresh the browser.

5. **Stop the server**

   Press `Ctrl+C` in the terminal, or run `docker compose down`.

## Project Tour

Here's where stuff lives:

```
union-website/
├── _config.yml          # Site settings (contact info, social links)
├── _data/
│   ├── ministers.yml    # Staff directory
│   ├── gallery.yml      # Image galleries
│   └── principles.yml   # 25 principles metadata
├── _layouts/            # Page templates
├── _principles/         # The 25 fundamental beliefs
├── pages/               # Main pages
│   ├── about.html
│   ├── contact.html
│   └── sections/        # Section pages (principles, ministry, etc.)
├── assets/
│   ├── css/style.css    # All the styles
│   ├── img/             # Images
│   └── fonts/           # Custom fonts
└── docs/                # You are here
```

## Your First Edit

Let's try something simple. Open `_config.yml` and find the `telephone_number` line:

```yaml
telephone_number: +504 8777-9224
```

Change it to anything, save the file, and refresh the browser. You'll see the footer update.

Note: Changes to `_config.yml` require a server restart. Press `Ctrl+C`, then `docker compose up` again.

## Common Issues

**Port 4000 already in use**

Something else is using that port. Either stop it or edit `compose.yml` to use a different port:

```yaml
ports:
  - "4001:4000"  # Use localhost:4001 instead
```

**Changes not showing up**

- For most files: Just refresh the browser
- For `_config.yml`: Restart the server
- Clear browser cache if nothing works

**Docker not starting**

Make sure Docker Desktop is running. On Mac/Windows, you need the app open, not just installed.

## Next Steps

- Read [Content Guide](content-guide.md) to learn how to update the actual website content
- Check [Architecture](architecture.md) if you want to understand how Jekyll works
