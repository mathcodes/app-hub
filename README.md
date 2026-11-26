# App Hub

A single page that links to every app and repo I've built, grouped by category.

**Live:** https://mathcodes.github.io/app-hub/

## Features

- Cards grouped by category (Pool & Billiards, Music & Guitar, Productivity & AI Agents, Explore & Lifestyle, Portfolio & Open Source), each with buttons to open the app, open the repo, and copy the link
- Search by name, description, stack, or host; filter by category and status (Live / Code only / In progress / Pinned)
- Sort by category, name, or newest; switch between grid and list views
- Pin favorites (saved in your browser)
- Live status check: each live site is pinged from your browser on load. The green dot means the host responded. It can't read HTTP status codes, so a site serving a 404 page still shows green.
- Dark and light themes; keyboard shortcuts `/` search, `Esc` clear, `T` theme
- The filter state is saved in the URL hash, so a link reproduces the same view (e.g. `#cat=pool&status=live`)

## Adding a project

Add an entry to `data.js`:

```js
{
  id: "my-app", name: "My App", category: "pool",
  desc: "One-line description.",
  url: "https://my-app.vercel.app",           // or null
  repo: "https://github.com/mathcodes/my-app", // or null
  private: false,
  host: "Vercel", status: "live",              // live | repo | wip
  stack: ["Next.js"], added: "2026-11-26",
}
```

To add a category, add a key to `CATEGORIES` in the same file.

## Run locally

It's plain HTML, CSS, and JS with no build step. Open `index.html` directly, or run:

```bash
python -m http.server 8000
```

## Deploy

GitHub Pages serves it from the root of `main`.
