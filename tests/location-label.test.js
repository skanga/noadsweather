const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');

function functionSource(name) {
    const start = appSrc.indexOf(`function ${name}`);
    assert.notStrictEqual(start, -1, `${name} should exist`);
    const braceStart = appSrc.indexOf('{', start);
    let depth = 0;
    for (let i = braceStart; i < appSrc.length; i++) {
        if (appSrc[i] === '{') depth++;
        if (appSrc[i] === '}') depth--;
        if (depth === 0) return appSrc.slice(start, i + 1);
    }
    throw new Error(`${name} function body not found`);
}

const helpers = new Function(`
const homeView = {};
const weatherView = {};
const locationName = { textContent: '' };
${functionSource('showWeather')}
return { showWeather, locationName };
`)();

helpers.showWeather({ name: 'San Diego', region: 'California', country: 'United States' }, 'San Diego');
assert.strictEqual(helpers.locationName.textContent, 'San Diego, California');

helpers.showWeather({ name: 'San Diego', region: 'CA', country: 'United States' }, '92101');
assert.strictEqual(helpers.locationName.textContent, 'San Diego, CA (92101)');
