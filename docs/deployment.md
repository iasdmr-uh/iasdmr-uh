# Deployment

The site is hosted on GitHub Pages. When you push to the `gh-pages` branch, GitHub automatically rebuilds and deploys the site.

## How It Works

```
Your changes → Push to gh-pages → GitHub builds Jekyll → Site is live
```

The live URL is: https://argushn.github.io/union-website

## Deploying Changes

Assuming you're already on the `gh-pages` branch:

```bash
git add .
git commit -m "Describe what you changed"
git push origin gh-pages
```

GitHub takes a minute or two to rebuild. Refresh the live site to see your changes.

## Branch Setup

This repo uses `gh-pages` as the deployment branch (not `main` or `master`). This is configured in GitHub repository settings under Pages.

If you're working on a feature that isn't ready for the live site, create a separate branch and merge to `gh-pages` when done.

## The Baseurl Thing

In `_config.yml`:

```yaml
baseurl: "/union-website"
```

This is required because the site lives at `argushn.github.io/union-website`, not at the root of a domain. All asset paths need this prefix in production.

For local development, `_config.dev.yml` overrides this with an empty baseurl so `localhost:4000` works without the prefix.

**Don't remove the baseurl** from `_config.yml` - it'll break the production site.

## Checking Build Status

If something seems wrong after pushing:

1. Go to the GitHub repository
2. Click "Actions" tab
3. Look for the most recent workflow run
4. If it failed, click to see the error

Common build failures:
- YAML syntax errors in `_config.yml` or data files
- Missing layout files
- Broken Liquid template syntax

## Custom Domain (Future)

If we ever get a custom domain like `unionhondurena.org`:

1. Add a `CNAME` file to the repo root containing just the domain name
2. Update DNS records at the domain registrar
3. Change `url` in `_config.yml` to the new domain
4. May need to adjust or remove `baseurl`

But for now, the GitHub Pages URL works fine.

## Rollback

If you push something broken and need to revert:

```bash
git log --oneline           # Find the commit hash before your change
git revert <commit-hash>    # Creates a new commit that undoes it
git push origin gh-pages
```

Or if you really need to force-reset (careful with this):

```bash
git reset --hard <commit-hash>
git push --force origin gh-pages
```

## Quick Checklist Before Deploying

- [ ] Tested locally with `docker compose up`
- [ ] Pages load without errors
- [ ] Images appear correctly
- [ ] Links work (especially navigation)
- [ ] No sensitive info accidentally committed
