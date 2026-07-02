const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appSrc = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(root, 'js/i18n.js'), 'utf8');
const T = new Function(i18nSrc + '; return TRANSLATIONS;')();

function fn(name) {
    const s = appSrc.indexOf(`function ${name}`);
    assert.notStrictEqual(s, -1, `${name} should exist`);
    const b = appSrc.indexOf('{', s);
    let d = 0;
    for (let i = b; i < appSrc.length; i++) {
        if (appSrc[i] === '{') d++;
        if (appSrc[i] === '}') d--;
        if (d === 0) return appSrc.slice(s, i + 1);
    }
}
const block = re => appSrc.match(re)[0];

const el = { innerHTML: '' };
const t = k => (T.en && T.en[k]) || k;
const rc = new Function('document', 't', 'units', 'isImperial', 'isNightTime', `
    ${block(/const WEATHER_ICONS = \{[\s\S]*?\n\};/)}
    ${block(/const AQI_POLLUTANTS = \{[\s\S]*?\};/)}
    ${fn('tempUnit')} ${fn('windUnit')} ${fn('fmtVisibility')}
    ${fn('weatherInfo')} ${fn('windDirection')} ${fn('uvLabel')}
    ${fn('aqiLabel')} ${fn('dominantPollutant')} ${fn('renderCurrent')}
    return renderCurrent;
`)({ getElementById: () => el }, t,
    { temp: 'celsius', wind: 'kmh', time24h: false }, () => false, () => false);

rc(
    { weather_code: 0, temperature_2m: 20, apparent_temperature: 20, relative_humidity_2m: 50,
      dew_point_2m: 10, wind_speed_10m: 5, wind_direction_10m: 180, wind_gusts_10m: 8,
      visibility: 10000, uv_index: 8 },
    { us_aqi: 145, us_aqi_pm2_5: 145, us_aqi_pm10: 17, us_aqi_ozone: 22,
      us_aqi_nitrogen_dioxide: 11, us_aqi_sulphur_dioxide: 1, us_aqi_carbon_monoxide: 2 },
);

// label -> { col, row } parsed from each detail-item's grid placement.
const placement = {};
const re = /<div class="detail-item[^"]*"\s+style="([^"]*)">\s*<span class="detail-label">([^<]*)<\/span>/g;
let m;
while ((m = re.exec(el.innerHTML))) {
    const style = m[1], label = m[2];
    placement[label] = {
        col: (style.match(/grid-column:\s*([^;]+)/) || [])[1],
        row: (style.match(/grid-row:\s*([^;]+)/) || [])[1],
    };
}

const at = (label, col, row) => {
    const p = placement[t(label)];
    assert.ok(p, `${label} ("${t(label)}") should be a placed detail-item`);
    assert.strictEqual(p.col, col, `${label} column`);
    assert.strictEqual(p.row, row, `${label} row`);
};

// Left column: Visibility above UV Index.
at('visibility', '1', '1');
at('uvIndex', '1', '2');
// Right column: Humidity above Dew Point, Wind above Gusts.
at('humidity', '2', '1');
at('dewPoint', '2', '2');
at('wind', '2', '3');
at('gusts', '2', '4');
// AQI (half-width) and Pollutant fill the left column below UV Index.
at('airQuality', '1', '3');
at('mainPollutant', '1', '4');

console.log('current-details-layout: OK');
