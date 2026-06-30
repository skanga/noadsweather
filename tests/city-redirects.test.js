const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.resolve(__dirname, '..', '404.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

function redirectFor(pathname) {
    let redirected = '';
    vm.runInNewContext(script, {
        URLSearchParams,
        location: {
            pathname,
            replace(url) { redirected = url; },
        },
    });
    return redirected;
}

const cityCount = (script.match(/"name":/g) || []).length;
assert.strictEqual(cityCount, 77);

assert.match(
    redirectFor('/weather/cities/new-york-ny/'),
    /^\/weather\/\?q=New\+York&lat=40\.7128&lon=-74\.0060&name=New\+York&region=NY&country=United\+States$/
);

assert.match(
    redirectFor('/weather/cities/tokyo-en/'),
    /^\/weather\/\?q=Tokyo&lat=35\.6762&lon=139\.6503&name=Tokyo&region=&country=Japan$/
);

assert.strictEqual(redirectFor('/weather/cities/nope/'), '/weather/');
