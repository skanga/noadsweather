const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appSrc = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const cssSrc = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');

function functionSource(src, name) {
    const start = src.indexOf(`function ${name}`);
    assert.notStrictEqual(start, -1, `${name} should exist`);
    const braceStart = src.indexOf('{', start);
    let depth = 0;
    for (let i = braceStart; i < src.length; i++) {
        if (src[i] === '{') depth++;
        if (src[i] === '}') depth--;
        if (depth === 0) return src.slice(start, i + 1);
    }
    throw new Error(`${name} function body not found`);
}

// --- #1A: NWS alerts are deduped by event+area, keeping the most recent ---
{
    const helpers = new Function(`
        ${functionSource(appSrc, 'dedupeAlerts')}
        ${functionSource(appSrc, 'dedupeNWSAlerts')}
        return { dedupeNWSAlerts };
    `)();

    const feat = (event, area, sent, description) =>
        ({ properties: { event, areaDesc: area, sent, description } });

    // Three overlapping Air Quality Alerts, same event + area, different issue times.
    const features = [
        feat('Air Quality Alert', 'NYC', '2025-06-30T23:02:00-04:00', 'old body'),
        feat('Air Quality Alert', 'NYC', '2025-07-01T02:50:00-04:00', 'mid body'),
        feat('Air Quality Alert', 'NYC', '2025-07-01T03:22:00-04:00', 'newest body'),
        feat('Extreme Heat Warning', 'NYC', '2025-07-01T03:25:00-04:00', 'heat body'),
    ];

    const out = helpers.dedupeNWSAlerts(features);
    const events = out.map(f => f.properties.event);
    assert.deepStrictEqual(
        events.sort(),
        ['Air Quality Alert', 'Extreme Heat Warning'],
        'duplicate Air Quality Alerts collapse to one; distinct events kept'
    );
    const aq = out.find(f => f.properties.event === 'Air Quality Alert');
    assert.strictEqual(aq.properties.description, 'newest body', 'keeps the most recently sent alert');
}

// --- #1B: alert descriptions are collapsed behind a toggle, no inline preview ---
{
    const renderAlerts = functionSource(appSrc, 'renderAlerts');
    assert.doesNotMatch(renderAlerts, /alert-desc-preview/, 'no always-visible description preview');
    assert.doesNotMatch(renderAlerts, /DESC_PREVIEW_CHARS/, 'preview-length branch removed');
    assert.match(renderAlerts, /<details class="alert-desc"/, 'description wrapped in collapsible details');
    assert.match(renderAlerts, /<summary[^>]*>\$\{t\('showMore'\)\}<\/summary>/, 'summary is a plain show-more toggle');
}

// --- #2: Air Quality is a half-width item, not the old full-width row ---
{
    const renderCurrent = functionSource(appSrc, 'renderCurrent');
    const uvIdx = renderCurrent.indexOf("t('uvIndex')");
    const aqIdx = renderCurrent.indexOf("t('airQuality')");
    assert.ok(uvIdx !== -1 && aqIdx !== -1, 'both UV Index and Air Quality rendered');
    assert.doesNotMatch(renderCurrent, /detail-wide/, 'Air Quality no longer spans full width');
    assert.doesNotMatch(cssSrc, /detail-wide/, 'dead detail-wide rule removed');
}

console.log('alert-dedup-current-layout: all assertions passed');
