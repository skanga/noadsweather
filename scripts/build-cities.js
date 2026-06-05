#!/usr/bin/env node
// Build script for noadsweather.com SEO city landing pages.
// Reads scripts/cities.json + js/i18n.js TRANSLATIONS and writes static
// HTML files to cities/{slug}/index.html. Also generates sitemap.xml.
//
// Run from repo root:  node scripts/build-cities.js
//
// The script is idempotent — running it twice produces identical output.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://noadsweather.com';
const CITIES_JSON = path.join(__dirname, 'cities.json');
const TEMPLATE_HTML = path.join(ROOT, 'index.html');
const I18N_JS = path.join(ROOT, 'js', 'i18n.js');
const CITIES_DIR = path.join(ROOT, 'cities');
const SITEMAP_XML = path.join(ROOT, 'sitemap.xml');

// --- Load inputs ------------------------------------------------------------

const cities = JSON.parse(fs.readFileSync(CITIES_JSON, 'utf8'));
const templateHtml = fs.readFileSync(TEMPLATE_HTML, 'utf8');
const translations = loadTranslations();

console.log(`Loaded ${cities.length} cities.`);

// --- Generate pages ---------------------------------------------------------

let pagesWritten = 0;
const allPageUrls = [
    { url: SITE_URL + '/',       priority: '1.0' },
    { url: SITE_URL + '/about/', priority: '0.9' },
];
const variantGroups = []; // for hreflang sitemap entries

for (const city of cities) {
    const native = buildPage(city, city.nativeLang, city.slug);
    pagesWritten += writePage(native);

    if (city.nativeLang !== 'en') {
        const en = buildPage(city, 'en', city.enSlug);
        pagesWritten += writePage(en);
        variantGroups.push({ native, en });
        allPageUrls.push({ url: native.canonical, priority: '0.7' });
        allPageUrls.push({ url: en.canonical,     priority: '0.7' });
    } else {
        allPageUrls.push({ url: native.canonical, priority: '0.7' });
    }
}

console.log(`Wrote ${pagesWritten} pages.`);

// --- Generate sitemap -------------------------------------------------------

writeSitemap(allPageUrls, variantGroups);
console.log('Wrote sitemap.xml');

// === Helpers ================================================================

function loadTranslations() {
    // i18n.js defines `const TRANSLATIONS = { en: {...}, es: {...}, ... }`
    // We evaluate it in a sandbox-ish way by reading the file and `Function`-ing it.
    const src = fs.readFileSync(I18N_JS, 'utf8');
    // Extract just the TRANSLATIONS object literal. We use a Function wrapper
    // rather than vm.runInThisContext to avoid side effects.
    const fn = new Function(src + '; return TRANSLATIONS;');
    return fn();
}

function buildPage(city, lang, slug) {
    const cityName = city.displayName[lang] || city.displayName.en;
    const titleTemplate = translations[lang].cityPageTitle;
    const blurbTemplate = translations[lang].cityPageSeoBlurb;
    const title = titleTemplate.replace('{city}', cityName);
    const description = blurbTemplate.replace(/{city}/g, cityName);
    const canonical = `${SITE_URL}/cities/${slug}/`;

    const seoCity = {
        slug,
        lang,
        lat: city.lat,
        lon: city.lon,
        name: city.displayName.en, // canonical English name for Open-Meteo / NWS lookups
        displayName: cityName,
        country: city.country,
        region: city.region || '',
    };

    return {
        slug,
        lang,
        canonical,
        title,
        description,
        seoCity,
        // For hreflang we need both URLs (native + en variant). nativeLang
        // is preserved so the alternates on the -en variant page point at
        // the native URL with the *native* hreflang (not "en"), avoiding
        // duplicate hreflang="en" entries that Google treats as invalid.
        nativeUrl: `${SITE_URL}/cities/${city.slug}/`,
        enUrl: city.enSlug ? `${SITE_URL}/cities/${city.enSlug}/` : null,
        isNativeEn: city.nativeLang === 'en',
        nativeLang: city.nativeLang,
    };
}

