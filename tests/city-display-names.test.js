const assert = require('assert');
const path = require('path');

const cities = require(path.resolve(__dirname, '..', 'scripts', 'cities.json'));

for (const city of cities) {
    if (!city.region || !city.displayName || !city.displayName.en) continue;

    assert.doesNotMatch(
        city.displayName.en,
        new RegExp(`\\s${city.region}$`),
        `${city.slug} displayName.en should keep region separate`
    );
}
