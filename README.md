# My-Portfolio

Personal portfolio built with plain HTML, CSS and vanilla JavaScript. No framework, no build step; it deploys to Vercel as static files.

## Structure

```
index.html            portfolio page
css/style.css         styles
js/main.js            renders the page from data/profile.json
data/profile.json     ← all content lives here
assets/               portrait images
scripts/dev-server.js local preview server (npm start)
vercel.json           security headers
```

## Editing content

Update `data/profile.json`: name, role, tagline, summary, skills, projects, links and email. Leave a field empty if you don't want it shown.

## Deploying on Vercel

Push to `main`. Vercel serves the folder as a static site; no framework preset, environment variables or Root Directory change are needed.

## Local development

```bash
npm start                        # http://localhost:3000
```

`npm start` runs `scripts/dev-server.js`, a small server that serves the files with the same headers as `vercel.json`. Any other static server works too.
