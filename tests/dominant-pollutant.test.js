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

// dominantPollutant picks the pollutant driving the AQI (max sub-index).
const constSrc = appSrc.match(/const AQI_POLLUTANTS = \{[\s\S]*?\};/);
assert.ok(constSrc, 'AQI_POLLUTANTS map should exist');
const { dominantPollutant } = new Function(`
    ${constSrc[0]}
    ${functionSource(appSrc, 'dominantPollutant')}
    return { dominantPollutant };
`)();

// Ozone drives it (NY-like sample)
assert.strictEqual(dominantPollutant({
    us_aqi: 145, us_aqi_pm2_5: 58, us_aqi_pm10: 17, us_aqi_ozone: 145,
    us_aqi_nitrogen_dioxide: 11, us_aqi_sulphur_dioxide: 1, us_aqi_carbon_monoxide: 2,
}), 'O₃');

// PM2.5 drives it (Delhi-like sample)
assert.strictEqual(dominantPollutant({
    us_aqi: 153, us_aqi_pm2_5: 153, us_aqi_pm10: 109, us_aqi_ozone: 22,
    us_aqi_nitrogen_dioxide: 16, us_aqi_sulphur_dioxide: 14, us_aqi_carbon_monoxide: 7,
}), 'PM2.5');

// No data / all zero / missing sub-indices → nothing to show
assert.strictEqual(dominantPollutant(null), null);
assert.strictEqual(dominantPollutant({ us_aqi: 0, us_aqi_pm2_5: 0, us_aqi_pm10: 0 }), null);
assert.strictEqual(dominantPollutant({ us_aqi: 42 }), null);

// Tie → first in pollutant order wins (deterministic)
assert.strictEqual(dominantPollutant({
    us_aqi: 50, us_aqi_pm2_5: 50, us_aqi_pm10: 50,
}), 'PM2.5');

// The fetch requests the sub-indices, not just us_aqi.
const fetchSrc = functionSource(appSrc, 'fetchAirQuality');
for (const field of ['us_aqi_pm2_5', 'us_aqi_pm10', 'us_aqi_ozone',
    'us_aqi_nitrogen_dioxide', 'us_aqi_sulphur_dioxide', 'us_aqi_carbon_monoxide']) {
    assert.ok(fetchSrc.includes(field), `fetchAirQuality should request ${field}`);
}

// The current-conditions render surfaces the dominant pollutant in its own
// labeled row.
const renderSrc = functionSource(appSrc, 'renderCurrent');
assert.ok(/dominantPollutant/.test(renderSrc), 'renderCurrent should compute the dominant pollutant');
assert.ok(/t\('mainPollutant'\)/.test(renderSrc), 'renderCurrent should label its own mainPollutant row');

// Every language defines the mainPollutant label.
const i18nSrc = fs.readFileSync(path.join(__dirname, '..', 'js/i18n.js'), 'utf8');
const langs = i18nSrc.match(/^ {4}[a-z]{2}(-[A-Z]{2})?:\s*\{/gm).length;
const labels = (i18nSrc.match(/^ {8}mainPollutant:/gm) || []).length;
assert.strictEqual(labels, langs, `mainPollutant defined in all ${langs} languages (found ${labels})`);

console.log('dominant-pollutant: OK');