function writePage(page) {
    const html = renderTemplate(page);
    const dir = path.join(CITIES_DIR, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    return 1;
}

function renderTemplate(page) {
    let html = templateHtml;

    // 1. html lang attribute
    html = html.replace(/<html\s+lang="[^"]*">/, `<html lang="${escapeAttr(page.lang)}">`);

    // 2. title
    html = html.replace(/<title>[^<]*<\/title>/,
        `<title>${escapeHtml(page.title)} — NoAdsWeather</title>`);

    // 3. meta description
    html = html.replace(/<meta\s+name="description"\s+content="[^"]*">/,
        `<meta name="description" content="${escapeAttr(page.description)}">`);

    // 4. Inject canonical + hreflang + window._seoCity into <head>, just
    //    before the existing stylesheet link so it appears before app.js loads.
    const headInjection = buildHeadInjection(page);
    html = html.replace('<link rel="stylesheet" href="css/style.css">',
        headInjection + '\n    <link rel="stylesheet" href="/css/style.css">');

    // 5. Make script paths absolute so they resolve from /cities/{slug}/
    html = html.replace(/<script src="js\/i18n\.js"><\/script>/,
        '<script src="/js/i18n.js"></script>');
    html = html.replace(/<script src="js\/app\.js"><\/script>/,
        '<script src="/js/app.js"></script>');

    // 6. Pre-fill the H1 so the page has unique body content even before
    //    app.js runs (avoids the doorway-page risk of 77 byte-identical
    //    pages). app.js will overwrite this with the formatted city/region
    //    label once the weather view loads.
    html = html.replace(/<h1 id="location-name"><\/h1>/,
        `<h1 id="location-name">${escapeHtml(page.title)}</h1>`);

    // 7. Pre-fill the SEO blurb section. The hidden attribute is dropped so
    //    the blurb is visible on first paint (app.js still wires up the
    //    dismiss handlers once it boots). The inline head script sets
    //    data-blurb-dismissed on <html> when the user previously hid it.
    const hideLinkText = (translations[page.lang] && translations[page.lang].cityPageHideBlurb)
        || translations.en.cityPageHideBlurb;
    const seoBlurbReplacement =
        `<section id="seo-blurb">\n` +
        `                <button id="seo-blurb-close" aria-label="Hide" type="button">&times;</button>\n` +
        `                <p>\n` +
        `                    <span id="seo-blurb-text">${escapeHtml(page.description)}</span>\n` +
        `                    <a href="#" id="seo-blurb-hide-link">${escapeHtml(hideLinkText)}</a>\n` +
        `                </p>\n` +
        `            </section>`;
    html = html.replace(/<section id="seo-blurb"[\s\S]*?<\/section>/, seoBlurbReplacement);

    // 8. Swap visibility between home-view and weather-view on city pages.
    //    Without this, Google's static-HTML pass sees the home view as the
    //    primary content (since weather-view has `hidden`), making every
    //    city page look like a generic search page with a hidden Auckland
    //    H1 buried inside — triggers "soft 404 / doorway" classification.
    //    Runtime behavior is unchanged: data-seo-city CSS already hides
    //    home-view, and JS bootstraps the weather view as usual.
    html = html.replace(
        '<div id="home-view" class="view">',
        '<div id="home-view" class="view" hidden>'
    );
    html = html.replace(
        '<div id="weather-view" class="view" hidden>',
        '<div id="weather-view" class="view">'
    );

    return html;
}

function buildHeadInjection(page) {
    const lines = [
        `    <link rel="canonical" href="${escapeAttr(page.canonical)}">`,
    ];
    // hreflang only relevant if there's a sibling variant. Use page.nativeLang
    // (the language of nativeUrl) rather than page.lang (the language of the
    // page being generated) — otherwise the en-variant page emits two
    // hreflang="en" alternates pointing at different URLs.
    if (page.enUrl) {
        lines.push(`    <link rel="alternate" hreflang="${escapeAttr(page.nativeLang)}" href="${escapeAttr(page.nativeUrl)}">`);
        lines.push(`    <link rel="alternate" hreflang="en" href="${escapeAttr(page.enUrl)}">`);
        lines.push(`    <link rel="alternate" hreflang="x-default" href="${escapeAttr(page.enUrl)}">`);
    } else if (page.isNativeEn) {
        lines.push(`    <link rel="alternate" hreflang="en" href="${escapeAttr(page.canonical)}">`);
        lines.push(`    <link rel="alternate" hreflang="x-default" href="${escapeAttr(page.canonical)}">`);
    }
    lines.push('    <script>');
    lines.push(`        window._seoCity = ${JSON.stringify(page.seoCity).replace(/</g, '\\u003c')};`);
    // Flash-gate: hide #home-view immediately so generated city pages don't
    // render the home view for one frame before app.js routes to the weather
    // view. Cleared by app.js once the city is loaded.
    lines.push(`        document.documentElement.setAttribute('data-seo-city', 'true');`);
    // If the user previously dismissed the SEO blurb, hide it before paint
    // so it doesn't flash in. Wrapped in try-catch because localStorage can
    // throw in private-mode / disabled-storage contexts.
    lines.push(`        try { if (localStorage.getItem('hideCitySeoBlurb') === 'true') document.documentElement.setAttribute('data-blurb-dismissed', 'true'); } catch (e) {}`);
    lines.push('    </script>');
    return lines.join('\n');
}

function writeSitemap(urls, variantGroups) {
    // Simple sitemap; hreflang annotations on the variant pages
    const lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ];
    for (const u of urls) {
        lines.push('  <url>');
        lines.push(`    <loc>${escapeXml(u.url)}</loc>`);
        // For pages that are part of a variant group, emit alternate links
        const vg = variantGroups.find(g => g.native.canonical === u.url || g.en.canonical === u.url);
        if (vg) {
            lines.push(`    <xhtml:link rel="alternate" hreflang="${escapeAttr(vg.native.lang)}" href="${escapeXml(vg.native.canonical)}"/>`);
            lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(vg.en.canonical)}"/>`);
            lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(vg.en.canonical)}"/>`);
        }
        lines.push('    <changefreq>monthly</changefreq>');
        lines.push(`    <priority>${u.priority}</priority>`);
        lines.push('  </url>');
    }
    lines.push('</urlset>');
    fs.writeFileSync(SITEMAP_XML, lines.join('\n') + '\n', 'utf8');
}

// === Tiny escape helpers ====================================================

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
}

function escapeAttr(s) { return escapeHtml(s); }
function escapeXml(s) { return escapeHtml(s); }
