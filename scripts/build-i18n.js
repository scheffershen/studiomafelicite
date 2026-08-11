// Generates /en/index.html and /zh/index.html from the authored FR index.html.
// index.html stays the single source of truth (markup + the I18N dictionary
// living inside its inline <script>); this script bakes each locale's text
// directly into static HTML so search engines see real per-language content
// instead of relying on the client-side language switcher.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SRC_HTML = path.join(ROOT, 'index.html');
const SITE_URL = 'https://studiomafelicite.com';
const LOCALES = {
  en: { path: '/en/', ogLocale: 'en_US' },
  zh: { path: '/zh/', ogLocale: 'zh_CN' },
};

function extractI18N(html) {
  const startMarker = 'const I18N = {';
  const start = html.indexOf(startMarker);
  if (start === -1) throw new Error('Could not find "const I18N = {" in index.html');
  const braceStart = start + startMarker.length - 1; // index of the opening {
  let depth = 0;
  let end = -1;
  for (let i = braceStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }
  if (end === -1) throw new Error('Could not find matching closing brace for I18N object');
  const literal = html.slice(braceStart, end + 1);
  return vm.runInNewContext('(' + literal + ')');
}

function getPath(obj, p) {
  return p.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function buildLocale(lang, dict, srcHtml) {
  const { path: urlPath, ogLocale } = LOCALES[lang];
  const dom = new JSDOM(srcHtml);
  const doc = dom.window.document;

  doc.documentElement.setAttribute('lang', lang);

  doc.querySelectorAll('[data-i18n]').forEach(el => {
    const v = getPath(dict, el.dataset.i18n);
    if (v != null) el.textContent = v;
  });
  doc.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = getPath(dict, el.dataset.i18nHtml);
    if (v != null) el.innerHTML = v;
  });
  doc.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = getPath(dict, el.dataset.i18nPh);
    if (v != null) el.setAttribute('placeholder', v);
  });
  doc.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const v = getPath(dict, el.dataset.i18nAria);
    if (v != null) el.setAttribute('aria-label', v);
  });

  const canonicalUrl = `${SITE_URL}${urlPath}`;

  doc.title = dict.meta.title;
  const metaDesc = doc.getElementById('metaDescription');
  if (metaDesc) metaDesc.setAttribute('content', dict.meta.description);

  const setMeta = (selector, attr, value) => {
    const el = doc.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  setMeta('link[rel="canonical"]', 'href', canonicalUrl);
  setMeta('meta[property="og:title"]', 'content', dict.meta.title);
  setMeta('meta[property="og:description"]', 'content', dict.meta.description);
  setMeta('meta[property="og:url"]', 'content', canonicalUrl);
  setMeta('meta[property="og:locale"]', 'content', ogLocale);
  setMeta('meta[name="twitter:title"]', 'content', dict.meta.title);
  setMeta('meta[name="twitter:description"]', 'content', dict.meta.description);

  const ldScript = doc.querySelector('script[type="application/ld+json"]');
  if (ldScript) {
    const ld = JSON.parse(ldScript.textContent);
    ld.url = canonicalUrl;
    ld.inLanguage = lang;
    ld.description = dict.meta.description;
    ldScript.textContent = JSON.stringify(ld, null, 2);
  }

  const scripts = doc.querySelectorAll('script:not([type])');
  let patched = false;
  scripts.forEach(s => {
    if (s.textContent.includes("const PAGE_LANG = 'fr';")) {
      s.textContent = s.textContent.replace("const PAGE_LANG = 'fr';", `const PAGE_LANG = '${lang}';`);
      patched = true;
    }
  });
  if (!patched) throw new Error('Could not find PAGE_LANG marker to patch for locale ' + lang);

  const outDir = path.join(ROOT, lang);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), '<!DOCTYPE html>\n' + doc.documentElement.outerHTML + '\n');
  console.log(`Wrote ${lang}/index.html`);
}

const srcHtml = fs.readFileSync(SRC_HTML, 'utf8');
const I18N = extractI18N(srcHtml);
for (const lang of Object.keys(LOCALES)) {
  if (!I18N[lang]) throw new Error(`I18N has no "${lang}" dictionary`);
  buildLocale(lang, I18N[lang], srcHtml);
}
