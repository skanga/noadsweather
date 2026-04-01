// =============================================================================
// NoAdsWeather - app.js
// =============================================================================

// --- Constants ---------------------------------------------------------------

const WEATHER_DESCRIPTIONS = {
    0: { text: 'Clear sky', icon: '☀️' },
    1: { text: 'Mainly clear', icon: '🌤️' },
    2: { text: 'Partly cloudy', icon: '⛅' },
    3: { text: 'Overcast', icon: '☁️' },
    45: { text: 'Foggy', icon: '🌫️' },
    48: { text: 'Depositing rime fog', icon: '🌫️' },
    51: { text: 'Light drizzle', icon: '🌦️' },
    53: { text: 'Moderate drizzle', icon: '🌦️' },
    55: { text: 'Dense drizzle', icon: '🌦️' },
    61: { text: 'Slight rain', icon: '🌧️' },
    63: { text: 'Moderate rain', icon: '🌧️' },
    65: { text: 'Heavy rain', icon: '🌧️' },
    71: { text: 'Slight snow', icon: '🌨️' },
    73: { text: 'Moderate snow', icon: '🌨️' },
    75: { text: 'Heavy snow', icon: '🌨️' },
    77: { text: 'Snow grains', icon: '🌨️' },
    80: { text: 'Slight rain showers', icon: '🌦️' },
    81: { text: 'Moderate rain showers', icon: '🌦️' },
    82: { text: 'Violent rain showers', icon: '🌦️' },
    85: { text: 'Slight snow showers', icon: '🌨️' },
    86: { text: 'Heavy snow showers', icon: '🌨️' },
    95: { text: 'Thunderstorm', icon: '⛈️' },
    96: { text: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { text: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

// --- DOM Refs ----------------------------------------------------------------

const homeView = document.getElementById('home-view');
const weatherView = document.getElementById('weather-view');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchError = document.getElementById('search-error');
const locationName = document.getElementById('location-name');
const backBtn = document.getElementById('back-btn');

// --- Utility Functions -------------------------------------------------------

function weatherInfo(code) {
    return WEATHER_DESCRIPTIONS[code] || { text: 'Unknown', icon: '❓' };
}

function windDirection(degrees) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(degrees / 45) % 8];
}

function lonToTile(lon, zoom) {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

function latToTile(lat, zoom) {
    return Math.floor(
        (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) /
            2 *
            Math.pow(2, zoom)
    );
}

function getMoonPhase(date) {
    const knownNew = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867;
    const diff = (date - knownNew) / (1000 * 60 * 60 * 24);
    const phase = ((diff % synodicMonth) + synodicMonth) % synodicMonth;
    const phaseFraction = phase / synodicMonth;

    let name, icon;
    if (phaseFraction < 0.0625) { name = 'New Moon'; icon = '🌑'; }
    else if (phaseFraction < 0.1875) { name = 'Waxing Crescent'; icon = '🌒'; }
    else if (phaseFraction < 0.3125) { name = 'First Quarter'; icon = '🌓'; }
    else if (phaseFraction < 0.4375) { name = 'Waxing Gibbous'; icon = '🌔'; }
    else if (phaseFraction < 0.5625) { name = 'Full Moon'; icon = '🌕'; }
    else if (phaseFraction < 0.6875) { name = 'Waning Gibbous'; icon = '🌖'; }
    else if (phaseFraction < 0.8125) { name = 'Last Quarter'; icon = '🌗'; }
    else if (phaseFraction < 0.9375) { name = 'Waning Crescent'; icon = '🌘'; }
    else { name = 'New Moon'; icon = '🌑'; }

    return { name, icon };
}

// --- API Functions -----------------------------------------------------------

async function geocodeFetch(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    return res.json();
}

async function geocodeZip(zip) {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) throw new Error('Zip code not found. Try a city name instead.');
    const data = await res.json();
    const place = data.places[0];
    return {
        name: place['place name'],
        region: place['state abbreviation'],
        country: 'United States',
        lat: parseFloat(place.latitude),
        lon: parseFloat(place.longitude),
    };
}

async function geocode(query) {
    // Check if input is a US zip code (5 digits)
    const zipMatch = query.trim().match(/^(\d{5})$/);
    if (zipMatch) {
        return geocodeZip(zipMatch[1]);
    }

    // Parse city and region filter from input
    // Supports: "Austin, TX", "Austin,TX", "Austin TX", "Austin"
    let searchName, filterRegion;

    if (query.includes(',')) {
        const parts = query.split(',').map(s => s.trim());
        searchName = parts[0];
        filterRegion = parts[1] || '';
    } else {
        // Try splitting on last space: "Austin TX" -> search "Austin", filter "TX"
        const words = query.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        // If last word looks like a state abbreviation (2 letters) or short state name
        if (words.length >= 2 && (lastWord.length <= 3 || STATE_ABBRS[lastWord.toLowerCase()])) {
            searchName = words.slice(0, -1).join(' ');
            filterRegion = lastWord;
        } else {
            searchName = query;
            filterRegion = '';
        }
    }

    // Try searching with the parsed city name
    let data = await geocodeFetch(searchName);

    // If no results and we split on space, try the full query as-is
    if ((!data.results || data.results.length === 0) && filterRegion) {
        data = await geocodeFetch(query);
        filterRegion = ''; // Don't filter since we searched the full string
    }

    if (!data.results || data.results.length === 0) {
        throw new Error('Location not found. Try a different city or zip code.');
    }

    let results = data.results.map(r => ({
        name: r.name,
        region: r.admin1 || '',
        country: r.country || '',
        lat: r.latitude,
        lon: r.longitude,
    }));

    // Filter by region if provided
    if (filterRegion) {
        const filter = filterRegion.toLowerCase();
        const filtered = results.filter(r => {
            const region = r.region.toLowerCase();
            const country = r.country.toLowerCase();
            return region.startsWith(filter) || region.includes(filter)
                || country.startsWith(filter) || country.includes(filter)
                || matchesStateAbbr(filter, region);
        });
        if (filtered.length > 0) results = filtered;
    }

    // If only one result or user already filtered, return it
    if (results.length === 1 || filterRegion) {
        return results[0];
    }

    // Multiple results — show picker
    return showLocationPicker(results);
}

const STATE_ABBRS = {
    al:'alabama',ak:'alaska',az:'arizona',ar:'arkansas',ca:'california',
    co:'colorado',ct:'connecticut',de:'delaware',fl:'florida',ga:'georgia',
    hi:'hawaii',id:'idaho',il:'illinois',in:'indiana',ia:'iowa',ks:'kansas',
    ky:'kentucky',la:'louisiana',me:'maine',md:'maryland',ma:'massachusetts',
    mi:'michigan',mn:'minnesota',ms:'mississippi',mo:'missouri',mt:'montana',
    ne:'nebraska',nv:'nevada',nh:'new hampshire',nj:'new jersey',nm:'new mexico',
    ny:'new york',nc:'north carolina',nd:'north dakota',oh:'ohio',ok:'oklahoma',
    or:'oregon',pa:'pennsylvania',ri:'rhode island',sc:'south carolina',
    sd:'south dakota',tn:'tennessee',tx:'texas',ut:'utah',vt:'vermont',
    va:'virginia',wa:'washington',wv:'west virginia',wi:'wisconsin',wy:'wyoming',
};

function matchesStateAbbr(abbr, fullName) {
    const expanded = STATE_ABBRS[abbr.toLowerCase()];
    return expanded && fullName.toLowerCase().includes(expanded);
}

function showLocationPicker(results) {
    // Reset search button while picker is shown
    const btn = document.querySelector('#search-form button');
    if (btn) { btn.disabled = false; btn.textContent = 'Search'; }

    return new Promise((resolve) => {
        const container = document.getElementById('search-error');
        container.hidden = false;
        container.style.color = '#1a1a1a';

        let html = '<div style="margin-top:0.5rem;">Did you mean:</div>';
        html += '<div style="display:flex;flex-direction:column;gap:0.25rem;margin-top:0.5rem;">';
        results.forEach((r, i) => {
            html += `<button class="location-pick" data-idx="${i}" style="
                text-align:left;padding:0.5rem 0.75rem;background:white;
                border:1px solid #d1d5db;border-radius:6px;cursor:pointer;
                font-size:0.9rem;transition:background 0.15s;
            ">${r.name}, ${r.region}, ${r.country}</button>`;
        });
        html += '</div>';
        container.innerHTML = html;

        container.addEventListener('click', function handler(e) {
            const btn = e.target.closest('.location-pick');
            if (!btn) return;
            container.removeEventListener('click', handler);
            container.hidden = true;
            container.innerHTML = '';
            container.style.color = '';
            resolve(results[parseInt(btn.dataset.idx)]);
        });
    });
}

async function fetchOpenMeteo(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
        hourly: 'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,cloud_cover,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        precipitation_unit: 'inch',
        pressure_unit: 'inHg',
        timezone: 'auto',
        forecast_days: 10,
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error('Weather data request failed');
    return res.json();
}

async function fetchAlerts(lat, lon) {
    try {
        const res = await fetch(
            `https://api.weather.gov/alerts/active?point=${lat},${lon}`,
            { headers: { 'User-Agent': 'NoAdsWeather (noadsweather.com)' } }
        );
        if (!res.ok) return [];
        const data = await res.json();
        return data.features || [];
    } catch {
        return [];
    }
}

// --- Render Functions --------------------------------------------------------

function renderCurrent(current) {
    const info = weatherInfo(current.weather_code);
    const section = document.getElementById('current-section');
    section.innerHTML = `
        <h2>Current Conditions</h2>
        <div style="display:flex;align-items:center;gap:1rem;">
            <span style="font-size:3rem;">${info.icon}</span>
            <div>
                <div style="font-size:2rem;font-weight:700;">${Math.round(current.temperature_2m)}°F</div>
                <div>${info.text}</div>
            </div>
        </div>
        <div style="margin-top:0.75rem;display:flex;gap:1.5rem;color:#6b7280;font-size:0.9rem;">
            <span>Humidity: ${current.relative_humidity_2m}%</span>
            <span>Wind: ${Math.round(current.wind_speed_10m)} mph ${windDirection(current.wind_direction_10m)}</span>
        </div>
    `;
}

function renderHourly(hourly) {
    const section = document.getElementById('hourly-section');
    const now = new Date();
    const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
    if (startIdx === -1) { section.innerHTML = ''; return; }

    let html = '<h2>Hourly Forecast</h2><div class="hourly-scroll">';
    for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const label = hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`;
        const info = weatherInfo(hourly.weather_code[i]);
        html += `
            <div class="hourly-item">
                <div>${label}</div>
                <div style="font-size:1.3rem;">${info.icon}</div>
                <div style="font-weight:600;">${Math.round(hourly.temperature_2m[i])}°</div>
            </div>
        `;
    }
    html += '</div>';
    section.innerHTML = html;
    initDragScroll(section.querySelector('.hourly-scroll'));
}

// --- 10-Day Forecast: unified scroll with sticky labels ---

const DAY_WIDTH = 100; // px per day column — shared by header + charts

function renderDaily(daily, hourly) {
    const section = document.getElementById('daily-section');
    const days = daily.time.length;
    const innerW = days * DAY_WIDTH;

    // Pre-compute chart ranges so we can build sticky labels
    const totalHours = Math.min(days * 24, hourly.time.length);
    const chartRanges = computeChartRanges(hourly, totalHours);

    // --- Compute temperature color per day ---
    const avgTemps = daily.time.map((_, i) =>
        (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2
    );
    const minAvg = Math.min(...avgTemps);
    const maxAvg = Math.max(...avgTemps);
    const avgRange = maxAvg - minAvg || 1;

    function tempBackground(avg) {
        const t = (avg - minAvg) / avgRange;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            // Dark mode: cool = dark blue, warm = dark red
            const r = Math.round(30 + t * 40);
            const g = Math.round(40 - t * 10);
            const b = Math.round(60 - t * 30);
            return `rgb(${r}, ${g}, ${b})`;
        }
        // Light mode: cool = light blue, warm = light red
        const r = Math.round(214 + t * 39);
        const g = Math.round(228 - t * 14);
        const b = Math.round(253 - t * 39);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // --- Day column header (inside scroll) ---
    let dayHeaderHtml = '';
    for (let i = 0; i < days; i++) {
        const date = new Date(daily.time[i] + 'T00:00:00');
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateLabel = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        const info = weatherInfo(daily.weather_code[i]);
        const precip = daily.precipitation_sum[i];
        const bg = tempBackground(avgTemps[i]);
        dayHeaderHtml += `
            <div class="forecast-day" style="width:${DAY_WIDTH}px;min-width:${DAY_WIDTH}px;background:${bg};">
                <div class="forecast-date">${dayLabel} ${dateLabel}</div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                    <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
                <div class="forecast-icon">${info.icon}</div>
                <div class="forecast-condition">${info.text}</div>
                <div class="forecast-precip">${precip > 0 ? '💧 ' + precip.toFixed(2) + ' in' : ''}</div>
            </div>
        `;
    }

    // Build chart rows — each has: sticky left labels | canvas | sticky right labels
    function chartRow(id, height, legendHtml, leftLabels, rightLabels) {
        return `
            <div class="chart-row">
                <div class="chart-legend">${legendHtml}</div>
                <div class="chart-row-inner">
                    <div class="chart-axis chart-axis-left">${leftLabels}</div>
                    <canvas id="${id}" width="${innerW}" height="${height}" style="display:block;width:${innerW}px;height:${height}px;"></canvas>
                    <div class="chart-axis chart-axis-right">${rightLabels}</div>
                </div>
            </div>
        `;
    }

    function makeLabels(min, max, steps, suffix, color) {
        let html = '';
        for (let i = steps; i >= 0; i--) {
            const val = min + ((max - min) / steps) * i;
            const label = Number.isInteger(val) ? val : val.toFixed(1);
            html += `<span style="color:${color}">${label}${suffix}</span>`;
        }
        return html;
    }

    const r = chartRanges;

    const tempLegend = '<span><span style="color:#dc2626;">■</span> Temperature (°F)</span><span><span style="color:#9333ea;">■</span> Feels Like (°F)</span><span><span style="color:#16a34a;">■</span> Dew Point (°F)</span>';
    const atmosLegend = '<span><span style="color:#9ca3af;">■</span> Cloud Cover (%)</span><span><span style="color:#3b82f6;">■</span> Precip Chance (%)</span><span><span style="color:#84cc16;">■</span> Humidity (%)</span><span><span style="color:#1a1a1a;">■</span> Pressure (inHg)</span>';
    const precipLegend = '<span><span style="color:#3b82f6;">■</span> Precip Accum. (in)</span><span><span style="color:#16a34a;">■</span> Hourly Precip (in)</span>';
    const windLegend = '<span><span style="color:#2563eb;">■</span> Wind Speed (mph)</span>';

    // Axis width must match CSS .chart-axis width
    const AXIS_W = 40;
    const totalScrollW = innerW + AXIS_W * 2;

    section.innerHTML = `
        <h2>10-Day Forecast</h2>
        <div class="forecast-scroll-outer">
            <div class="forecast-scroll" style="width:${totalScrollW}px;">
                <div class="forecast-header">
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                    ${dayHeaderHtml}
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                </div>
                ${chartRow('chart-temp', 160, tempLegend,
                    makeLabels(r.temp.min, r.temp.max, 4, '°', '#dc2626'),
                    makeLabels(r.temp.min, r.temp.max, 4, '°', '#dc2626'))}
                ${chartRow('chart-atmos', 160, atmosLegend,
                    makeLabels(0, 100, 4, '%', '#84cc16'),
                    makeLabels(0, 100, 4, '%', '#84cc16'))}
                ${chartRow('chart-precip', 100, precipLegend,
                    makeLabels(0, r.precip.maxAccum, 3, '"', '#3b82f6'),
                    makeLabels(0, r.precip.maxAccum, 3, '"', '#3b82f6'))}
                ${chartRow('chart-wind', 100, windLegend,
                    makeLabels(0, r.wind.max, 3, '', '#2563eb'),
                    makeLabels(0, r.wind.max, 3, '', '#2563eb'))}
                <div class="forecast-footer">
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                    ${daily.time.map((t, i) => {
                        const date = new Date(t + 'T00:00:00');
                        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dateLabel = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                        return `<div class="forecast-footer-day" style="width:${DAY_WIDTH}px;min-width:${DAY_WIDTH}px;">${dayLabel} ${dateLabel}</div>`;
                    }).join('')}
                    <div style="width:${AXIS_W}px;min-width:${AXIS_W}px;flex-shrink:0;"></div>
                </div>
            </div>
        </div>
    `;

    requestAnimationFrame(() => drawAllCharts(hourly, totalHours, chartRanges));

    // Drag-to-scroll
    initDragScroll(document.querySelector('.forecast-scroll-outer'));
}

function initDragScroll(el) {
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;

    el.style.cursor = 'grab';

    el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = 'grab'; });
    el.addEventListener('mouseup', () => { isDown = false; el.style.cursor = 'grab'; });

    el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        el.scrollLeft = scrollLeft - (x - startX);
    });

    // Touch support (mobile)
    let touchStartX, touchScrollLeft;
    el.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = el.scrollLeft;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX;
        el.scrollLeft = touchScrollLeft - (x - touchStartX);
    }, { passive: true });
}

function computeChartRanges(hourly, hours) {
    const temp = hourly.temperature_2m.slice(0, hours);
    const feels = hourly.apparent_temperature.slice(0, hours);
    const dew = hourly.dew_point_2m.slice(0, hours);
    const allTemps = [...temp, ...feels, ...dew];

    const precip = hourly.precipitation.slice(0, hours);
    let accumTotal = 0;
    for (let i = 0; i < hours; i++) accumTotal += precip[i] || 0;

    const wind = hourly.wind_speed_10m.slice(0, hours);

    return {
        temp: { min: Math.floor(Math.min(...allTemps) - 5), max: Math.ceil(Math.max(...allTemps) + 5) },
        precip: { maxAccum: Math.max(accumTotal, 0.1), maxHourly: Math.max(...precip, 0.01) },
        wind: { max: Math.max(...wind, 5) },
    };
}

// --- Chart drawing helpers ---

function getChartContext(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    return { ctx: canvas.getContext('2d'), w: canvas.width, h: canvas.height };
}

function drawLine(ctx, data, count, color, minVal, maxVal, w, h, pad) {
    const drawH = h - pad * 2;
    const range = maxVal - minVal || 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w;
        const y = pad + drawH - ((data[i] - minVal) / range) * drawH;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawArea(ctx, data, count, color, alpha, minVal, maxVal, w, h, pad) {
    const drawH = h - pad * 2;
    const range = maxVal - minVal || 1;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, h - pad);
    for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w;
        const y = pad + drawH - ((data[i] - minVal) / range) * drawH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h - pad);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

function drawDayDividers(ctx, count, w, h) {
    ctx.strokeStyle = isDarkMode() ? '#374151' : '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 24; i < count; i += 24) {
        const x = (i / (count - 1)) * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
    }
}

function drawNowLine(ctx, hourly, count, w, h) {
    const now = new Date();
    const startTime = new Date(hourly.time[0]);
    const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
    if (hoursElapsed < 0 || hoursElapsed > count) return;
    const x = (hoursElapsed / (count - 1)) * w;
    ctx.strokeStyle = isDarkMode() ? '#9ca3af' : '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.setLineDash([]);
}

// --- Draw all charts ---

function drawAllCharts(hourly, hours, r) {
    // Temperature
    const c1 = getChartContext('chart-temp');
    if (c1) {
        const { ctx, w, h } = c1;
        const pad = 10;
        const temp = hourly.temperature_2m.slice(0, hours);
        const feels = hourly.apparent_temperature.slice(0, hours);
        const dew = hourly.dew_point_2m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawLine(ctx, dew, hours, '#16a34a', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, feels, hours, '#9333ea', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, temp, hours, '#dc2626', r.temp.min, r.temp.max, w, h, pad);
    }

    // Atmospheric
    const c2 = getChartContext('chart-atmos');
    if (c2) {
        const { ctx, w, h } = c2;
        const pad = 10;
        const cloud = hourly.cloud_cover.slice(0, hours);
        const precipChance = hourly.precipitation_probability.slice(0, hours);
        const humidity = hourly.relative_humidity_2m.slice(0, hours);
        const pressure = hourly.surface_pressure.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawArea(ctx, cloud, hours, '#9ca3af', 0.3, 0, 100, w, h, pad);
        drawArea(ctx, precipChance, hours, '#3b82f6', 0.3, 0, 100, w, h, pad);
        drawLine(ctx, humidity, hours, '#84cc16', 0, 100, w, h, pad);
        drawLine(ctx, cloud, hours, '#9ca3af', 0, 100, w, h, pad);
        drawLine(ctx, precipChance, hours, '#3b82f6', 0, 100, w, h, pad);
        const pMin = Math.min(...pressure) - 0.1;
        const pMax = Math.max(...pressure) + 0.1;
        drawLine(ctx, pressure, hours, '#1a1a1a', pMin, pMax, w, h, pad);
    }

    // Precipitation
    const c3 = getChartContext('chart-precip');
    if (c3) {
        const { ctx, w, h } = c3;
        const pad = 8;
        const precip = hourly.precipitation.slice(0, hours);
        const accum = [];
        let total = 0;
        for (let i = 0; i < hours; i++) { total += precip[i] || 0; accum.push(total); }
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        const barW = w / hours;
        ctx.fillStyle = '#16a34a';
        for (let i = 0; i < hours; i++) {
            if (precip[i] > 0) {
                const barH = (precip[i] / r.precip.maxHourly) * (h - pad * 2) * 0.4;
                const x = (i / (hours - 1)) * w;
                ctx.fillRect(x - barW / 2, h - pad - barH, barW, barH);
            }
        }
        drawLine(ctx, accum, hours, '#3b82f6', 0, r.precip.maxAccum, w, h, pad);
    }

    // Wind
    const c4 = getChartContext('chart-wind');
    if (c4) {
        const { ctx, w, h } = c4;
        const pad = 8;
        const wind = hourly.wind_speed_10m.slice(0, hours);
        const dirs = hourly.wind_direction_10m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        drawArea(ctx, wind, hours, '#2563eb', 0.15, 0, r.wind.max, w, h, pad);
        drawLine(ctx, wind, hours, '#2563eb', 0, r.wind.max, w, h, pad);
        ctx.fillStyle = '#2563eb';
        for (let i = 0; i < hours; i += 6) {
            const x = (i / (hours - 1)) * w;
            const y = pad + (h - pad * 2) - (wind[i] / r.wind.max) * (h - pad * 2) - 12;
            const angle = (dirs[i] + 180) * Math.PI / 180;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, -5);
            ctx.lineTo(-3, 5);
            ctx.lineTo(3, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }
}

function renderAlerts(alerts) {
    const section = document.getElementById('alerts-section');
    if (!alerts || alerts.length === 0) {
        section.hidden = true;
        return;
    }
    section.hidden = false;
    let html = '<h2>⚠️ Weather Alerts</h2>';
    for (const alert of alerts) {
        const p = alert.properties;
        html += `
            <div style="margin-bottom:0.75rem;">
                <strong>${p.event}</strong>
                <div style="font-size:0.85rem;margin-top:0.25rem;">${p.headline || ''}</div>
            </div>
        `;
    }
    section.innerHTML = html;
}

let radarInterval = null;

function renderRadar(lat, lon) {
    if (radarInterval) { clearInterval(radarInterval); radarInterval = null; }

    const section = document.getElementById('radar-section');
    section.innerHTML = `
        <h2>Radar</h2>
        <div id="radar-container" style="position:relative;width:100%;aspect-ratio:1;background:#1a1a2e;border-radius:8px;overflow:hidden;">
            <div class="loading" style="color:#9ca3af;">Loading radar...</div>
        </div>
        <div id="radar-time" style="text-align:center;font-size:0.8rem;color:#6b7280;margin-top:0.5rem;"></div>
    `;
    loadRadar(lat, lon);
}

async function loadRadar(lat, lon) {
    try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        const frames = data.radar.past;

        const container = document.getElementById('radar-container');
        const zoom = 7;
        const n = Math.pow(2, zoom);

        // Exact fractional tile position for the city
        const exactX = (lon + 180) / 360 * n;
        const exactY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n;

        // Center tile
        const centerTileX = Math.floor(exactX);
        const centerTileY = Math.floor(exactY);

        // Fraction within center tile (0-1)
        const fracX = exactX - centerTileX;
        const fracY = exactY - centerTileY;

        // Use a 5x5 grid so there's always enough tile coverage after centering.
        // The city is at tile (centerTileX + fracX, centerTileY + fracY).
        // In the 5x5 grid, the center tile starts at index 2 (0-indexed), so
        // the city is at grid position (2 + fracX, 2 + fracY) out of 5 tiles.
        // As a percentage of the grid: (2 + frac) / 5 * 100.
        // We want that at 50% of the container, so:
        //   left = 50% - (2 + fracX) / 5 * gridWidth
        // where gridWidth = 500% of container.
        const gridSize = 5;
        const offsetX = 50 - (2 + fracX) / gridSize * 500;
        const offsetY = 50 - (2 + fracY) / gridSize * 500;

        function buildTileGrid(tileSrcFn, extraStyle) {
            // Use absolute positioning per tile instead of CSS grid to eliminate seam artifacts
            const tilePct = 100 / gridSize;
            let html = `<div style="position:absolute;left:${offsetX}%;top:${offsetY}%;width:${gridSize * 100}%;height:${gridSize * 100}%;${extraStyle || ''}">`;
            let idx = 0;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    const col = dx + 2;
                    const row = dy + 2;
                    // Overlap each tile by 0.5px on each side to prevent seam lines
                    html += `<img src="${tileSrcFn(centerTileX + dx, centerTileY + dy)}" alt="" style="position:absolute;left:${col * tilePct}%;top:${row * tilePct}%;width:${tilePct + 0.2}%;height:${tilePct + 0.2}%;display:block;">`;
                    idx++;
                }
            }
            return html + '</div>';
        }

        // Map base layer
        const mapHtml = buildTileGrid(
            (tx, ty) => {
                const style = isDarkMode() ? 'dark_all' : 'rastertiles/voyager';
                return `https://a.basemaps.cartocdn.com/${style}/${zoom}/${tx}/${ty}@2x.png`;
            },
            'opacity:0.7;'
        );

        // Radar layers — one per frame, all hidden except latest
        let radarHtml = '';
        frames.forEach((frame, i) => {
            radarHtml += buildTileGrid(
                (tx, ty) => `https://tilecache.rainviewer.com${frame.path}/256/${zoom}/${tx}/${ty}/2/1_0.png`,
                `opacity:${i === frames.length - 1 ? 1 : 0};transition:opacity 0.3s;`
            ).replace('<div ', `<div class="radar-frame" data-frame="${i}" `);
        });

        // City center marker — simple crosshair
        const markerHtml = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;">
                <div style="width:12px;height:12px;border:2px solid #2563eb;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.8);"></div>
            </div>`;

        container.innerHTML = mapHtml + radarHtml + markerHtml;

        // Show timestamp for latest frame
        const timeEl = document.getElementById('radar-time');
        const showFrameTime = (frame) => {
            const d = new Date(frame.time * 1000);
            timeEl.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        };
        showFrameTime(frames[frames.length - 1]);

        // Animate through frames
        let currentFrame = frames.length - 1;
        const allFrameEls = container.querySelectorAll('.radar-frame');

        radarInterval = setInterval(() => {
            allFrameEls[currentFrame].style.opacity = '0';
            currentFrame = (currentFrame + 1) % frames.length;
            allFrameEls[currentFrame].style.opacity = '1';
            showFrameTime(frames[currentFrame]);
        }, 500);

    } catch {
        document.getElementById('radar-container').innerHTML =
            '<div style="text-align:center;padding:2rem;color:#9ca3af;">Radar unavailable</div>';
    }
}

function renderSunMoon(daily, lat, lon) {
    const fmtTime = (d) => {
        if (!d || isNaN(d)) return '—';
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    // Sun
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);

    const sunSection = document.getElementById('sun-section');
    sunSection.innerHTML = `
        <h2>Sun</h2>
        <div class="astro-grid">
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌅</div>
                <div class="label">Sunrise</div>
                <div class="value">${fmtTime(sunrise)}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">☀️</div>
                <div class="label">Solar Noon</div>
                <div class="value">${fmtTime(solarNoon)}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌇</div>
                <div class="label">Sunset</div>
                <div class="value">${fmtTime(sunset)}</div>
            </div>
        </div>
    `;

    // Moon
    const now = new Date();
    const moon = getMoonPhase(now);
    const moonTimes = getMoonTimes(now, lat, lon);

    const moonSection = document.getElementById('moon-section');
    moonSection.innerHTML = `
        <h2>Moon</h2>
        <div class="astro-grid">
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌔</div>
                <div class="label">Moonrise</div>
                <div class="value">${fmtTime(moonTimes.rise)}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">${moon.icon}</div>
                <div class="label">Moon Phase</div>
                <div class="value">${moon.name}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌘</div>
                <div class="label">Moonset</div>
                <div class="value">${fmtTime(moonTimes.set)}</div>
            </div>
        </div>
    `;
}

// --- Moonrise/Moonset calculation ---
// Simplified algorithm based on Jean Meeus "Astronomical Algorithms"

function getMoonTimes(date, lat, lon) {
    const RAD = Math.PI / 180;
    const dayOfYear = getDayOfYear(date);
    const year = date.getFullYear();

    // Approximate moon position for each hour, find rise/set by altitude crossing
    const rise = findMoonEvent(date, lat, lon, 'rise');
    const set = findMoonEvent(date, lat, lon, 'set');
    return { rise, set };
}

function findMoonEvent(date, lat, lon, type) {
    const RAD = Math.PI / 180;
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    let prevAlt = moonAltitude(startOfDay, lat, lon);

    for (let m = 10; m <= 1440; m += 10) {
        const t = new Date(startOfDay.getTime() + m * 60000);
        const alt = moonAltitude(t, lat, lon);

        if (type === 'rise' && prevAlt < -0.833 && alt >= -0.833) {
            // Interpolate
            const frac = (0 - prevAlt) / (alt - prevAlt);
            return new Date(startOfDay.getTime() + (m - 10 + frac * 10) * 60000);
        }
        if (type === 'set' && prevAlt >= -0.833 && alt < -0.833) {
            const frac = (0 - prevAlt) / (alt - prevAlt);
            return new Date(startOfDay.getTime() + (m - 10 + frac * 10) * 60000);
        }
        prevAlt = alt;
    }
    return null; // Moon doesn't rise/set today
}

function moonAltitude(date, lat, lon) {
    const RAD = Math.PI / 180;

    // Julian date
    const JD = dateToJD(date);
    const T = (JD - 2451545.0) / 36525.0;

    // Moon ecliptic longitude (simplified)
    const L0 = 218.3165 + 481267.8813 * T;
    const M = 134.9634 + 477198.8676 * T;  // Moon mean anomaly
    const D = 297.8502 + 445267.1115 * T;  // Mean elongation
    const F = 93.2720 + 483202.0175 * T;   // Argument of latitude

    const Lm = L0 + 6.289 * Math.sin(M * RAD);
    const Bm = 5.128 * Math.sin(F * RAD);

    // Ecliptic to equatorial (simplified obliquity)
    const obliq = 23.439 - 0.0000004 * (JD - 2451545.0);
    const cosObl = Math.cos(obliq * RAD);
    const sinObl = Math.sin(obliq * RAD);

    const lRad = Lm * RAD;
    const bRad = Bm * RAD;

    const RA = Math.atan2(
        Math.sin(lRad) * cosObl - Math.tan(bRad) * sinObl,
        Math.cos(lRad)
    );
    const Dec = Math.asin(
        Math.sin(bRad) * cosObl + Math.cos(bRad) * sinObl * Math.sin(lRad)
    );

    // Hour angle
    const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0);
    const LST = (GMST + lon) * RAD;
    const HA = LST - RA;

    // Altitude
    const sinAlt = Math.sin(lat * RAD) * Math.sin(Dec) +
                   Math.cos(lat * RAD) * Math.cos(Dec) * Math.cos(HA);

    return Math.asin(sinAlt) / RAD;
}

function dateToJD(date) {
    const Y = date.getUTCFullYear();
    const M = date.getUTCMonth() + 1;
    const D = date.getUTCDate() + date.getUTCHours() / 24 +
              date.getUTCMinutes() / 1440 + date.getUTCSeconds() / 86400;
    let y = Y, m = M;
    if (m <= 2) { y--; m += 12; }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
}

// --- Orchestrator ------------------------------------------------------------

async function fetchAllWeatherData(lat, lon) {
    document.getElementById('alerts-section').hidden = true;
    document.getElementById('current-section').innerHTML = '<div class="loading">Loading...</div>';
    document.getElementById('hourly-section').innerHTML = '';
    document.getElementById('daily-section').innerHTML = '';
    document.getElementById('radar-section').innerHTML = '';
    document.getElementById('sun-section').innerHTML = '';
    document.getElementById('moon-section').innerHTML = '';

    try {
        const [meteo, alerts] = await Promise.all([
            fetchOpenMeteo(lat, lon),
            fetchAlerts(lat, lon),
        ]);

        renderCurrent(meteo.current);
        renderHourly(meteo.hourly);
        renderDaily(meteo.daily, meteo.hourly);
        renderAlerts(alerts);
        renderRadar(lat, lon);
        renderSunMoon(meteo.daily, lat, lon);
    } catch (err) {
        document.getElementById('current-section').innerHTML =
            `<p class="error">Failed to load weather data. Please try again.</p>`;
    }
}

// --- Navigation & Event Listeners --------------------------------------------

function showHome() {
    weatherView.hidden = true;
    homeView.hidden = false;
    searchInput.value = '';
    searchError.hidden = true;
}

function showWeather(location, query) {
    homeView.hidden = true;
    weatherView.hidden = false;
    const zipMatch = query && query.trim().match(/^(\d{5})$/);
    if (zipMatch) {
        locationName.textContent = `${location.name}, ${location.region} (${zipMatch[1]})`;
    } else {
        locationName.textContent = `${location.name}, ${location.region}`;
    }
}

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchError.hidden = true;
    searchForm.querySelector('button').disabled = true;
    searchForm.querySelector('button').textContent = 'Searching...';

    try {
        const location = await geocode(query);
        updateURL(query);
        showWeather(location, query);
        fetchAllWeatherData(location.lat, location.lon);
    } catch (err) {
        searchError.textContent = err.message;
        searchError.hidden = false;
    } finally {
        searchForm.querySelector('button').disabled = false;
        searchForm.querySelector('button').textContent = 'Search';
    }
});

backBtn.addEventListener('click', () => {
    showHome();
    history.pushState(null, '', location.pathname);
});

// --- URL State ---------------------------------------------------------------

function updateURL(query) {
    history.pushState(null, '', `?q=${encodeURIComponent(query)}`);
}

function getQueryFromURL() {
    // Support ?q=78258, #78258, and legacy hash
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) return params.get('q');
    if (window.location.hash.length > 1) return decodeURIComponent(window.location.hash.slice(1));
    return '';
}

window.addEventListener('popstate', () => {
    const query = getQueryFromURL();
    if (query) {
        searchInput.value = query;
        searchForm.dispatchEvent(new Event('submit'));
    } else {
        showHome();
    }
});

// Load from URL on page load
(function () {
    const query = getQueryFromURL();
    if (query) {
        searchInput.value = query;
        searchForm.dispatchEvent(new Event('submit'));
    }
})();

// --- Dark Mode ---------------------------------------------------------------

(function () {
    const toggle = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }

    // Initialize: use stored preference, fall back to OS preference
    if (stored) {
        setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
})();
