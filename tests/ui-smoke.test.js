const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

for (const snippet of [
    'data-i18n="searchAnotherCity"',
    'id="alerts-section"',
    'id="weather-summary"',
    'id="setting-auto-play-radar"',
]) {
    assert.ok(html.includes(snippet), snippet);
}

for (const snippet of [
    'function renderWeatherSummary',
    'function formatAlertTime',
    'current.visibility',
    'hourly.precipitation_probability',
    'hourly.wind_speed_10m',
]) {
    assert.ok(app.includes(snippet), snippet);
}

for (const snippet of [
    '.updated-at',
    '.alert-toggle',
    '.alerts-collapsed',
    '.hourly-wind',
    '.hourly-precip',
]) {
    assert.ok(css.includes(snippet), snippet);
}
