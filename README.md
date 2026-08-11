# Studio Ma Félicité

Marketing site for Studio Ma Félicité, a Paris-based event decoration and hosting studio. Static site, no server-side runtime — deployable to any static host.

## Structure

```
index.html          French site (canonical source — markup + i18n dictionary)
en/index.html        English page, generated from index.html at build time
zh/index.html        Chinese page, generated from index.html at build time
src/input.css        Tailwind source (directives + hand-written custom CSS)
css/tailwind.css      Compiled, minified stylesheet (generated — do not edit directly)
tailwind.config.js    Tailwind theme (colors, fonts, keyframes)
scripts/build-i18n.js Generates en/ and zh/ from index.html's i18n dictionary
images/, videos/      Site media
robots.txt, sitemap.xml
```

`index.html` is the only file you hand-edit for content or markup. `en/index.html` and `zh/index.html` are build output — changes made directly to them will be overwritten.

## Setup

```bash
npm install
```

## Build

```bash
npm run build       # rebuild CSS + regenerate /en/ and /zh/
npm run build:css   # Tailwind only
npm run build:i18n  # regenerate /en/ and /zh/ only
npm run watch:css    # rebuild CSS on change, while editing markup/classes
```

Run `npm run build` before deploying any change to `index.html` — new Tailwind classes and translated strings only take effect after a rebuild.

## Editing translations

Text lives in the `I18N` object inside `index.html`'s inline `<script>` (keys: `fr`, `en`, `zh`), applied to elements via `data-i18n` / `data-i18n-html` / `data-i18n-ph` / `data-i18n-aria` attributes. Edit the dictionary, then run `npm run build:i18n` to re-bake `/en/` and `/zh/`.

## Local preview

Serve the folder over HTTP (not `file://` — asset paths are root-relative):

```bash
npx serve .
```

## SEO

- Canonical URLs, Open Graph / Twitter cards, and `LocalBusiness` JSON-LD on every page.
- `hreflang` alternates (`fr`, `en`, `zh`, `x-default`) linking the three language versions.
- `robots.txt` and `sitemap.xml` (with per-language `hreflang` annotations) at the site root.

## Deployment

Push the repository contents (excluding `node_modules/`) to your static host. Requires the domain to serve `/`, `/en/`, and `/zh/` as directories with their own `index.html` (default behavior on GitHub Pages, Netlify, Vercel, etc.).
