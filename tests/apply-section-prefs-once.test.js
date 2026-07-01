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
    throw new Error(`${name} function body not found`);
}

const body = functionSource(appSrc, 'fetchAllWeatherData');

// Layout should be applied once per (non-superseded) load, on either the
// success or the failure path of the meteo fetch — not redundantly after each
// independent async render (AQI, alerts, radar all render into sections that
// were already placed).
const calls = (body.match(/applySectionPreferences\(\)/g) || []).length;
assert.strictEqual(calls, 2, `applySectionPreferences() should be called exactly twice (success + catch), found ${calls}`);

// One of the two must be in the meteo failure path so layout still applies.
assert.match(
    body,
    /failedToLoadWeather[\s\S]*?applySectionPreferences\(\)/,
    'the meteo catch block must apply layout on failure'
);

console.log('apply-section-prefs-once: all assertions passed');
