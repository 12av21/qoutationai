# QuotePilot AI

A browser-only SaaS prototype for AI-powered sales quotation automation.

## Deploy to GitHub Pages

This repository is configured to deploy automatically with GitHub Actions.

1. Push the repository to GitHub with `main` as the default branch.
2. In the repository, open **Settings > Pages**.
3. Set **Build and deployment > Source** to **GitHub Actions**.
4. Push to `main`, or run **Deploy static content to Pages** from the **Actions** tab.

The published site will be available at:

`https://12av21.github.io/qoutationai/`

The workflow is defined in `.github/workflows/static.yml`. No build step or
environment variables are required because this is a static browser prototype.

Run locally with:

```powershell
python -m http.server 4173
```

Open `http://127.0.0.1:4173/index.html`.

The main demo path is **Create Quotation**: analyze a requirement, review AI extraction, select a product match, calculate pricing and GST, validate, preview, approve, and send.

## Structure

- `index.html`: browser entry point and shell markup
- `src/js/app.js`: client-side routing, state, views, and interactions
- `src/css/styles.css`: visual system and responsive layout
- `src/pages/README.md`: available product pages and route map
- `src/data/demo-content.json`: sample workspace and quotation data
- `docs/architecture.md`: runtime and production-boundary notes