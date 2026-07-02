const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');

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
    throw new Error(`${name} body not found`);
}

function makeClassList() {
    const s = new Set();
    return {
        add: x => s.add(x),
        remove: x => s.delete(x),
        contains: x => s.has(x),
        toggle: (x, f) => { const on = f === undefined ? !s.has(x) : !!f; on ? s.add(x) : s.delete(x); return on; },
    };
}

const section = { hidden: true, classList: makeClassList(), innerHTML: '', dataset: {},
    querySelector: () => null, querySelectorAll: () => [] };
const doc = { getElementById: () => section };

const renderAlerts = new Function('document', 't', 'escapeHtml', 'formatAlertTime', 'buildTranslateLink',
    `${functionSource(appSrc, 'renderAlerts')}; return renderAlerts;`)(
    doc, k => k, s => s, () => '', () => '');

const alerts = [{ properties: { event: 'Heat', headline: 'hot', severity: 'Severe', ends: '', areaDesc: 'Town', description: 'stay cool' } }];

// First time the panel appears → collapsed by default.
renderAlerts(alerts);
assert.ok(section.classList.contains('alerts-collapsed'), 'alerts start collapsed when first shown');

// User expands it; a data refresh while still visible must keep it open.
section.classList.remove('alerts-collapsed');
renderAlerts(alerts);
assert.ok(!section.classList.contains('alerts-collapsed'), 're-render preserves user-expanded state');

// Alerts clear, then new ones arrive → collapsed again (fresh appearance).
renderAlerts([]);
renderAlerts(alerts);
assert.ok(section.classList.contains('alerts-collapsed'), 're-appearing alerts collapse again');

console.log('alerts-collapsed-default: OK');
