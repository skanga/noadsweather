const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');

const index = read('index.html');

for (const snippet of [
    'id="privacy-panel"',
    'id="about-toggle-home"',
    'id="about-toggle-weather"',
    'About Weather',
    'Privacy Policy',
    'q=New%20York',
    'lat=40.7128',
]) {
    assert.ok(index.includes(snippet), snippet);
}

assert.ok(!fs.existsSync(path.join(root, 'privacy.html')));
assert.ok(!fs.existsSync(path.join(root, 'about', 'index.html')));
assert.doesNotMatch(index, /href="[^"]*(?:about\/|privacy\.html|\/cities\/)/);
assert.doesNotMatch(index, /(?:href|src)="\/(?:about|privacy\.html|cities|css|js)\b/);
