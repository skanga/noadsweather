const functions = require('@google-cloud/functions-framework');

const CACHE = new Map(); // key: "lat,lon" (2 decimals) → { at, data }
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_CACHE_ENTRIES = 1000; // prevent unbounded growth on long-lived instances

function cacheSet(key, data) {
    // Evict oldest (insertion order) if at capacity
    if (CACHE.size >= MAX_CACHE_ENTRIES && !CACHE.has(key)) {
        CACHE.delete(CACHE.keys().next().value);
    }
    CACHE.set(key, { at: Date.now(), data });
}

functions.http('alerts', async (req, res) => {
    // CORS
    res.set('Access-Control-Allow-Origin', 'https://noadsweather.com');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

    const { lat, lon } = req.body || {};
    if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
        lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        res.status(400).json({ error: 'valid lat/lon required' });
        return;
    }

    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    const cached = CACHE.get(key);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
        res.json(cached.data);
        return;
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        console.error('alerts-proxy: OPENWEATHER_API_KEY not set');
        res.status(500).json({ error: 'API key not configured' });
        return;
    }

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const upstream = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);

        if (!upstream.ok) {
            console.error(`alerts-proxy: upstream status ${upstream.status} for ${key}`);
            // Serve stale cache if we have it
            if (cached) { res.json(cached.data); return; }
            res.json({ features: [] });
            return;
        }

        const data = await upstream.json();
        const alerts = data.alerts || [];

        // Filter out expired alerts (end time in the past)
        const nowSec = Math.floor(Date.now() / 1000);
        const active = alerts.filter(a => !a.end || a.end >= nowSec);

        // Dedupe by (event + description) — identical duplicates collapse
        const seen = new Set();
        const unique = [];
        for (const a of active) {
            const k = `${a.event || ''}|${a.description || ''}`;
            if (seen.has(k)) continue;
            seen.add(k);
            unique.push(a);
        }

        // Keep only the most recent alert per event type (by start time).
        // Weather agencies issue updated warnings that supersede older ones;
        // showing only the latest avoids confusing the user with stale revisions.
        const latestByEvent = new Map();
        for (const a of unique) {
            const key = (a.event || '').toLowerCase();
            const existing = latestByEvent.get(key);
            if (!existing || (a.start || 0) > (existing.start || 0)) {
                latestByEvent.set(key, a);
            }
        }

        // Title-case short event names like "wind" → "Wind"
        const titleCase = s => (s || '').replace(/\b\w/g, c => c.toUpperCase());

        const features = Array.from(latestByEvent.values()).map(a => {
            const event = titleCase(a.event);
            return {
                properties: {
                    event,
                    headline: a.sender_name ? `${event} — ${a.sender_name}` : event,
                    description: a.description,
                    severity: 'Severe',
                    senderName: a.sender_name,
                    start: a.start,
                    end: a.end,
                    tags: a.tags || []
                }
            };
        });

        const result = { features };
        cacheSet(key, result);
        res.json(result);
    } catch (err) {
        console.error('alerts-proxy: upstream error:', err?.name, err?.message);
        if (cached) { res.json(cached.data); return; }
        res.json({ features: [] });
    }
});
