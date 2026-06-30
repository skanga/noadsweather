const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.resolve(__dirname, '..', 'css', 'style.css'), 'utf8');

const mobileBlock = css.match(/@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.section-controls/);
assert.ok(mobileBlock, 'mobile weather layout block should exist');

const emptyColumnRule = mobileBlock[0].match(/\.weather-col:empty\s*\{([^}]*)\}/);
assert.ok(emptyColumnRule, 'mobile empty weather column rule should exist');
assert.match(
    emptyColumnRule[1],
    /display:\s*none\s*;/,
    'empty weather columns should not take mobile flex gap space'
);
