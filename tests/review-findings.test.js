const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const appSrc = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const i18nSrc = fs.readFileSync(path.join(root, 'js/i18n.js'), 'utf8');

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

{
    const fetchOpenMeteo = functionSource(appSrc, 'fetchOpenMeteo');
    assert.match(fetchOpenMeteo, /current:\s*'[^']*cloud_cover/);
}

{
    const helpers = new Function(`
        const TRANSLATIONS = { en: {} };
        const localStorage = { getItem: () => { throw new Error('blocked'); } };
        const navigator = { language: 'en-US' };
        ${functionSource(i18nSrc, 'getStoredLanguage')}
        ${functionSource(i18nSrc, 'getCurrentLang')}
        return { getCurrentLang };
    `)();
    assert.strictEqual(helpers.getCurrentLang(), 'en');
}

{
    const helpers = new Function(`
        const localStorage = { getItem: () => { throw new Error('blocked'); } };
        const SUPPORTED_STYLES = ['default', 'editorial', 'bulletin', 'quiet'];
        const SETTINGS_DEFAULT_FALSE = new Set(['autoPlayRadar']);
        ${functionSource(appSrc, 'storageGet')}
        ${functionSource(appSrc, 'getCurrentStyle')}
        ${functionSource(appSrc, 'getSettingsBool')}
        return { getCurrentStyle, getSettingsBool };
    `)();
    assert.strictEqual(helpers.getCurrentStyle(), 'default');
    assert.strictEqual(helpers.getSettingsBool('showForecastColors'), true);
    assert.strictEqual(helpers.getSettingsBool('autoPlayRadar'), false);
}
