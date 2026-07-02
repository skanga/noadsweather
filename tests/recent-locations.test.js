const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');
const htmlSrc = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');

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
${functionSource('makeRecentLocation')}
${functionSource('recentLocationKey')}
${functionSource('mergeRecentLocation')}
${functionSource('recentLocationLabel')}
return { makeRecentLocation, mergeRecentLocation, recentLocationLabel };
`)();

{
    const location = {
        name: 'Los Angeles',
        region: 'CA',
        country: 'United States',
        lat: 34.052235,
        lon: -118.243683,
    };
    const list = [
        helpers.makeRecentLocation('Old LA', location),
        helpers.makeRecentLocation('Paris', {
            name: 'Paris',
            region: '',
            country: 'France',
            lat: 48.8566,
            lon: 2.3522,
        }),
    ];
    const merged = helpers.mergeRecentLocation(list, 'Los Angeles', location);
    assert.strictEqual(merged.length, 2);
    assert.strictEqual(merged[0].query, 'Los Angeles');
    assert.strictEqual(merged[0].location.name, 'Los Angeles');
    assert.strictEqual(merged[1].location.name, 'Paris');
}

{
    let list = [];
    for (let i = 0; i < 15; i++) {
        list = helpers.mergeRecentLocation(list, `City ${i}`, {
            name: `City ${i}`,
            region: '',
            country: 'Test',
            lat: i,
            lon: i,
        });
    }
    assert.strictEqual(list.length, 12);
    assert.strictEqual(list[0].query, 'City 14');
    assert.strictEqual(list[11].query, 'City 3');
}

assert.strictEqual(helpers.recentLocationLabel({
    location: { name: 'Tokyo', region: '', country: 'Japan' },
}), 'Tokyo, Japan');

assert.match(htmlSrc, /id="recent-locations"/);
assert.doesNotMatch(appSrc, /details-section/);
