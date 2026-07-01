const assert = require('assert');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.join(__dirname, '..', 'js/app.js'), 'utf8');

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

// Wiring: the forecast fetch (which gates every main widget) must use the
// timeout wrapper so a hanging/throttled API surfaces an error instead of an
// infinite "loading" spinner.
const fetchOpenMeteoSrc = functionSource(appSrc, 'fetchOpenMeteo');
assert.match(fetchOpenMeteoSrc, /fetchWithTimeout\(/, 'fetchOpenMeteo uses fetchWithTimeout');

// Behavior: a response that never arrives is aborted and the promise rejects.
(async () => {
    const make = new Function('fetchImpl', `
        const fetch = fetchImpl;
        ${functionSource(appSrc, 'fetchWithTimeout')}
        return fetchWithTimeout;
    `);

    // A fetch that never responds on its own, but rejects when its signal aborts.
    const hangingFetch = (url, opts) => new Promise((_resolve, reject) => {
        opts.signal.addEventListener('abort', () => reject(new Error('AbortError')));
    });
    const fetchWithTimeout = make(hangingFetch);

    let rejected = false;
    const start = Date.now();
    try {
        await fetchWithTimeout('https://example.test/hang', {}, 50);
    } catch {
        rejected = true;
    }
    assert.ok(rejected, 'hanging request should reject via the timeout, not hang forever');
    assert.ok(Date.now() - start < 1000, 'should reject promptly around the timeout');

    // A fast response passes straight through.
    const okFetch = () => Promise.resolve({ ok: true, json: () => ({ hi: 1 }) });
    const res = await make(okFetch)('https://example.test/ok', {}, 5000);
    assert.strictEqual(res.ok, true, 'successful response resolves normally');

    console.log('fetch-timeout: all assertions passed');
})().catch(e => { console.error(e); process.exit(1); });
