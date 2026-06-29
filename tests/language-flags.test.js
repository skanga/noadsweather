const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.resolve(__dirname, '..', 'js/app.js'), 'utf8');

assert.match(appSrc, /function assetUrl\(/);
assert.doesNotMatch(appSrc, /src="\/img\/flags\//);
assert.match(appSrc, /assetUrl\(LANGUAGE_FLAGS\[code\]\)/);
