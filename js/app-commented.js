// =============================================================================
// NoAdsWeather - app.js
//
// Main application script for NoAdsWeather.com, a vanilla JavaScript weather
// site. Features include: geocoding (city name / international postal codes),
// weather data from Open-Meteo, air quality, pollen (via Google Pollen API
// proxy), NWS alerts, animated radar (RainViewer + CartoDB tiles), 10-day
// forecast with interactive canvas charts, moonrise/moonset astronomical
// calculations, a two-column drag-to-reorder layout system, dark/light theme,
// unit system toggling (imperial/metric), and localStorage persistence for
// all user preferences.
// =============================================================================

// =============================================================================
//  SECTION: Units System
//  Manages imperial/metric unit preferences with localStorage persistence.
//  On first visit, units auto-detect from the user's country. After that,
//  explicit user choices are stored and respected.
// =============================================================================

/**
 * Countries that default to imperial units (Fahrenheit, mph, inches).
 * All other countries default to metric (Celsius, km/h, mm).
 * @type {string[]}
 */
const IMPERIAL_COUNTRIES = ['United States', 'Liberia', 'Myanmar'];

/**
 * Current unit settings object, mutated in-place throughout the app.
 * - temp: 'fahrenheit' | 'celsius'
 * - wind: 'mph' | 'kmh'
 * - precip: 'inch' | 'mm'
 * - pressure: 'inHg' | 'hPa'
 * - time24h: boolean (false = 12-hour clock, true = 24-hour clock)
 */
let units = {
    temp: 'fahrenheit',
    wind: 'mph',
    precip: 'inch',
    pressure: 'inHg',
    time24h: false,
};

/**
 * Returns true if the current unit system is imperial (Fahrenheit).
 * @returns {boolean}
 */
function isImperial() { return units.temp === 'fahrenheit'; }

/**
 * Persists the user's unit preference to localStorage.
 * Only stores temp scale and time format; wind/precip/pressure are derived.
 */
function saveUnitsPref() {
    localStorage.setItem('unitsPref', JSON.stringify({ temp: units.temp, time24h: units.time24h }));
}

/**
 * Loads the stored unit preference from localStorage.
 * @returns {Object|null} The stored preference object or null if none exists.
 */
function loadUnitsPref() {
    return JSON.parse(localStorage.getItem('unitsPref') || 'null');
}

/**
 * Sets all derived units (wind, precip, pressure) based on the temperature scale.
 * @param {string} temp - Either 'fahrenheit' or 'celsius'.
 */
function applyUnitsFromTemp(temp) {
    const imperial = temp === 'fahrenheit';
    units.temp = temp;
    units.wind = imperial ? 'mph' : 'kmh';
    units.precip = imperial ? 'inch' : 'mm';
    units.pressure = imperial ? 'inHg' : 'hPa';
}

/**
 * Determines which unit system to use based on the geocoded country name.
 * If the user has a stored preference (from a previous toggle), that takes
 * priority over auto-detection. Otherwise, imperial is used for US/Liberia/Myanmar
 * and metric for everywhere else.
 * @param {string} country - Full country name from the geocoding result.
 */
function setUnitsForCountry(country) {
    const stored = loadUnitsPref();
    if (stored) {
        // User has a stored preference -- use it
        applyUnitsFromTemp(stored.temp);
        units.time24h = stored.time24h;
    } else {
        // No stored preference -- auto-detect from country
        if (IMPERIAL_COUNTRIES.includes(country)) {
            units = { temp: 'fahrenheit', wind: 'mph', precip: 'inch', pressure: 'inHg', time24h: false };
        } else {
            units = { temp: 'celsius', wind: 'kmh', precip: 'mm', pressure: 'hPa', time24h: true };
        }
    }
    updateUnitsToggleLabel();
}

/**
 * Toggles between imperial and metric, saves the preference,
 * and updates the toggle button label.
 */
function toggleUnits() {
    applyUnitsFromTemp(isImperial() ? 'celsius' : 'fahrenheit');
    updateUnitsToggleLabel();
    saveUnitsPref();
}

/**
 * Updates the text on the unit toggle and time toggle buttons in the UI.
 * The unit button shows the *opposite* scale (what you'd switch to),
 * and the time button shows the opposite format.
 */
function updateUnitsToggleLabel() {
    const btn = document.getElementById('units-toggle');
    if (btn) btn.textContent = isImperial() ? '°C' : '°F';
    const timeBtn = document.getElementById('time-toggle');
    if (timeBtn) timeBtn.textContent = units.time24h ? '12H' : '24H';
}

/**
 * Returns the display string for the current temperature unit.
 * @returns {string} Either '°F' or '°C'.
 */
function tempUnit() { return isImperial() ? '°F' : '°C'; }

/**
 * Returns the display string for the current wind speed unit.
 * @returns {string} Either 'mph' or 'km/h'.
 */
function windUnit() { return isImperial() ? 'mph' : 'km/h'; }

/**
 * Returns the display string for the current precipitation unit.
 * @returns {string} Either '"' (inches) or 'mm'.
 */
function precipUnit() { return isImperial() ? '"' : 'mm'; }

/**
 * Formats a Date object as a localized time string respecting the user's
 * 12h/24h preference. Returns an em-dash for invalid dates.
 * @param {Date} date - The date to format.
 * @returns {string} Formatted time string, e.g. "3:45 PM" or "15:45".
 */
function fmtTimeUnit(date) {
    if (!date || isNaN(date)) return '—';
    if (units.time24h) {
        return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Formats a precipitation value with the appropriate unit suffix.
 * Imperial uses 2 decimal places (inches); metric uses 1 (mm).
 * @param {number} val - Precipitation amount.
 * @returns {string} Formatted string, e.g. '0.25"' or '6.4mm'.
 */
function fmtPrecip(val) {
    if (isImperial()) return val.toFixed(2) + '"';
    return val.toFixed(1) + 'mm';
}

// =============================================================================
//  SECTION: Section Preferences System
//  Manages the two-column layout, section ordering, minimized/hidden state,
//  and chart row ordering. All preferences are persisted in localStorage
//  under the key 'sectionPrefs'.
// =============================================================================

/**
 * Default section order -- used as the canonical list of section IDs.
 * @type {string[]}
 */
const DEFAULT_SECTION_ORDER = [
    'current-section', 'details-section', 'hourly-section', 'daily-section',
    'radar-section', 'sun-section', 'moon-section'
];

/**
 * Default two-column layout assignments.
 * Each entry specifies a section's ID and its column: 'left', 'right', or 'wide'.
 * 'wide' sections span the full width and break the current column row.
 * The order of this array determines the visual order of sections.
 * @type {Array<{id: string, col: string}>}
 */
const DEFAULT_LAYOUT_LIST = [
    { id: 'current-section', col: 'left' },
    { id: 'details-section', col: 'right' },
    { id: 'hourly-section', col: 'wide' },
    { id: 'daily-section', col: 'wide' },
    { id: 'radar-section', col: 'left' },
    { id: 'sun-section', col: 'right' },
    { id: 'moon-section', col: 'right' },
];

/** Default order of chart rows within the 10-day forecast section. */
const DEFAULT_CHART_ORDER = ['chart-temp', 'chart-atmos', 'chart-precip', 'chart-wind'];

/** Sections that default to full-width (spanning both columns). */
const DEFAULT_WIDE_SECTIONS = ['daily-section', 'hourly-section'];

/**
 * Human-readable names for each section, used in control labels
 * and the "show hidden section" buttons.
 * @type {Object<string, string>}
 */
const SECTION_NAMES = {
    'current-section': 'Current Conditions',
    'details-section': 'Pollen',
    'hourly-section': 'Hourly Forecast',
    'daily-section': '10-Day Forecast',
    'radar-section': 'Radar',
    'sun-section': 'Sun',
    'moon-section': 'Moon',
};

/**
 * Loads section preferences from localStorage.
 * If the stored data is missing the layoutList property (legacy format),
 * it resets to defaults. Ensures all expected properties exist.
 * @returns {Object} Section preferences with properties:
 *   - layoutList: Array<{id, col}> -- section order and column assignments
 *   - hidden: string[] -- IDs of fully hidden sections
 *   - minimized: string[] -- IDs of collapsed/minimized sections
 *   - chartOrder: string[] -- order of chart rows in the daily forecast
 *   - hiddenCharts: string[] -- IDs of hidden chart rows
 */
function loadSectionPrefs() {
    const stored = JSON.parse(localStorage.getItem('sectionPrefs') || 'null');
    // Validate -- if missing layoutList, reset to defaults
    if (stored && !stored.layoutList) {
        localStorage.removeItem('sectionPrefs');
        return { layoutList: JSON.parse(JSON.stringify(DEFAULT_LAYOUT_LIST)), hidden: [], minimized: [], chartOrder: [...DEFAULT_CHART_ORDER], hiddenCharts: [] };
    }
    const prefs = stored || {
        order: [...DEFAULT_SECTION_ORDER],
        hidden: [],
        minimized: [],
        chartOrder: [...DEFAULT_CHART_ORDER],
        hiddenCharts: [],
    };
    if (!prefs.hiddenCharts) prefs.hiddenCharts = [];
    if (!prefs.layoutList) prefs.layoutList = JSON.parse(JSON.stringify(DEFAULT_LAYOUT_LIST));
    return prefs;
}

/**
 * Saves section preferences to localStorage.
 * @param {Object} prefs - The section preferences object (see loadSectionPrefs).
 */
function saveSectionPrefs(prefs) {
    localStorage.setItem('sectionPrefs', JSON.stringify(prefs));
}

/**
 * Applies the stored section preferences to the DOM by rebuilding the
 * two-column layout. This is the core layout engine for the page.
 *
 * Algorithm:
 * 1. Resets all sections (un-hides, un-minimizes, removes wide class).
 * 2. Moves all sections back into the main container temporarily.
 * 3. Removes any existing .columns-row wrappers from previous renders.
 * 4. Walks through prefs.layoutList in order, grouping consecutive
 *    left/right sections into .columns-row divs (each containing two
 *    .weather-col divs). Wide sections break the grouping and are
 *    inserted directly into the container.
 * 5. Calls flushColumns() to emit the accumulated left/right sections
 *    whenever a wide section is encountered or at the end of the list.
 * 6. An extra empty columns-row is appended at the bottom as a drop
 *    target for drag-to-reorder.
 * 7. Applies hidden and minimized states.
 * 8. Reorders chart rows and injects section controls (drag handle,
 *    width toggle, minimize/hide button).
 */
function applySectionPreferences() {
    const prefs = loadSectionPrefs();
    const container = document.getElementById('weather-content');
    if (!container) return;

    // Reset all sections to default state
    for (const id of DEFAULT_SECTION_ORDER) {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = '';
            el.classList.remove('section-minimized');
            el.classList.remove('section-wide');
            // Move back to container temporarily so we can rebuild layout
            container.appendChild(el);
        }
    }

    // Remove old layout rows from previous render
    container.querySelectorAll('.columns-row').forEach(r => r.remove());

    // Build layout from prefs.layoutList
    // Walk through the list and group consecutive left/right items into columns-rows.
    // Wide items break the current row and get inserted directly.
    const spacer = container.querySelector('.bottom-spacer');
    let currentLeft = [];   // Accumulates left-column sections
    let currentRight = [];  // Accumulates right-column sections

    /**
     * Flushes accumulated left/right sections into a new .columns-row div.
     * Creates two .weather-col children (left and right) and inserts the
     * row into the container just before the bottom spacer element.
     * @param {boolean} [force=false] - If true, creates the row even if
     *   both columns are empty (used for the trailing empty drop target).
     */
    function flushColumns(force) {
        if (!force && currentLeft.length === 0 && currentRight.length === 0) return;
        const row = document.createElement('div');
        row.className = 'columns-row';
        const left = document.createElement('div');
        left.className = 'weather-col';
        const right = document.createElement('div');
        right.className = 'weather-col';
        for (const el of currentLeft) left.appendChild(el);
        for (const el of currentRight) right.appendChild(el);
        row.appendChild(left);
        row.appendChild(right);
        container.insertBefore(row, spacer);
        currentLeft = [];
        currentRight = [];
    }

    // Walk the layout list and distribute sections into columns
    for (const item of prefs.layoutList) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        if (item.col === 'wide') {
            // Wide sections break the column grouping
            flushColumns();
            el.classList.add('section-wide');
            container.insertBefore(el, spacer);
        } else if (item.col === 'left') {
            currentLeft.push(el);
        } else {
            currentRight.push(el);
        }
    }
    // Flush any remaining left/right sections
    flushColumns();
    // Always add an empty drop-target row at the end for drag-to-reorder
    flushColumns(true);

    // Apply hidden state -- set display:none on hidden sections
    for (const id of prefs.hidden) {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    // Apply minimized state -- add CSS class that collapses the section
    for (const id of prefs.minimized) {
        const el = document.getElementById(id);
        if (el) el.classList.add('section-minimized');
    }

    // Reorder chart rows within the daily forecast
    applyChartOrder(prefs.chartOrder || DEFAULT_CHART_ORDER);

    // Inject drag handle and control buttons on each section
    injectSectionControls();
    renderHiddenSectionsBar();
}

/**
 * Injects control buttons (drag handle, width toggle, minimize/hide)
 * into each visible section element. Removes any previously injected
 * controls first to avoid duplicates.
 *
 * Control behavior:
 * - Drag handle: visual grip for pointer-based drag-to-reorder
 * - Width button: toggles between single-column and full-width ('wide')
 * - Minimize button: first click minimizes (collapses), second click hides
 * - Clicking a minimized section body expands it back to full size
 */
function injectSectionControls() {
    for (const id of DEFAULT_SECTION_ORDER) {
        const el = document.getElementById(id);
        if (!el || el.style.display === 'none') continue;
        el.setAttribute('data-section-name', SECTION_NAMES[id] || id);
        // Remove old controls to avoid duplicates on re-render
        const old = el.querySelector('.section-controls');
        if (old) old.remove();

        const isMin = el.classList.contains('section-minimized');
        const isWide = el.classList.contains('section-wide');

        const controls = document.createElement('div');
        controls.className = 'section-controls';
        controls.innerHTML = `
            <span class="section-drag-handle" title="Drag to reorder">⠿</span>
            <button class="section-width-btn" title="${isWide ? 'Single column' : 'Full width'}">${isWide ? '▣' : '◫'}</button>
            <button class="section-min-btn" title="${isMin ? 'Remove section' : 'Minimize section'}">${isMin ? '✕' : '−'}</button>
        `;
        el.prepend(controls);

        // Width toggle: switches between 'wide' and 'left' column assignment
        controls.querySelector('.section-width-btn').addEventListener('click', () => {
            const p = loadSectionPrefs();
            const item = p.layoutList.find(x => x.id === id);
            if (!item) return;
            if (item.col === 'wide') {
                item.col = 'left';
            } else {
                item.col = 'wide';
            }
            saveSectionPrefs(p);
            applySectionPreferences();
        });

        // Minimize/hide: first click minimizes, second click fully hides
        controls.querySelector('.section-min-btn').addEventListener('click', () => {
            const p = loadSectionPrefs();
            if (el.classList.contains('section-minimized')) {
                // Already minimized -- now fully hide it
                el.style.display = 'none';
                p.minimized = p.minimized.filter(x => x !== id);
                if (!p.hidden.includes(id)) p.hidden.push(id);
                saveSectionPrefs(p);
                renderHiddenSectionsBar();
            } else {
                // First click: minimize (collapse) the section
                el.classList.add('section-minimized');
                if (!p.minimized.includes(id)) p.minimized.push(id);
                saveSectionPrefs(p);
                controls.querySelector('.section-min-btn').textContent = '✕';
                controls.querySelector('.section-min-btn').title = 'Remove section';
            }
        });

        // Click minimized section body to expand it back to full size
        el.addEventListener('click', (e) => {
            if (!el.classList.contains('section-minimized')) return;
            // Don't expand if the user clicked a control button
            if (e.target.closest('.section-controls')) return;
            const p = loadSectionPrefs();
            el.classList.remove('section-minimized');
            p.minimized = p.minimized.filter(x => x !== id);
            saveSectionPrefs(p);
            controls.querySelector('.section-min-btn').textContent = '−';
            controls.querySelector('.section-min-btn').title = 'Minimize section';
        });
    }
}

/**
 * Renders a bar of "Show [section]" buttons for each hidden section.
 * Placed just after the weather summary element. Clicking a button
 * unhides the section and re-applies all layout preferences.
 */
function renderHiddenSectionsBar() {
    let bar = document.getElementById('hidden-sections-bar');
    const prefs = loadSectionPrefs();

    // If nothing is hidden, remove the bar entirely
    if (prefs.hidden.length === 0) {
        if (bar) bar.remove();
        return;
    }

    // Create the bar if it doesn't exist yet
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'hidden-sections-bar';
        const summary = document.getElementById('weather-summary');
        if (summary) summary.parentNode.insertBefore(bar, summary.nextSibling);
    }

    // Render one button per hidden section
    bar.innerHTML = prefs.hidden.map(id =>
        `<button class="show-section-btn" data-id="${id}">Show ${SECTION_NAMES[id] || id}</button>`
    ).join(' ');

    // Attach click handlers to unhide sections
    bar.querySelectorAll('.show-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const p = loadSectionPrefs();
            p.hidden = p.hidden.filter(h => h !== id);
            saveSectionPrefs(p);
            const el = document.getElementById(id);
            if (el) {
                el.style.display = '';
                el.classList.remove('section-minimized');
            }
            applySectionPreferences();
        });
    });
}

// =============================================================================
//  SECTION: Drag-to-Reorder (Sections)
//  Implements pointer-event-based drag-and-drop for reordering sections
//  between the two columns. Uses a placeholder div to indicate drop position,
//  nearest-column detection (within 200px), and rebuilds the layoutList
//  from the final DOM state.
// =============================================================================

/**
 * Initializes section drag-to-reorder using pointer events on the
 * weather-content container. Uses event delegation so it works across
 * re-renders without needing to rebind handlers.
 *
 * Drag mechanics:
 * 1. pointerdown on a .section-drag-handle captures the pointer and
 *    creates a placeholder div at the section's original position.
 * 2. The dragged section is set to position:fixed and follows the cursor.
 * 3. On pointermove, the nearest .weather-col column is found (using
 *    Euclidean distance to column edges, within a 200px threshold).
 *    The placeholder is inserted before the nearest sibling section
 *    in that column based on vertical cursor position.
 * 4. On pointerup, the section is placed at the placeholder's position,
 *    the placeholder is removed, and the new layout order is rebuilt
 *    by walking the DOM tree (columns-rows and wide sections).
 * 5. Left/right sections within a columns-row are interleaved in the
 *    layoutList to maintain relative ordering for future renders.
 */
function initSectionDrag() {
    const container = document.getElementById('weather-content');
    if (!container) return;

    let dragEl = null;       // The section element being dragged
    let placeholder = null;  // Visual placeholder showing where the section will drop
    let offsetY = 0;         // Vertical offset from cursor to section top
    let offsetX = 0;         // Horizontal offset from cursor to section left
    let dragActive = false;  // Whether a drag is currently in progress

    // --- pointerdown: start drag ---
    container.addEventListener('pointerdown', (e) => {
        const handle = e.target.closest('.section-drag-handle');
        if (!handle) return;

        dragEl = handle.closest('section');
        if (!dragEl || !DEFAULT_SECTION_ORDER.includes(dragEl.id)) return;

        e.preventDefault();
        // Capture the pointer to receive move/up events even outside the element
        handle.setPointerCapture(e.pointerId);

        const rect = dragEl.getBoundingClientRect();
        offsetY = e.clientY - rect.top;
        offsetX = e.clientX - rect.left;

        // Create placeholder at the section's original size and position
        placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = rect.height + 'px';
        dragEl.parentNode.insertBefore(placeholder, dragEl);

        // Pull the section out of flow and position it fixed under the cursor
        dragEl.classList.add('section-dragging');
        dragEl.style.position = 'fixed';
        dragEl.style.top = (e.clientY - offsetY) + 'px';
        dragEl.style.left = (e.clientX - offsetX) + 'px';
        dragEl.style.width = rect.width + 'px';
        dragEl.style.zIndex = '999';
        dragActive = true;
        document.body.classList.add('is-dragging');
    });

    // --- pointermove: update position and find drop target ---
    container.addEventListener('pointermove', (e) => {
        if (!dragActive || !dragEl) return;
        e.preventDefault();

        // Move the dragged section to follow the cursor
        dragEl.style.top = (e.clientY - offsetY) + 'px';
        dragEl.style.left = (e.clientX - offsetX) + 'px';

        // Find the nearest .weather-col column to the cursor using
        // Euclidean distance to the column's bounding rectangle edges.
        // Distance is 0 if the cursor is inside the column.
        const cols = [...container.querySelectorAll('.weather-col')];
        let targetCol = null;
        let minDist = Infinity;
        for (const col of cols) {
            const r = col.getBoundingClientRect();
            const dx = e.clientX < r.left ? r.left - e.clientX : e.clientX > r.right ? e.clientX - r.right : 0;
            const dy = e.clientY < r.top ? r.top - e.clientY : e.clientY > r.bottom ? e.clientY - r.bottom : 0;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < minDist) {
                minDist = dist;
                targetCol = col;
            }
        }

        // Only snap to a column if within 200px (prevents long-distance jumps)
        if (targetCol && minDist < 200) {
            // Move placeholder into the target column if not already there
            if (placeholder.parentNode !== targetCol) targetCol.appendChild(placeholder);

            // Position placeholder before the first sibling whose midpoint is below the cursor
            const siblings = [...targetCol.querySelectorAll('section:not(.section-dragging)')];
            let inserted = false;
            for (const sib of siblings) {
                const r = sib.getBoundingClientRect();
                if (e.clientY < r.top + r.height / 2) {
                    targetCol.insertBefore(placeholder, sib);
                    inserted = true;
                    break;
                }
            }
            // If cursor is below all siblings, append at end
            if (!inserted) targetCol.appendChild(placeholder);
        }
    });

    /**
     * Ends the drag operation: places the section at the placeholder's
     * position, cleans up styles, and rebuilds the layoutList from
     * the current DOM state.
     */
    const endDrag = () => {
        if (!dragActive || !dragEl) return;

        // Place the section where the placeholder is
        placeholder.parentNode.insertBefore(dragEl, placeholder);
        placeholder.remove();

        // Reset the section's inline styles
        dragEl.classList.remove('section-dragging');
        dragEl.style.position = '';
        dragEl.style.top = '';
        dragEl.style.left = '';
        dragEl.style.width = '';
        dragEl.style.zIndex = '';

        // Rebuild layoutList from current DOM state by walking all
        // columns-rows and wide sections in document order
        const prefs = loadSectionPrefs();
        const newList = [];
        for (const child of container.children) {
            if (child.classList && child.classList.contains('columns-row')) {
                const left = child.querySelector('.weather-col:first-child');
                const right = child.querySelector('.weather-col:last-child');
                const leftSections = left ? [...left.querySelectorAll('section')].map(s => s.id) : [];
                const rightSections = right ? [...right.querySelectorAll('section')].map(s => s.id) : [];
                // Interleave left and right to preserve relative order
                // (important so applySectionPreferences reproduces the same layout)
                const maxLen = Math.max(leftSections.length, rightSections.length);
                for (let i = 0; i < maxLen; i++) {
                    if (i < leftSections.length) newList.push({ id: leftSections[i], col: 'left' });
                    if (i < rightSections.length) newList.push({ id: rightSections[i], col: 'right' });
                }
            } else if (child.tagName === 'SECTION' && DEFAULT_SECTION_ORDER.includes(child.id)) {
                // Wide section (not inside a columns-row)
                newList.push({ id: child.id, col: 'wide' });
            }
        }
        if (newList.length > 0) prefs.layoutList = newList;
        saveSectionPrefs(prefs);

        dragEl = null;
        placeholder = null;
        dragActive = false;
        document.body.classList.remove('is-dragging');
    };

    container.addEventListener('pointerup', endDrag);
    container.addEventListener('pointercancel', endDrag);
}

/**
 * Applies chart row ordering within the 10-day forecast scroll container.
 * Reorders chart-row elements according to the given order, hides any
 * charts in the hiddenCharts list, and attaches hide-button handlers.
 * Uses requestAnimationFrame to ensure the DOM is ready.
 * @param {string[]} chartOrder - Array of chart IDs in desired order.
 */
function applyChartOrder(chartOrder) {
    requestAnimationFrame(() => {
        const scroll = document.querySelector('.forecast-scroll');
        if (!scroll) return;
        const prefs = loadSectionPrefs();
        const footer = scroll.querySelector('.forecast-footer');

        // Reorder chart rows: move each row before the footer in the specified order
        for (const chartId of chartOrder) {
            const row = scroll.querySelector(`[data-chart-id="${chartId}"]`);
            if (row && footer) {
                scroll.insertBefore(row, footer);
                // Apply hidden state for this chart
                if (prefs.hiddenCharts.includes(chartId)) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            }
        }

        // Attach click handlers for chart hide (X) buttons
        scroll.querySelectorAll('.chart-min-btn').forEach(btn => {
            btn.onclick = () => {
                const chartId = btn.dataset.chartId;
                const p = loadSectionPrefs();
                if (!p.hiddenCharts.includes(chartId)) p.hiddenCharts.push(chartId);
                saveSectionPrefs(p);
                const row = btn.closest('.chart-row');
                if (row) row.style.display = 'none';
                renderHiddenChartsBar();
            };
        });

        renderHiddenChartsBar();
    });
}

/**
 * Human-readable names for each chart row, used in "Show [chart]" buttons.
 * @type {Object<string, string>}
 */
const CHART_NAMES = {
    'chart-temp': 'Temperature',
    'chart-atmos': 'Cloud/Humidity/Pressure',
    'chart-precip': 'Precipitation',
    'chart-wind': 'Wind',
};

/**
 * Renders a bar of "Show [chart]" buttons for each hidden chart row
 * inside the daily forecast section. Similar to renderHiddenSectionsBar
 * but scoped to chart rows only.
 */
function renderHiddenChartsBar() {
    const section = document.getElementById('daily-section');
    if (!section) return;
    let bar = document.getElementById('hidden-charts-bar');
    const prefs = loadSectionPrefs();

    if (prefs.hiddenCharts.length === 0) {
        if (bar) bar.remove();
        return;
    }

    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'hidden-charts-bar';
        // Insert after the h2 heading within the daily section
        const h2 = section.querySelector('h2');
        if (h2) h2.parentNode.insertBefore(bar, h2.nextSibling);
        else section.prepend(bar);
    }

    bar.innerHTML = prefs.hiddenCharts.map(id =>
        `<button class="show-section-btn" data-id="${id}">Show ${CHART_NAMES[id] || id}</button>`
    ).join(' ');

    bar.querySelectorAll('.show-section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const p = loadSectionPrefs();
            p.hiddenCharts = p.hiddenCharts.filter(h => h !== id);
            saveSectionPrefs(p);
            const row = document.querySelector(`[data-chart-id="${id}"]`);
            if (row) row.style.display = '';
            renderHiddenChartsBar();
        });
    });
}

// =============================================================================
//  SECTION: Drag-to-Reorder (Chart Rows)
//  Similar to section drag but scoped to chart rows within the daily
//  forecast's .forecast-scroll container. Uses the same pointer-event
//  pattern with a placeholder and saves chart order on drop.
// =============================================================================

/**
 * Initializes drag-to-reorder for chart rows within the 10-day forecast.
 * Listens for pointerdown on .chart-drag-handle elements, then uses
 * pointermove/pointerup to allow vertical reordering of chart rows
 * within the forecast scroll container. Saves the new chart order
 * to localStorage on drop.
 */
function initChartDrag() {
    document.addEventListener('pointerdown', (e) => {
        const handle = e.target.closest('.chart-drag-handle');
        if (!handle) return;
        const chartRow = handle.closest('.chart-row');
        const scroll = chartRow ? chartRow.closest('.forecast-scroll') : null;
        if (!chartRow || !scroll) return;

        e.preventDefault();
        handle.setPointerCapture(e.pointerId);

        const rect = chartRow.getBoundingClientRect();
        const scrollRect = scroll.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;

        // Create placeholder at the chart row's original position
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-placeholder';
        placeholder.style.height = rect.height + 'px';
        scroll.insertBefore(placeholder, chartRow);

        // Position the chart row as fixed, following the cursor vertically
        chartRow.classList.add('section-dragging');
        chartRow.style.position = 'fixed';
        chartRow.style.top = (e.clientY - offsetY) + 'px';
        chartRow.style.left = scrollRect.left + 'px';
        chartRow.style.width = scrollRect.width + 'px';
        chartRow.style.zIndex = '999';

        const onMove = (e2) => {
            e2.preventDefault();
            chartRow.style.top = (e2.clientY - offsetY) + 'px';

            // Find insertion point among visible chart rows
            const rows = [...scroll.querySelectorAll('.chart-row:not(.section-dragging)')];
            for (const row of rows) {
                const r = row.getBoundingClientRect();
                if (e2.clientY < r.top + r.height / 2) {
                    scroll.insertBefore(placeholder, row);
                    return;
                }
            }
            // If below all rows, place before the footer
            const footer = scroll.querySelector('.forecast-footer');
            if (footer) scroll.insertBefore(placeholder, footer);
        };

        const onUp = () => {
            // Place chart row at placeholder position
            scroll.insertBefore(chartRow, placeholder);
            placeholder.remove();

            // Reset inline styles
            chartRow.classList.remove('section-dragging');
            chartRow.style.position = '';
            chartRow.style.top = '';
            chartRow.style.left = '';
            chartRow.style.width = '';
            chartRow.style.zIndex = '';

            // Save new chart order by reading DOM order
            const newOrder = [...scroll.querySelectorAll('.chart-row')]
                .map(r => r.dataset.chartId)
                .filter(Boolean);
            const prefs = loadSectionPrefs();
            prefs.chartOrder = newOrder;
            saveSectionPrefs(prefs);

            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    });
}

// =============================================================================
//  SECTION: Constants
//  WMO weather code descriptions and icons used throughout the app.
// =============================================================================

/**
 * Maps WMO weather codes to human-readable text descriptions and emoji icons.
 * Used by weatherInfo() to convert numeric codes from the Open-Meteo API
 * into display strings.
 * @see https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 * @type {Object<number, {text: string, icon: string}>}
 */
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

// =============================================================================
//  SECTION: DOM References
//  Cached references to frequently used DOM elements.
// =============================================================================

const homeView = document.getElementById('home-view');
const weatherView = document.getElementById('weather-view');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchError = document.getElementById('search-error');
const locationName = document.getElementById('location-name');
const backBtn = document.getElementById('back-btn');

// =============================================================================
//  SECTION: Utility Functions
//  General-purpose helpers for weather codes, wind direction, tile math,
//  moon phase, temperature coloring, etc.
// =============================================================================

/**
 * Looks up a WMO weather code and returns its text description and icon.
 * Returns a fallback "Unknown" entry for unrecognized codes.
 * @param {number} code - WMO weather code from the Open-Meteo API.
 * @returns {{text: string, icon: string}}
 */
function weatherInfo(code) {
    return WEATHER_DESCRIPTIONS[code] || { text: 'Unknown', icon: '❓' };
}

/**
 * Converts a wind direction in degrees to a compass abbreviation.
 * Uses 8 cardinal/intercardinal directions (N, NE, E, SE, S, SW, W, NW).
 * @param {number} degrees - Wind direction in degrees (0 = N, 90 = E).
 * @returns {string} Compass direction abbreviation.
 */
function windDirection(degrees) {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(degrees / 45) % 8];
}

/**
 * Converts a longitude to a slippy map tile X coordinate at the given zoom level.
 * Used for building radar and map tile URLs.
 * @param {number} lon - Longitude in degrees.
 * @param {number} zoom - Zoom level (typically 7 for the radar view).
 * @returns {number} Tile X coordinate (integer).
 */
function lonToTile(lon, zoom) {
    return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

/**
 * Converts a latitude to a slippy map tile Y coordinate at the given zoom level.
 * Uses the Mercator projection formula.
 * @param {number} lat - Latitude in degrees.
 * @param {number} zoom - Zoom level.
 * @returns {number} Tile Y coordinate (integer).
 */
function latToTile(lat, zoom) {
    return Math.floor(
        (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) /
            2 *
            Math.pow(2, zoom)
    );
}

/**
 * Calculates the current moon phase based on the synodic month cycle.
 * Uses January 6, 2000 (known new moon) as a reference point and
 * divides the 29.53-day synodic month into 8 named phases.
 * @param {Date} date - The date to calculate the moon phase for.
 * @returns {{name: string, icon: string}} Phase name and emoji icon.
 */
function getMoonPhase(date) {
    // Reference new moon: January 6, 2000, 18:14 UTC
    const knownNew = new Date(2000, 0, 6, 18, 14);
    const synodicMonth = 29.53058867; // Average days between new moons
    const diff = (date - knownNew) / (1000 * 60 * 60 * 24); // Days since reference
    const phase = ((diff % synodicMonth) + synodicMonth) % synodicMonth; // Normalize to [0, synodic)
    const phaseFraction = phase / synodicMonth; // 0.0 = new moon, 0.5 = full moon

    let name, icon;
    // Divide the cycle into 8 equal phases (each ~3.69 days)
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

/**
 * Minimum temperature range (in the active unit) needed before
 * day-column background coloring is applied. If the range across
 * the forecast is less than this, all day columns stay transparent.
 * @type {number}
 */
const TEMP_COLOR_THRESHOLD = 5;

/**
 * Computes a background color for a forecast day column based on
 * its average temperature relative to the forecast range. Warmer days
 * shift toward red/warm tones, cooler days toward blue/cool tones.
 * Produces different palettes for dark and light mode.
 * @param {number} avg - The day's average temperature.
 * @param {number} minAvg - The minimum average temperature across all forecast days.
 * @param {number} avgRange - The range (max - min) of average temperatures.
 * @returns {string} CSS color string (rgb or 'transparent').
 */
function tempBackground(avg, minAvg, avgRange) {
    if (avgRange < TEMP_COLOR_THRESHOLD) return 'transparent';
    const t = (avg - minAvg) / avgRange; // Normalized 0-1 (cool to warm)
    if (isDarkMode()) {
        // Dark mode: subtle warm tint on warm days, cool tint on cool days
        const r = Math.round(20 + t * 40);
        const g = Math.round(50 - t * 15);
        const b = Math.round(50 - t * 35);
        return `rgb(${r}, ${g}, ${b})`;
    }
    // Light mode: light blue (cool) to light orange (warm)
    const r = Math.round(214 + t * 39);
    const g = Math.round(228 - t * 14);
    const b = Math.round(253 - t * 39);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Updates the background color of all .forecast-day elements based
 * on cached average temperatures. Called after theme toggle to
 * recompute colors for the new palette.
 */
function updateDayBackgrounds() {
    const avgTemps = window._forecastAvgTemps;
    if (!avgTemps) return;
    const minAvg = Math.min(...avgTemps);
    const avgRange = (Math.max(...avgTemps) - minAvg) || 1;
    document.querySelectorAll('.forecast-day').forEach((el, i) => {
        if (i < avgTemps.length) {
            el.style.background = tempBackground(avgTemps[i], minAvg, avgRange);
        }
    });
}

// =============================================================================
//  SECTION: Geocoding & Postal Code Support
//  Converts user search queries (city names, zip codes, international
//  postal codes) into latitude/longitude coordinates. Uses Open-Meteo
//  Geocoding API for city names and Zippopotam.us API for postal codes.
// =============================================================================

/**
 * Fetches geocoding results from the Open-Meteo Geocoding API.
 * Returns up to 10 results matching the given name string.
 * @param {string} name - City or location name to search for.
 * @returns {Promise<Object>} API response with a .results array.
 * @throws {Error} If the HTTP request fails.
 */
async function geocodeFetch(name) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    return res.json();
}

/**
 * Postal code regex patterns for countries supported by the Zippopotam.us API.
 *
 * Each entry contains:
 * - regex: Pattern to match against user input (case-insensitive)
 * - country: ISO 3166-1 alpha-2 code (lowercase, for Zippopotam URL)
 * - name: Full country name (used for unit detection and display)
 *
 * IMPORTANT: Several countries share the same 5-digit format (US, DE, FR, ES,
 * IT, MX). When a code matches multiple patterns, geocodeZip() fetches all
 * matching countries in parallel and presents a picker if multiple return results.
 *
 * Format examples:
 * - US: 90210 (5 digits)
 * - CA: K1A 0B1 (letter-digit-letter space digit-letter-digit)
 * - UK: SW1A 1AA (1-2 letters, digit, optional letter/digit, space, digit, 2 letters)
 * - NL: 1012 AB (4 digits, optional space, 2 letters)
 * - JP: 100-0001 (3 digits, hyphen, 4 digits)
 * - BR: 01001-000 (5 digits, hyphen, 3 digits)
 * - IN: 110001 (6 digits)
 * - PL: 00-001 (2 digits, hyphen, 3 digits)
 *
 * @type {Array<{regex: RegExp, country: string, name: string}>}
 */
const POSTAL_PATTERNS = [
    { regex: /^(\d{5})$/, country: 'us', name: 'United States' },                    // US: 90210
    { regex: /^(\d{5})$/, country: 'de', name: 'Germany' },                           // DE: 10115 (same format as US, tried after US)
    { regex: /^([A-Z]\d[A-Z]\s?\d[A-Z]\d)$/i, country: 'ca', name: 'Canada' },       // CA: K1A 0B1
    { regex: /^([A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i, country: 'gb', name: 'United Kingdom' }, // UK: SW1A 1AA
    { regex: /^(\d{4})$/, country: 'au', name: 'Australia' },                         // AU: 2000
    { regex: /^(\d{5}-\d{3})$/, country: 'br', name: 'Brazil' },                      // BR: 01001-000
    { regex: /^(\d{3}-\d{4})$/, country: 'jp', name: 'Japan' },                       // JP: 100-0001
    { regex: /^(\d{5})$/, country: 'fr', name: 'France' },                            // FR: 75001
    { regex: /^(\d{5})$/, country: 'es', name: 'Spain' },                             // ES: 28001
    { regex: /^(\d{5})$/, country: 'it', name: 'Italy' },                             // IT: 00100
    { regex: /^(\d{4}\s?[A-Z]{2})$/i, country: 'nl', name: 'Netherlands' },           // NL: 1012 AB
    { regex: /^(\d{4})$/, country: 'nz', name: 'New Zealand' },                       // NZ: 6011
    { regex: /^(\d{2}-\d{3})$/, country: 'pl', name: 'Poland' },                      // PL: 00-001
    { regex: /^(\d{4})$/, country: 'za', name: 'South Africa' },                      // ZA: 2000
    { regex: /^(\d{6})$/, country: 'in', name: 'India' },                             // IN: 110001
    { regex: /^(\d{5})$/, country: 'mx', name: 'Mexico' },                            // MX: 06600
];

/**
 * Looks up a postal code using the Zippopotam.us API for a specific country.
 *
 * Handles country-specific quirks:
 * - UK (gb): Zippopotam only accepts the "outcode" (first part of the postcode,
 *   e.g. "OX1" not "OX1 1AB"), so we strip everything after the first space.
 * - Netherlands (nl): Zippopotam requires no space in the code (e.g. "1012AB"
 *   not "1012 AB"), so we strip all whitespace.
 *
 * When multiple places are returned for a single postal code, the last place
 * is chosen (Zippopotam often lists the main/recognizable city last).
 *
 * @param {string} code - The postal code string as entered by the user.
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code (lowercase).
 * @param {string} countryName - Full country name for the result object.
 * @returns {Promise<Object|null>} Location object {name, region, country, lat, lon}
 *   or null if the lookup fails or returns no results.
 */
async function geocodePostal(code, countryCode, countryName) {
    // UK postcodes: strip to outcode only (first part before space)
    let lookupCode = code;
    if (countryCode === 'gb') {
        lookupCode = code.trim().split(/\s+/)[0];
    }
    // NL postcodes: remove internal space (e.g. "1012 AB" -> "1012AB")
    if (countryCode === 'nl') {
        lookupCode = code.replace(/\s/g, '');
    }

    const res = await fetch(`https://api.zippopotam.us/${countryCode}/${encodeURIComponent(lookupCode)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.places || data.places.length === 0) return null;
    // Pick the best place name -- prefer the last entry (Zippopotam often
    // puts the main/recognizable city last when multiple places share a code)
    const places = data.places;
    const place = places.length > 1 ? places[places.length - 1] : places[0];
    return {
        name: place['place name'],
        region: place['state abbreviation'] || place['state'] || '',
        country: countryName,
        lat: parseFloat(place.latitude),
        lon: parseFloat(place.longitude),
    };
}

/**
 * Attempts to geocode a query string as an international postal code.
 *
 * Strategy:
 * 1. If the user prefixed the query with a 2-letter country code
 *    (e.g. "DE 10115" or "UK SW1A 1AA"), extract the country code and
 *    look up directly against that country's pattern.
 * 2. Otherwise, test the query against all POSTAL_PATTERNS to find
 *    which countries' formats it matches.
 * 3. If exactly one country matches, look it up directly.
 * 4. If multiple countries match (e.g. 5-digit codes matching US, DE, FR,
 *    ES, IT, MX), fetch all in parallel and show a location picker if
 *    multiple return valid results.
 *
 * @param {string} query - The user's search input string.
 * @returns {Promise<Object|null>} Location object {name, region, country, lat, lon}
 *   or null if the query doesn't match any postal code pattern.
 */
async function geocodeZip(query) {
    const trimmed = query.trim();

    // Check if user prefixed with a country code, e.g. "DE 10115" or "UK SW1A 1AA"
    const prefixMatch = trimmed.match(/^([A-Z]{2})\s+(.+)$/i);
    if (prefixMatch) {
        const cc = prefixMatch[1].toLowerCase();
        const code = prefixMatch[2];
        const pattern = POSTAL_PATTERNS.find(p => p.country === cc);
        if (pattern) {
            const result = await geocodePostal(code, cc, pattern.name);
            if (result) return result;
        }
    }

    // Find all country patterns that match this postal code format
    const matchingPatterns = [];
    for (const p of POSTAL_PATTERNS) {
        if (p.regex.test(trimmed)) {
            matchingPatterns.push(p);
        }
    }

    if (matchingPatterns.length === 0) return null;

    // If only one country matches the format, just try it
    if (matchingPatterns.length === 1) {
        return await geocodePostal(trimmed, matchingPatterns[0].country, matchingPatterns[0].name);
    }

    // Multiple countries match the same format (e.g. 5-digit codes) --
    // fetch all in parallel and show a picker if more than one succeeds
    const results = await Promise.all(
        matchingPatterns.map(p => geocodePostal(trimmed, p.country, p.name))
    );
    const validResults = results.filter(r => r !== null);

    if (validResults.length === 0) return null;
    if (validResults.length === 1) return validResults[0];

    // Multiple valid results -- show picker for user to disambiguate
    return showLocationPicker(validResults);
}

/**
 * Main geocoding function. Tries postal code lookup first, then falls
 * back to city name search with optional state/region filtering.
 *
 * Parsing logic for city + region:
 * - "Austin, TX" or "Austin,TX" -- split on comma
 * - "Austin TX" -- split on last space if the last word looks like a
 *   state abbreviation (2-3 chars or in STATE_ABBRS)
 * - "Austin" -- no region filter, search as-is
 *
 * If the parsed city name returns no results but a region was extracted,
 * retries with the full original query (to handle cases like "New York NY"
 * where "New" alone wouldn't match).
 *
 * Filtering:
 * When a region filter is provided, results are filtered by checking if
 * the result's admin1 region or country starts with or contains the filter
 * string, or matches via the STATE_ABBRS lookup table (so "TX" matches
 * "Texas").
 *
 * If multiple results remain after filtering, shows a location picker.
 *
 * @param {string} query - The user's search input.
 * @returns {Promise<Object>} Location object {name, region, country, lat, lon}.
 * @throws {Error} If no location is found.
 */
async function geocode(query) {
    // Check if input looks like a postal code first
    const postal = await geocodeZip(query);
    if (postal) return postal;

    // Parse city and region filter from input
    // Supports: "Austin, TX", "Austin,TX", "Austin TX", "Austin"
    let searchName, filterRegion;

    if (query.includes(',')) {
        // Comma-separated: "City, Region"
        const parts = query.split(',').map(s => s.trim());
        searchName = parts[0];
        filterRegion = parts[1] || '';
    } else {
        // Try splitting on last space: "Austin TX" -> search "Austin", filter "TX"
        const words = query.trim().split(/\s+/);
        const lastWord = words[words.length - 1];
        // If last word looks like a state abbreviation (2-3 letters or in abbr table)
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

    // If no results and we had split on space, try the full query as-is
    // (handles "New York NY" where searching just "New" would fail)
    if ((!data.results || data.results.length === 0) && filterRegion) {
        data = await geocodeFetch(query);
        filterRegion = ''; // Don't filter since we searched the full string
    }

    if (!data.results || data.results.length === 0) {
        throw new Error('Location not found. Try a different city or zip code.');
    }

    // Map API results to a simpler format
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

    // Multiple results -- show picker for user to choose
    return showLocationPicker(results);
}

/**
 * US state abbreviation lookup table. Maps lowercase 2-letter abbreviations
 * to their full lowercase state names for matching in geocode().
 * @type {Object<string, string>}
 */
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

/**
 * Checks whether a state abbreviation matches a full region/state name.
 * Expands the abbreviation using STATE_ABBRS and checks if the full name
 * is contained within the given fullName string.
 * @param {string} abbr - State abbreviation (e.g. "TX").
 * @param {string} fullName - Full region name to check against (e.g. "Texas").
 * @returns {boolean} True if the abbreviation expands to a match.
 */
function matchesStateAbbr(abbr, fullName) {
    const expanded = STATE_ABBRS[abbr.toLowerCase()];
    return expanded && fullName.toLowerCase().includes(expanded);
}

/**
 * Shows a location picker UI when multiple geocoding results are found.
 * Renders clickable buttons in the search error container and returns
 * a Promise that resolves with the user's selection.
 * @param {Array<Object>} results - Array of location objects to choose from.
 * @returns {Promise<Object>} Resolves with the selected location object.
 */
function showLocationPicker(results) {
    // Reset search button while picker is shown
    const btn = document.querySelector('#search-form button');
    if (btn) { btn.disabled = false; btn.textContent = 'Search'; }

    return new Promise((resolve) => {
        const container = document.getElementById('search-error');
        container.hidden = false;
        container.style.color = '#1a1a1a';

        // Build picker HTML with one button per result
        let html = '<div style="margin-top:0.5rem;">Did you mean:</div>';
        html += '<div style="display:flex;flex-direction:column;gap:0.25rem;margin-top:0.5rem;">';
        results.forEach((r, i) => {
            html += `<button class="location-pick" data-idx="${i}" style="
                text-align:left;padding:0.5rem 0.75rem;background:var(--card-bg);color:var(--text);
                border:1px solid var(--border);border-radius:6px;cursor:pointer;
                font-size:0.9rem;transition:background 0.15s;
            ">${r.name}, ${r.region}, ${r.country}</button>`;
        });
        html += '</div>';
        container.innerHTML = html;

        // Listen for a click on any picker button
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

// =============================================================================
//  SECTION: Weather API Functions
//  Fetches weather, air quality, and alert data from external APIs.
// =============================================================================

/**
 * Fetches comprehensive weather data from the Open-Meteo API.
 * Requests current conditions, hourly forecast (10 days), and daily
 * forecast. Unit parameters are set based on the current unit preferences.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Object>} Open-Meteo API response with .current, .hourly, .daily.
 * @throws {Error} If the request fails.
 */
async function fetchOpenMeteo(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index',
        hourly: 'temperature_2m,apparent_temperature,dew_point_2m,relative_humidity_2m,weather_code,cloud_cover,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
        temperature_unit: units.temp,
        wind_speed_unit: units.wind,
        precipitation_unit: units.precip,
        pressure_unit: units.pressure,
        timezone: 'auto',
        forecast_days: 10,
    });
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!res.ok) throw new Error('Weather data request failed');
    return res.json();
}

/**
 * Fetches air quality data from the Open-Meteo Air Quality API.
 * Returns current US AQI and pollen levels (grass, birch, ragweed, etc.).
 * Pollen data is primarily available for European locations.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Object|null>} Air quality current data or null on failure.
 */
async function fetchAirQuality(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'us_aqi,grass_pollen,birch_pollen,ragweed_pollen,alder_pollen,olive_pollen,mugwort_pollen',
        });
        const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
        if (!res.ok) return null;
        return (await res.json()).current;
    } catch {
        return null;
    }
}

/**
 * Converts a US AQI numeric value to a descriptive label and color.
 * Based on EPA AQI categories.
 * @param {number} aqi - US AQI value.
 * @returns {{text: string, color: string}} Label text and hex color.
 */
function aqiLabel(aqi) {
    if (aqi <= 50) return { text: 'Good', color: '#16a34a' };
    if (aqi <= 100) return { text: 'Moderate', color: '#ca8a04' };
    if (aqi <= 150) return { text: 'Unhealthy (Sensitive)', color: '#ea580c' };
    if (aqi <= 200) return { text: 'Unhealthy', color: '#dc2626' };
    if (aqi <= 300) return { text: 'Very Unhealthy', color: '#7c3aed' };
    return { text: 'Hazardous', color: '#7f1d1d' };
}

/**
 * Extracts and formats pollen data from the Open-Meteo air quality response.
 * Filters out null/undefined pollen types and maps each to a name, level
 * label, color, and rounded value.
 *
 * Pollen level thresholds (grains/m3):
 * - <= 10: Low (green)
 * - <= 50: Moderate (yellow)
 * - <= 100: High (orange)
 * - > 100: Very High (red)
 *
 * @param {Object|null} aq - Air quality data object from Open-Meteo.
 * @returns {Array<{name, level, color, value}>|null} Array of pollen items or null.
 */
function pollenSummary(aq) {
    if (!aq) return null;
    const types = [
        { name: 'Grass', val: aq.grass_pollen },
        { name: 'Birch', val: aq.birch_pollen },
        { name: 'Ragweed', val: aq.ragweed_pollen },
        { name: 'Alder', val: aq.alder_pollen },
        { name: 'Olive', val: aq.olive_pollen },
        { name: 'Mugwort', val: aq.mugwort_pollen },
    ].filter(t => t.val !== null && t.val !== undefined);
    if (types.length === 0) return null;

    /**
     * Maps a raw pollen value to a human-readable level string.
     * @param {number} v - Pollen concentration (grains/m3).
     * @returns {string} Level label.
     */
    function level(v) {
        if (v <= 10) return 'Low';
        if (v <= 50) return 'Moderate';
        if (v <= 100) return 'High';
        return 'Very High';
    }

    /**
     * Maps a raw pollen value to a color hex code.
     * @param {number} v - Pollen concentration.
     * @returns {string} Hex color.
     */
    function levelColor(v) {
        if (v <= 10) return '#16a34a';
        if (v <= 50) return '#ca8a04';
        if (v <= 100) return '#ea580c';
        return '#dc2626';
    }

    return types.map(t => ({
        name: t.name,
        level: level(t.val),
        color: levelColor(t.val),
        value: Math.round(t.val),
    }));
}

/**
 * Fetches active weather alerts from the NWS (National Weather Service)
 * API for US locations. Returns an empty array for non-US locations
 * or on failure (NWS only covers the US).
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Array>} Array of alert feature objects from the NWS API.
 */
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

// =============================================================================
//  SECTION: Render Functions
//  Builds and injects HTML into the DOM for each section of the weather view.
// =============================================================================

/**
 * Generates a natural-language weather summary sentence describing current
 * conditions, rain/snow outlook, and tomorrow's forecast.
 *
 * The summary is built in two parts:
 * 1. Opening sentence: current temperature + condition + precipitation info
 *    - Temperature descriptors adapt to imperial/metric thresholds
 *    - "Feels like" is appended if significantly different (>= 5 degrees)
 *    - If currently raining: mentions expected amount and clearing time
 *    - If rain is expected soon: mentions the approximate start time
 *    - Otherwise: describes sky conditions (clear, cloudy)
 * 2. Follow-up sentences: today's high, tomorrow's notable conditions
 *    - Mentions snow/rain expected tomorrow with amounts
 *    - Notes significant temperature changes (>= 8 degrees)
 *
 * @param {Object} current - Open-Meteo current conditions data.
 * @param {Object} hourly - Open-Meteo hourly forecast data.
 * @param {Object} daily - Open-Meteo daily forecast data.
 * @returns {string} A 1-3 sentence weather summary.
 */
function generateSummary(current, hourly, daily) {
    const now = new Date();
    const currentTemp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const info = weatherInfo(current.weather_code);

    // Scan next 24 hours of hourly data for precipitation probability
    const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
    let rainStartHour = null;  // Time when precip probability first hits >= 40%
    let rainEndHour = null;    // Time when precip probability drops below 30%
    let currentlyRaining = current.weather_code >= 51 && current.weather_code <= 99;

    if (startIdx !== -1) {
        for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
            const prob = hourly.precipitation_probability[i];
            if (!rainStartHour && prob >= 40) {
                rainStartHour = new Date(hourly.time[i]);
            }
            if (rainStartHour && !rainEndHour && prob < 30) {
                rainEndHour = new Date(hourly.time[i]);
            }
        }
    }

    // Today's and tomorrow's key stats
    const todayHigh = Math.round(daily.temperature_2m_max[0]);
    const todayLow = Math.round(daily.temperature_2m_min[0]);
    const todayPrecip = daily.precipitation_sum[0];
    const tomorrowInfo = daily.time.length > 1 ? weatherInfo(daily.weather_code[1]) : null;
    const tomorrowHigh = daily.time.length > 1 ? Math.round(daily.temperature_2m_max[1]) : null;
    const tomorrowPrecip = daily.time.length > 1 ? daily.precipitation_sum[1] : 0;
    const tomorrowCode = daily.time.length > 1 ? daily.weather_code[1] : 0;

    // Temperature descriptor thresholds (adapted for F or C)
    const freezing = isImperial() ? 32 : 0;
    const cold = isImperial() ? 50 : 10;
    const cool = isImperial() ? 65 : 18;
    const warm = isImperial() ? 80 : 27;
    const hot = isImperial() ? 95 : 35;

    // Build the opening temperature descriptor
    let opening;
    if (currentTemp <= freezing) opening = `It's freezing at ${currentTemp}${tempUnit()}`;
    else if (currentTemp <= cold) opening = `It's cold at ${currentTemp}${tempUnit()}`;
    else if (currentTemp <= cool) opening = `It's cool at ${currentTemp}${tempUnit()}`;
    else if (currentTemp <= warm) opening = `It's ${currentTemp}${tempUnit()}`;
    else if (currentTemp <= hot) opening = `It's warm at ${currentTemp}${tempUnit()}`;
    else opening = `It's hot at ${currentTemp}${tempUnit()}`;

    // Add feels-like if significantly different
    if (Math.abs(feelsLike - currentTemp) >= 5) {
        opening += ` (feels like ${feelsLike}${tempUnit()})`;
    }

    // Helper to check if a weather code indicates snow
    const isSnow = (code) => code >= 71 && code <= 77 || code === 85 || code === 86;

    // Append current weather condition and precipitation outlook
    if (currentlyRaining) {
        const code = current.weather_code;
        if (code >= 95) opening += ' with thunderstorms';
        else if (isSnow(code)) opening += ' and snowing';
        else opening += ' and raining';
        if (todayPrecip > 0) opening += ` (${fmtPrecip(todayPrecip)} expected today)`;
        if (rainEndHour) opening += `, clearing around ${fmtHour(rainEndHour)}`;
    } else if (rainStartHour) {
        const hoursUntil = (rainStartHour - now) / (1000 * 60 * 60);
        if (hoursUntil <= 1) opening += ' with rain expected very soon';
        else opening += ` with rain likely around ${fmtHour(rainStartHour)}`;
    } else {
        // No precipitation -- describe sky conditions
        if (info.text.toLowerCase().includes('clear') || info.text.toLowerCase().includes('sunny')) {
            opening += ' with clear skies';
        } else if (info.text.toLowerCase().includes('cloud') || info.text.toLowerCase().includes('overcast')) {
            opening += ' and cloudy';
        }
    }

    // Build follow-up sentences about today's high and tomorrow
    let follow = [];
    follow.push(`High of ${todayHigh}${tempUnit()} today`);

    if (tomorrowInfo && tomorrowHigh !== null) {
        const tomorrowRain = tomorrowCode >= 51 && tomorrowCode <= 99;
        const tomorrowSnow = isSnow(tomorrowCode);
        if (tomorrowSnow && tomorrowPrecip > 0) {
            follow.push(`Snow expected tomorrow (${fmtPrecip(tomorrowPrecip)})`);
        } else if (tomorrowRain && tomorrowPrecip > 0) {
            follow.push(`Rain expected tomorrow (${fmtPrecip(tomorrowPrecip)})`);
        } else if (tomorrowRain) {
            follow.push(`Rain expected tomorrow`);
        } else if (tomorrowHigh - todayHigh >= 8) {
            follow.push(`warming up to ${tomorrowHigh}${tempUnit()} tomorrow`);
        } else if (todayHigh - tomorrowHigh >= 8) {
            follow.push(`cooling to ${tomorrowHigh}${tempUnit()} tomorrow`);
        }
    }

    return opening + '. ' + follow.join('. ') + '.';
}

/**
 * Formats a Date object as a short hour string for the summary
 * (e.g. "3pm" or "15:00" depending on time format preference).
 * @param {Date} date - The date whose hour to format.
 * @returns {string} Formatted hour string.
 */
function fmtHour(date) {
    if (units.time24h) {
        return date.getHours().toString().padStart(2, '0') + ':00';
    }
    const h = date.getHours();
    if (h === 0) return '12am';
    if (h < 12) return h + 'am';
    if (h === 12) return '12pm';
    return (h - 12) + 'pm';
}

/**
 * Renders the Current Conditions section with temperature, weather icon,
 * humidity, dew point, wind, gusts, air quality (if available), and UV index.
 * @param {Object} current - Open-Meteo current conditions data.
 * @param {Object|null} airQuality - Air quality data or null.
 */
function renderCurrent(current, airQuality) {
    const info = weatherInfo(current.weather_code);
    const section = document.getElementById('current-section');
    const uvVal = Math.round(current.uv_index);
    const aqi = airQuality ? airQuality.us_aqi : null;
    const aqiInfo = aqi !== null ? aqiLabel(aqi) : null;

    section.innerHTML = `
        <h2>Current Conditions</h2>
        <div class="current-main">
            <div class="current-icon-block">
                <div class="icon">${info.icon}</div>
                <div class="condition">${info.text}</div>
            </div>
            <div class="current-temp-block">
                <div class="temp">${Math.round(current.temperature_2m)}${tempUnit()}</div>
                <div class="feels-like">Feels like ${Math.round(current.apparent_temperature)}${tempUnit()}</div>
            </div>
        </div>
        <div class="current-details-grid">
            <div class="detail-item">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">${current.relative_humidity_2m}%</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dew Point</span>
                <span class="detail-value">${Math.round(current.dew_point_2m)}${tempUnit()}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wind</span>
                <span class="detail-value">${Math.round(current.wind_speed_10m)} ${windUnit()} ${windDirection(current.wind_direction_10m)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Gusts</span>
                <span class="detail-value">${Math.round(current.wind_gusts_10m)} ${windUnit()}</span>
            </div>
            ${aqiInfo ? `
            <div class="detail-item">
                <span class="detail-label">Air Quality</span>
                <span class="detail-value" style="color:${aqiInfo.color};">${aqi} (${aqiInfo.text})</span>
            </div>` : ''}
            <div class="detail-item">
                <span class="detail-label">UV Index</span>
                <span class="detail-value">${uvVal} ${uvVal <= 2 ? '(Low)' : uvVal <= 5 ? '(Moderate)' : uvVal <= 7 ? '(High)' : uvVal <= 10 ? '(Very High)' : '(Extreme)'}</span>
            </div>
        </div>
    `;
}

/**
 * URL of the Cloud Run proxy for the Google Pollen API.
 * The proxy is needed because the Google Pollen API requires an API key
 * that should not be exposed in client-side code.
 * @type {string}
 */
const POLLEN_PROXY_URL = 'https://pollen-proxy-15838356607.us-central1.run.app';

/**
 * Renders the Pollen (details) section. Strategy:
 *
 * 1. If Open-Meteo returned pollen data (European locations), displays it
 *    directly with a horizontally scrollable row of pollen type cards.
 * 2. For non-European locations, checks localStorage cache first:
 *    - If cached data exists for today's date and approximate location,
 *      auto-displays it immediately.
 *    - Otherwise, shows a "See pollen data" button that triggers a fetch
 *      from the Google Pollen API proxy on click.
 *
 * Cache key format: pollen_{lat.toFixed(2)}_{lon.toFixed(2)}_{YYYY-MM-DD}
 *
 * @param {Object|null} airQuality - Air quality data from Open-Meteo.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 */
function renderPollen(airQuality, lat, lon) {
    const section = document.getElementById('details-section');
    const openMeteoPollen = pollenSummary(airQuality);
    const hasFreePollen = openMeteoPollen && openMeteoPollen.length > 0;

    if (hasFreePollen) {
        // European locations -- show Open-Meteo pollen directly
        section.innerHTML = `
            <h2>Pollen</h2>
            <div class="pollen-scroll">
                ${openMeteoPollen.map(p => `
                    <div class="pollen-item">
                        <div class="detail-label">${p.name}</div>
                        <div class="detail-value" style="color:${p.color};">${p.level}</div>
                    </div>`).join('')}
            </div>
        `;
        initDragScroll(section.querySelector('.pollen-scroll'));
    } else {
        // Non-European -- check localStorage cache for today's data
        const cacheKey = `pollen_${lat.toFixed(2)}_${lon.toFixed(2)}_${new Date().toISOString().slice(0, 10)}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
            // Auto-show cached data without requiring a button click
            section.innerHTML = `
                <h2>Pollen <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})</span></h2>
                <div id="pollen-content"></div>
            `;
            displayPollenData(JSON.parse(cached));
        } else {
            // Show a button to trigger the API fetch
            section.innerHTML = `
                <h2>Pollen</h2>
                <div id="pollen-content">
                    <button id="pollen-btn" class="pollen-btn">See pollen data</button>
                </div>
            `;
            document.getElementById('pollen-btn').addEventListener('click', () => {
                loadPollenData(lat, lon);
            });
        }
    }
}

/**
 * Displays pollen data from the Google Pollen API in the pollen content area.
 * Extracts pollen type info (Tree, Grass, Weed) and individual plant info,
 * then renders each as a card with name, category label, color, and index value.
 * @param {Object} data - Google Pollen API response data.
 */
function displayPollenData(data) {
    const content = document.getElementById('pollen-content');
    const section = document.getElementById('details-section');

    if (!data || data.error || !data.dailyInfo || data.dailyInfo.length === 0) {
        content.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">Pollen data unavailable for this location</span>';
        return;
    }

    const day = data.dailyInfo[0];
    const types = day.pollenTypeInfo || [];   // Broad categories (Tree, Grass, Weed)
    const plants = day.plantInfo || [];       // Individual plants (Oak, Birch, etc.)

    // Build a unified list of pollen items from both types and plants
    let items = [];
    for (const t of types) {
        const idx = t.indexInfo;
        if (!idx) continue;
        items.push({ name: t.displayName, category: idx.category || 'None', value: idx.value });
    }
    for (const p of plants) {
        const idx = p.indexInfo;
        if (!idx || idx.value === 0) continue; // Skip plants with zero index
        items.push({ name: p.displayName, category: idx.category, value: idx.value });
    }

    if (items.length === 0) {
        content.innerHTML = '<span style="color:var(--text-muted);font-size:0.85rem;">No significant pollen detected</span>';
        return;
    }

    // Update the section header with today's date
    const h2 = section.querySelector('h2');
    if (h2) {
        h2.innerHTML = `Pollen <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })})</span>`;
    }

    // Add 'pollen-few' class when 3 or fewer items for layout adjustment
    const fewClass = items.length <= 3 ? ' pollen-few' : '';
    content.innerHTML = `
        <div class="pollen-scroll${fewClass}">
            ${items.map(p => `
                <div class="pollen-item">
                    <div class="detail-label">${p.name}</div>
                    <div class="detail-value" style="color:${pollenIndexColor(p.value)};">${p.category}</div>
                    <div style="font-size:0.7rem;color:var(--text-muted);">${p.value}/5</div>
                </div>`).join('')}
        </div>
    `;
    initDragScroll(content.querySelector('.pollen-scroll'));
}

/**
 * Fetches pollen data from the Google Pollen API via the Cloud Run proxy.
 * Caches the result in localStorage keyed by approximate lat/lon and date.
 * Shows a loading state on the button and retries on failure.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 */
async function loadPollenData(lat, lon) {
    const btn = document.getElementById('pollen-btn');
    btn.textContent = 'Loading...';
    btn.disabled = true;

    // Cache key includes lat/lon (rounded to 2 decimals) and today's date
    const cacheKey = `pollen_${lat.toFixed(2)}_${lon.toFixed(2)}_${new Date().toISOString().slice(0, 10)}`;

    try {
        const res = await fetch(`${POLLEN_PROXY_URL}?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        displayPollenData(data);
    } catch (e) {
        // On failure, show a retry button
        const content = document.getElementById('pollen-content');
        content.innerHTML = '<button id="pollen-btn" class="pollen-btn">Retry</button>';
        document.getElementById('pollen-btn').addEventListener('click', () => loadPollenData(lat, lon));
    }
}

/**
 * Maps a Google Pollen API index value (0-5 scale) to a display color.
 * @param {number} value - Pollen index value (0-5).
 * @returns {string} Hex color string.
 */
function pollenIndexColor(value) {
    if (value <= 1) return '#16a34a';  // Low - green
    if (value <= 2) return '#84cc16';  // Low-Medium - lime
    if (value <= 3) return '#ca8a04';  // Medium - yellow
    if (value <= 4) return '#ea580c';  // High - orange
    return '#dc2626';                   // Very High - red
}

/**
 * Renders the Hourly Forecast section with a horizontally scrollable row
 * of hour cards showing time, weather icon, and temperature.
 * Shows the next 24 hours starting from the current hour.
 * @param {Object} hourly - Open-Meteo hourly forecast data.
 */
function renderHourly(hourly) {
    const section = document.getElementById('hourly-section');
    const now = new Date();
    // Find the first hourly time slot at or after the current time
    const startIdx = hourly.time.findIndex(t => new Date(t) >= now);
    if (startIdx === -1) { section.innerHTML = ''; return; }

    let html = '<h2>Hourly Forecast</h2><div class="hourly-scroll">';
    for (let i = startIdx; i < startIdx + 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const label = units.time24h
            ? hour.toString().padStart(2, '0') + ':00'
            : (hour === 0 ? '12am' : hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`);
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

// =============================================================================
//  SECTION: 10-Day Forecast
//  Renders the multi-day forecast with a unified horizontally scrollable
//  container. Each day gets a fixed-width column (DAY_WIDTH px). Below the
//  day headers, chart rows display temperature, atmospheric, precipitation,
//  and wind data on HTML5 canvas elements with sticky axis labels.
// =============================================================================

/**
 * Width in pixels for each day column in the forecast scroll view.
 * Shared between the day header, chart canvases, and footer.
 * @type {number}
 */
const DAY_WIDTH = 100;

/**
 * Renders the entire 10-Day Forecast section including:
 * 1. Day column headers with date, icon, high/low temps, condition,
 *    precipitation amount, and temperature-based background colors.
 * 2. Four chart rows (Temperature, Atmospheric, Precipitation, Wind),
 *    each with a drag handle, legend, hide button, canvas, and
 *    sticky left/right axis labels.
 * 3. A footer row repeating the day labels for reference when scrolled.
 *
 * After rendering HTML, triggers canvas drawing via drawAllCharts()
 * on the next animation frame, and initializes drag-to-scroll.
 *
 * @param {Object} daily - Open-Meteo daily forecast data.
 * @param {Object} hourly - Open-Meteo hourly forecast data (used for charts).
 */
function renderDaily(daily, hourly) {
    const section = document.getElementById('daily-section');
    const days = daily.time.length;
    const innerW = days * DAY_WIDTH; // Total width of chart canvases

    // Pre-compute chart data ranges for consistent scaling
    const totalHours = Math.min(days * 24, hourly.time.length);
    const chartRanges = computeChartRanges(hourly, totalHours);

    // --- Compute temperature-based background color per day ---
    const avgTemps = daily.time.map((_, i) =>
        (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2
    );
    // Store globally so theme toggle can recompute colors
    window._forecastAvgTemps = avgTemps;
    const tempRange = Math.max(...avgTemps) - Math.min(...avgTemps);
    const showTempColors = tempRange >= TEMP_COLOR_THRESHOLD;

    // --- Build day column header HTML (inside the scroll container) ---
    let dayHeaderHtml = '';
    for (let i = 0; i < days; i++) {
        const date = new Date(daily.time[i] + 'T00:00:00');
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateLabel = date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        const info = weatherInfo(daily.weather_code[i]);
        const precip = daily.precipitation_sum[i];
        const minA = Math.min(...avgTemps);
        const rangeA = (Math.max(...avgTemps) - minA) || 1;
        const bg = tempBackground(avgTemps[i], minA, rangeA);
        dayHeaderHtml += `
            <div class="forecast-day" style="width:${DAY_WIDTH}px;min-width:${DAY_WIDTH}px;background:${bg};">
                <div class="forecast-date">${dayLabel} ${dateLabel}</div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(daily.temperature_2m_max[i])}°</span>
                    <span class="temp-low">${Math.round(daily.temperature_2m_min[i])}°</span>
                </div>
                <div class="forecast-icon">${info.icon}</div>
                <div class="forecast-condition">${info.text}</div>
                <div class="forecast-precip">${precip > 0 ? '💧 ' + fmtPrecip(precip) : ''}</div>
            </div>
        `;
    }

    /**
     * Generates the HTML for a single chart row containing:
     * - A legend bar with drag handle, colored legend items, and hide button
     * - A chart-row-inner div with sticky left axis, canvas, and sticky right axis
     * @param {string} id - Canvas element ID (e.g. 'chart-temp').
     * @param {number} height - Canvas height in pixels.
     * @param {string} legendHtml - HTML for the legend entries.
     * @param {string} leftLabels - HTML for the left axis label spans.
     * @param {string} rightLabels - HTML for the right axis label spans.
     * @returns {string} Complete HTML string for the chart row.
     */
    function chartRow(id, height, legendHtml, leftLabels, rightLabels) {
        return `
            <div class="chart-row" data-chart-id="${id}">
                <div class="chart-legend"><span class="chart-drag-handle" title="Drag to reorder">⠿</span>${legendHtml}<button class="chart-min-btn" data-chart-id="${id}" title="Hide chart">✕</button></div>
                <div class="chart-row-inner">
                    <div class="chart-axis chart-axis-left">${leftLabels}</div>
                    <canvas id="${id}" width="${innerW}" height="${height}" style="display:block;width:${innerW}px;height:${height}px;"></canvas>
                    <div class="chart-axis chart-axis-right">${rightLabels}</div>
                </div>
            </div>
        `;
    }

    /**
     * Generates HTML for axis labels (evenly spaced from max to min, top to bottom).
     * @param {number} min - Minimum axis value.
     * @param {number} max - Maximum axis value.
     * @param {number} steps - Number of intervals (labels = steps + 1).
     * @param {string} suffix - Unit suffix (e.g. '°', '%', '').
     * @param {string} color - CSS color for the labels.
     * @returns {string} HTML string of <span> elements.
     */
    function makeLabels(min, max, steps, suffix, color) {
        let html = '';
        // Iterate from top (max) to bottom (min)
        for (let i = steps; i >= 0; i--) {
            const val = min + ((max - min) / steps) * i;
            const label = Number.isInteger(val) ? val : val.toFixed(1);
            html += `<span style="color:${color}">${label}${suffix}</span>`;
        }
        return html;
    }

    const r = chartRanges;

    // Legend HTML strings for each chart type
    const tempLegend = `<span><span style="color:#dc2626;">■</span> Temperature (${tempUnit()})</span><span><span style="color:#9333ea;">■</span> Feels Like (${tempUnit()})</span><span><span style="color:#16a34a;">■</span> Dew Point (${tempUnit()})</span>`;
    const atmosLegend = '<span><span style="color:#9ca3af;">■</span> Cloud Cover (%)</span><span><span style="color:#3b82f6;">■</span> Precip Chance (%)</span><span><span style="color:#84cc16;">■</span> Humidity (%)</span><span><span style="color:#1a1a1a;">■</span> Pressure (inHg)</span>';
    const precipLegend = `<span><span style="color:#3b82f6;">■</span> Precip Accum. (${isImperial() ? 'in' : 'mm'})</span><span><span style="color:#16a34a;">■</span> Hourly Precip (${isImperial() ? 'in' : 'mm'})</span>`;
    const windLegend = `<span><span style="color:#2563eb;">■</span> Wind Speed (${windUnit()})</span>`;

    // Axis width must match the CSS .chart-axis width
    const AXIS_W = 40;
    const totalScrollW = innerW + AXIS_W * 2;

    // Build the complete section HTML
    section.innerHTML = `
        <h2>10-Day Forecast ${showTempColors ? '<span style="text-transform:none;font-weight:400;font-size:0.7rem;color:var(--text-muted);">— colors show relative temps: red = warmest, blue = coolest</span>' : ''}</h2>
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
                    makeLabels(0, r.precip.maxAccum, 3, precipUnit(), '#3b82f6'),
                    makeLabels(0, r.precip.maxAccum, 3, precipUnit(), '#3b82f6'))}
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

    // Draw canvas charts on the next animation frame (after DOM is ready)
    requestAnimationFrame(() => drawAllCharts(hourly, totalHours, chartRanges));

    // Enable drag-to-scroll on the forecast scroll container
    initDragScroll(document.querySelector('.forecast-scroll-outer'));
}

/**
 * Initializes mouse and touch drag-to-scroll on a horizontally scrollable element.
 * Changes cursor to 'grab'/'grabbing' during interaction.
 * @param {HTMLElement|null} el - The scrollable element to attach drag scrolling to.
 */
function initDragScroll(el) {
    if (!el) return;
    let isDown = false;
    let startX, scrollLeft;

    el.style.cursor = 'grab';

    // Mouse drag
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

    // Touch drag (mobile support)
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

// =============================================================================
//  SECTION: Chart System
//  Computes data ranges and draws line/area/bar charts on HTML5 canvas
//  elements within the 10-day forecast section.
// =============================================================================

/**
 * Pre-computes min/max ranges for all chart types so that axes can be
 * labeled and data can be scaled consistently across the entire forecast period.
 * @param {Object} hourly - Open-Meteo hourly data.
 * @param {number} hours - Total number of hours to include.
 * @returns {Object} Ranges object with:
 *   - temp: {min, max} for temperature/feels-like/dew-point (padded +/- 5)
 *   - precip: {maxAccum, maxHourly} for precipitation charts
 *   - wind: {max} for wind speed (minimum 5 to avoid tiny scales)
 */
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

/**
 * Gets the 2D rendering context and dimensions for a chart canvas by ID.
 * @param {string} id - Canvas element ID.
 * @returns {{ctx: CanvasRenderingContext2D, w: number, h: number}|null}
 */
function getChartContext(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    return { ctx: canvas.getContext('2d'), w: canvas.width, h: canvas.height };
}

/**
 * Draws a line chart on a canvas context by connecting data points.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number[]} data - Array of data values.
 * @param {number} count - Number of data points to draw.
 * @param {string} color - Stroke color (CSS color string).
 * @param {number} minVal - Minimum axis value.
 * @param {number} maxVal - Maximum axis value.
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 * @param {number} pad - Vertical padding in pixels from top and bottom.
 */
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

/**
 * Draws a filled area chart on a canvas context (from data line down to baseline).
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number[]} data - Array of data values.
 * @param {number} count - Number of data points.
 * @param {string} color - Fill color (CSS color string).
 * @param {number} alpha - Fill opacity (0-1).
 * @param {number} minVal - Minimum axis value.
 * @param {number} maxVal - Maximum axis value.
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 * @param {number} pad - Vertical padding in pixels.
 */
function drawArea(ctx, data, count, color, alpha, minVal, maxVal, w, h, pad) {
    const drawH = h - pad * 2;
    const range = maxVal - minVal || 1;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, h - pad); // Start at bottom-left
    for (let i = 0; i < count; i++) {
        const x = (i / (count - 1)) * w;
        const y = pad + drawH - ((data[i] - minVal) / range) * drawH;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h - pad); // Close path at bottom-right
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1; // Reset opacity
}

/**
 * Returns whether the current theme is dark mode.
 * Checks the data-theme attribute on the document root element.
 * @returns {boolean}
 */
function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

/**
 * Draws vertical day divider lines on a chart canvas.
 * Lines are placed every 24 data points (once per day boundary).
 * Uses different colors for dark and light mode.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {number} count - Total number of data points (hours).
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 */
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

/**
 * Draws a dashed vertical "now" line on a chart canvas indicating
 * the current time position within the forecast data.
 * @param {CanvasRenderingContext2D} ctx - Canvas context.
 * @param {Object} hourly - Open-Meteo hourly data (needs .time array).
 * @param {number} count - Total number of data points.
 * @param {number} w - Canvas width in pixels.
 * @param {number} h - Canvas height in pixels.
 */
function drawNowLine(ctx, hourly, count, w, h) {
    const now = new Date();
    const startTime = new Date(hourly.time[0]);
    const hoursElapsed = (now - startTime) / (1000 * 60 * 60);
    if (hoursElapsed < 0 || hoursElapsed > count) return; // "Now" is outside chart range
    const x = (hoursElapsed / (count - 1)) * w;
    ctx.strokeStyle = isDarkMode() ? '#9ca3af' : '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]); // Dashed line pattern
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid
}

/**
 * Draws all four forecast chart canvases:
 *
 * 1. Temperature chart (chart-temp, 160px height):
 *    - Line: actual temperature (red), feels-like (purple), dew point (green)
 *    - Day dividers and "now" line
 *
 * 2. Atmospheric chart (chart-atmos, 160px height):
 *    - Filled area: cloud cover (gray), precipitation probability (blue)
 *    - Line: humidity (lime), cloud cover (gray), precip probability (blue)
 *    - Pressure line (black) with its own min/max range
 *
 * 3. Precipitation chart (chart-precip, 100px height):
 *    - Green bars: hourly precipitation amounts
 *    - Blue line: cumulative precipitation accumulation
 *
 * 4. Wind chart (chart-wind, 100px height):
 *    - Blue area + line: wind speed
 *    - Directional arrow markers every 6 hours (rotated triangles)
 *    - Arrow rotation: wind direction + 180 degrees (shows where wind blows TO)
 *
 * @param {Object} hourly - Open-Meteo hourly forecast data.
 * @param {number} hours - Total number of hours to chart.
 * @param {Object} r - Pre-computed chart ranges from computeChartRanges().
 */
function drawAllCharts(hourly, hours, r) {
    // --- Temperature chart ---
    const c1 = getChartContext('chart-temp');
    if (c1) {
        const { ctx, w, h } = c1;
        const pad = 10;
        const temp = hourly.temperature_2m.slice(0, hours);
        const feels = hourly.apparent_temperature.slice(0, hours);
        const dew = hourly.dew_point_2m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        // Draw order: dew (bottom), feels-like (middle), actual temp (top)
        drawLine(ctx, dew, hours, '#16a34a', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, feels, hours, '#9333ea', r.temp.min, r.temp.max, w, h, pad);
        drawLine(ctx, temp, hours, '#dc2626', r.temp.min, r.temp.max, w, h, pad);
    }

    // --- Atmospheric chart ---
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
        // Filled areas first (underneath the lines)
        drawArea(ctx, cloud, hours, '#9ca3af', 0.3, 0, 100, w, h, pad);
        drawArea(ctx, precipChance, hours, '#3b82f6', 0.3, 0, 100, w, h, pad);
        // Lines on top
        drawLine(ctx, humidity, hours, '#84cc16', 0, 100, w, h, pad);
        drawLine(ctx, cloud, hours, '#9ca3af', 0, 100, w, h, pad);
        drawLine(ctx, precipChance, hours, '#3b82f6', 0, 100, w, h, pad);
        // Pressure uses its own tight min/max range (not 0-100)
        const pMin = Math.min(...pressure) - 0.1;
        const pMax = Math.max(...pressure) + 0.1;
        drawLine(ctx, pressure, hours, '#1a1a1a', pMin, pMax, w, h, pad);
    }

    // --- Precipitation chart ---
    const c3 = getChartContext('chart-precip');
    if (c3) {
        const { ctx, w, h } = c3;
        const pad = 8;
        const precip = hourly.precipitation.slice(0, hours);
        // Build cumulative accumulation array
        const accum = [];
        let total = 0;
        for (let i = 0; i < hours; i++) { total += precip[i] || 0; accum.push(total); }
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        // Draw green bars for hourly precipitation amounts
        const barW = w / hours;
        ctx.fillStyle = '#16a34a';
        for (let i = 0; i < hours; i++) {
            if (precip[i] > 0) {
                // Bar height is proportional to hourly max, capped at 40% of chart height
                const barH = (precip[i] / r.precip.maxHourly) * (h - pad * 2) * 0.4;
                const x = (i / (hours - 1)) * w;
                ctx.fillRect(x - barW / 2, h - pad - barH, barW, barH);
            }
        }
        // Blue line for cumulative accumulation
        drawLine(ctx, accum, hours, '#3b82f6', 0, r.precip.maxAccum, w, h, pad);
    }

    // --- Wind chart ---
    const c4 = getChartContext('chart-wind');
    if (c4) {
        const { ctx, w, h } = c4;
        const pad = 8;
        const wind = hourly.wind_speed_10m.slice(0, hours);
        const dirs = hourly.wind_direction_10m.slice(0, hours);
        drawDayDividers(ctx, hours, w, h);
        drawNowLine(ctx, hourly, hours, w, h);
        // Blue filled area and line for wind speed
        drawArea(ctx, wind, hours, '#2563eb', 0.15, 0, r.wind.max, w, h, pad);
        drawLine(ctx, wind, hours, '#2563eb', 0, r.wind.max, w, h, pad);
        // Wind direction arrows every 6 hours
        ctx.fillStyle = '#2563eb';
        for (let i = 0; i < hours; i += 6) {
            const x = (i / (hours - 1)) * w;
            // Position arrow just above the wind speed line
            const y = pad + (h - pad * 2) - (wind[i] / r.wind.max) * (h - pad * 2) - 12;
            // Arrow points in the direction wind blows TO (add 180 to meteorological direction)
            const angle = (dirs[i] + 180) * Math.PI / 180;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            // Draw a small triangle arrow
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

// =============================================================================
//  SECTION: Alerts
//  Renders NWS weather alerts (US-only).
// =============================================================================

/**
 * Renders the weather alerts section. Hides the section if no alerts exist.
 * @param {Array} alerts - Array of NWS alert feature objects.
 */
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

// =============================================================================
//  SECTION: Radar
//  Renders an animated radar map using RainViewer tile data overlaid on
//  CartoDB base map tiles. Uses a 5x5 tile grid centered on the location
//  with precise sub-tile centering for accurate city placement.
// =============================================================================

/** Interval ID for the radar frame animation loop. */
let radarInterval = null;

/**
 * Renders the radar section and kicks off radar tile loading.
 * Clears any existing animation interval before re-rendering.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 */
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

/**
 * Loads radar data from the RainViewer API and builds the animated radar display.
 *
 * Tile centering algorithm:
 * 1. Computes the exact fractional tile position (exactX, exactY) for the
 *    given lat/lon at zoom level 7.
 * 2. Determines the integer center tile (centerTileX, centerTileY).
 * 3. Calculates the fractional position within the center tile (fracX, fracY).
 * 4. Builds a 5x5 grid of tiles centered on the center tile (offsets -2 to +2).
 * 5. Computes CSS offsets so the exact city position (at tile fraction within
 *    the center tile, which is at grid index 2) aligns with the 50% center
 *    of the container: offset = 50% - (2 + frac) / 5 * 500%.
 *
 * Map layers:
 * - Base: CartoDB tiles (dark_all for dark mode, rastertiles/voyager for light)
 *   at 70% opacity
 * - Radar: One div per RainViewer frame (past observations), all hidden except
 *   the latest. Animated by cycling opacity on a 500ms interval.
 * - Marker: Blue circle at the exact center (50%, 50%) of the container.
 *
 * Tile error handling: Each <img> has an onerror handler that retries up to
 * 3 times with exponential backoff, then hides the tile.
 *
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 */
async function loadRadar(lat, lon) {
    try {
        const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await res.json();
        const frames = data.radar.past;

        const container = document.getElementById('radar-container');
        const zoom = 7;
        const n = Math.pow(2, zoom); // Total tiles at this zoom level (128)

        // Exact fractional tile position for the city
        const exactX = (lon + 180) / 360 * n;
        const exactY = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n;

        // Integer center tile coordinates
        const centerTileX = Math.floor(exactX);
        const centerTileY = Math.floor(exactY);

        // Sub-tile fraction (0-1) -- position within the center tile
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

        /**
         * Builds HTML for a 5x5 grid of map/radar tiles.
         * @param {Function} tileSrcFn - Function(tileX, tileY) returning the tile URL.
         * @param {string} [extraStyle] - Additional inline CSS for the grid container.
         * @returns {string} HTML string for the tile grid.
         */
        function buildTileGrid(tileSrcFn, extraStyle) {
            let html = `<div style="position:absolute;left:${offsetX}%;top:${offsetY}%;width:${gridSize * 100}%;height:${gridSize * 100}%;display:grid;grid-template-columns:repeat(${gridSize},1fr);${extraStyle || ''}">`;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    html += `<img src="${tileSrcFn(centerTileX + dx, centerTileY + dy)}" alt="" style="width:100%;height:100%;display:block;" data-retries="0" onerror="if(this.dataset.retries<3){this.dataset.retries++;setTimeout(()=>{this.src=this.src+'&r='+this.dataset.retries},1000*this.dataset.retries)}else{this.style.visibility='hidden'}">`;
                }
            }
            return html + '</div>';
        }

        // Map base layer (CartoDB tiles, theme-aware)
        const mapHtml = buildTileGrid(
            (tx, ty) => {
                const style = isDarkMode() ? 'dark_all' : 'rastertiles/voyager';
                return `https://a.basemaps.cartocdn.com/${style}/${zoom}/${tx}/${ty}@2x.png`;
            },
            'opacity:0.7;'
        );

        // Radar layers -- one grid per RainViewer frame, all hidden except the latest
        let radarHtml = '';
        frames.forEach((frame, i) => {
            radarHtml += buildTileGrid(
                (tx, ty) => `https://tilecache.rainviewer.com${frame.path}/256/${zoom}/${tx}/${ty}/2/1_0.png`,
                `opacity:${i === frames.length - 1 ? 1 : 0};transition:opacity 0.3s;`
            ).replace('<div ', `<div class="radar-frame" data-frame="${i}" `);
        });

        // City center marker -- blue circle with white shadow
        const markerHtml = `
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10;pointer-events:none;">
                <div style="width:12px;height:12px;border:2px solid #2563eb;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,0.8);"></div>
            </div>`;

        container.innerHTML = mapHtml + radarHtml + markerHtml;

        // Show timestamp for the latest frame
        const timeEl = document.getElementById('radar-time');
        const showFrameTime = (frame) => {
            const d = new Date(frame.time * 1000);
            timeEl.textContent = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        };
        showFrameTime(frames[frames.length - 1]);

        // Animate through radar frames (500ms per frame)
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

// =============================================================================
//  SECTION: Sun & Moon
//  Renders sunrise/sunset/solar noon and moonrise/moonset/phase data.
//  Moon calculations use astronomical algorithms from Jean Meeus.
// =============================================================================

/**
 * Renders both the Sun and Moon sections.
 * Sun data comes from Open-Meteo daily sunrise/sunset times.
 * Moon data is computed locally using astronomical algorithms.
 * @param {Object} daily - Open-Meteo daily data with sunrise/sunset arrays.
 * @param {number} lat - Latitude (for moon calculations).
 * @param {number} lon - Longitude (for moon calculations).
 */
function renderSunMoon(daily, lat, lon) {
    const fmtTime = fmtTimeUnit;

    /**
     * Formats a Date as a localized date string (e.g. "March 15").
     * @param {Date} d
     * @returns {string}
     */
    const fmtDate = (d) => {
        if (!d || isNaN(d)) return '';
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    };

    // --- Sun section ---
    const sunrise = new Date(daily.sunrise[0]);
    const sunset = new Date(daily.sunset[0]);
    // Solar noon is the midpoint between sunrise and sunset
    const solarNoon = new Date((sunrise.getTime() + sunset.getTime()) / 2);
    const sunDateLabel = fmtDate(sunrise);

    const sunSection = document.getElementById('sun-section');
    sunSection.innerHTML = `
        <h2>Sun <span style="text-transform:none;font-weight:400;font-size:0.85rem;color:var(--text-muted);">(${sunDateLabel})</span></h2>
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

    // --- Moon section ---
    const now = new Date();
    const moon = getMoonPhase(now);
    const moonTimes = getMoonTimes(now, lat, lon);

    const riseDate = moonTimes.rise ? fmtDate(moonTimes.rise) : '';
    const setDate = moonTimes.set ? fmtDate(moonTimes.set) : '';

    const moonSection = document.getElementById('moon-section');
    moonSection.innerHTML = `
        <h2>Moon</h2>
        <div class="astro-grid">
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌔</div>
                <div class="label">Moonrise</div>
                <div class="value">${fmtTime(moonTimes.rise)}</div>
                <div class="label">${riseDate}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">${moon.icon}</div>
                <div class="label">Phase</div>
                <div class="value">${moon.name}</div>
            </div>
            <div class="astro-item">
                <div style="font-size:1.5rem;">🌘</div>
                <div class="label">Moonset</div>
                <div class="value">${fmtTime(moonTimes.set)}</div>
                <div class="label">${setDate}</div>
            </div>
        </div>
    `;
}

// =============================================================================
//  SECTION: Moonrise/Moonset Calculation
//  Simplified algorithm based on Jean Meeus "Astronomical Algorithms".
//  Computes the moon's altitude at any given time using ecliptic coordinates,
//  then scans in 10-minute increments to find rise/set events (where the
//  altitude crosses -0.833 degrees, accounting for atmospheric refraction).
// =============================================================================

/**
 * Finds the first moonrise and first moonset for a given date and location.
 * First finds the moonrise from the start of the day, then searches for
 * the moonset starting from the rise time (or the given date if no rise).
 * @param {Date} date - The date to compute moon times for.
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @returns {{rise: Date|null, set: Date|null}} Moon event times or null if
 *   the moon doesn't rise/set during the search window (1440 minutes = 24h).
 */
function getMoonTimes(date, lat, lon) {
    const rise = findMoonEvent(date, lat, lon, 'rise', 1440);
    const searchStart = rise || date;
    const set = findMoonEvent(searchStart, lat, lon, 'set', 1440);
    return { rise, set };
}

/**
 * Scans for a moonrise or moonset event by stepping through time in 10-minute
 * increments and checking the moon's altitude. Detects the event as an altitude
 * crossing through -0.833 degrees (standard refraction correction for rise/set).
 *
 * Uses linear interpolation between the two time steps bracketing the crossing
 * to estimate the exact event time within the 10-minute window.
 *
 * @param {Date} date - Start time for the search.
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {string} type - 'rise' or 'set'.
 * @param {number} maxMinutes - Maximum search window in minutes (typically 1440 = 24h).
 * @returns {Date|null} The estimated event time, or null if not found in the window.
 */
function findMoonEvent(date, lat, lon, type, maxMinutes) {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // For moonset, start searching from the given time; for moonrise, start from midnight
    const startTime = (type === 'set' && date > startOfDay) ? date : startOfDay;

    let prevAlt = moonAltitude(startTime, lat, lon);

    for (let m = 10; m <= maxMinutes; m += 10) {
        const t = new Date(startTime.getTime() + m * 60000);
        const alt = moonAltitude(t, lat, lon);

        // Moonrise: altitude crosses from below -0.833 to above
        if (type === 'rise' && prevAlt < -0.833 && alt >= -0.833) {
            const frac = (0 - prevAlt) / (alt - prevAlt); // Linear interpolation fraction
            return new Date(startTime.getTime() + (m - 10 + frac * 10) * 60000);
        }
        // Moonset: altitude crosses from above -0.833 to below
        if (type === 'set' && prevAlt >= -0.833 && alt < -0.833) {
            const frac = (0 - prevAlt) / (alt - prevAlt);
            return new Date(startTime.getTime() + (m - 10 + frac * 10) * 60000);
        }
        prevAlt = alt;
    }
    return null; // Moon doesn't rise/set within the search window
}

/**
 * Computes the moon's altitude above the horizon in degrees for a given
 * date/time and observer location. This is the core astronomical calculation.
 *
 * Algorithm chain:
 * 1. Convert date to Julian Date (JD) via dateToJD().
 * 2. Compute Julian centuries (T) since J2000.0 epoch.
 * 3. Calculate simplified ecliptic coordinates of the Moon:
 *    - L0: Mean longitude of the Moon
 *    - M: Moon's mean anomaly
 *    - D: Mean elongation of the Moon from the Sun
 *    - F: Moon's argument of latitude
 *    - Lm: Corrected longitude (L0 + principal perturbation term)
 *    - Bm: Ecliptic latitude (simplified)
 * 4. Convert ecliptic (Lm, Bm) to equatorial (RA, Dec) using obliquity.
 * 5. Compute Greenwich Mean Sidereal Time (GMST) and Local Sidereal Time (LST).
 * 6. Calculate Hour Angle (HA = LST - RA).
 * 7. Compute altitude using the standard formula:
 *    sin(alt) = sin(lat)*sin(Dec) + cos(lat)*cos(Dec)*cos(HA)
 *
 * Note: This is a simplified calculation suitable for rise/set detection
 * (accuracy within a few minutes). Not suitable for precise astronomical work.
 *
 * @param {Date} date - UTC date/time for the calculation.
 * @param {number} lat - Observer latitude in degrees.
 * @param {number} lon - Observer longitude in degrees.
 * @returns {number} Moon altitude in degrees (negative = below horizon).
 */
function moonAltitude(date, lat, lon) {
    const RAD = Math.PI / 180;

    // Julian date
    const JD = dateToJD(date);
    // Julian centuries since J2000.0 (January 1, 2000, 12:00 TT)
    const T = (JD - 2451545.0) / 36525.0;

    // Moon ecliptic longitude (simplified Meeus formulas)
    const L0 = 218.3165 + 481267.8813 * T;      // Mean longitude
    const M = 134.9634 + 477198.8676 * T;        // Mean anomaly
    const D = 297.8502 + 445267.1115 * T;        // Mean elongation
    const F = 93.2720 + 483202.0175 * T;         // Argument of latitude

    // Corrected ecliptic longitude (only the principal perturbation term)
    const Lm = L0 + 6.289 * Math.sin(M * RAD);
    // Ecliptic latitude (simplified)
    const Bm = 5.128 * Math.sin(F * RAD);

    // Convert ecliptic to equatorial coordinates
    // Obliquity of the ecliptic (simplified, slowly decreasing over time)
    const obliq = 23.439 - 0.0000004 * (JD - 2451545.0);
    const cosObl = Math.cos(obliq * RAD);
    const sinObl = Math.sin(obliq * RAD);

    const lRad = Lm * RAD;
    const bRad = Bm * RAD;

    // Right Ascension (RA)
    const RA = Math.atan2(
        Math.sin(lRad) * cosObl - Math.tan(bRad) * sinObl,
        Math.cos(lRad)
    );
    // Declination (Dec)
    const Dec = Math.asin(
        Math.sin(bRad) * cosObl + Math.cos(bRad) * sinObl * Math.sin(lRad)
    );

    // Greenwich Mean Sidereal Time
    const GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0);
    // Local Sidereal Time (add observer longitude)
    const LST = (GMST + lon) * RAD;
    // Hour Angle
    const HA = LST - RA;

    // Altitude formula
    const sinAlt = Math.sin(lat * RAD) * Math.sin(Dec) +
                   Math.cos(lat * RAD) * Math.cos(Dec) * Math.cos(HA);

    return Math.asin(sinAlt) / RAD; // Convert from radians to degrees
}

/**
 * Converts a JavaScript Date object to a Julian Date number.
 * Uses the standard Meeus algorithm for Gregorian calendar dates.
 * Handles the fractional day from hours, minutes, and seconds (UTC).
 * @param {Date} date - Date to convert (UTC components are used).
 * @returns {number} Julian Date (e.g. 2451545.0 = January 1, 2000, 12:00 TT).
 */
function dateToJD(date) {
    const Y = date.getUTCFullYear();
    const M = date.getUTCMonth() + 1;
    // Day as a fractional number including time of day
    const D = date.getUTCDate() + date.getUTCHours() / 24 +
              date.getUTCMinutes() / 1440 + date.getUTCSeconds() / 86400;
    let y = Y, m = M;
    // January and February are treated as months 13 and 14 of the previous year
    if (m <= 2) { y--; m += 12; }
    // Gregorian calendar correction
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + D + B - 1524.5;
}

/**
 * Returns the day-of-year (1-366) for a given Date.
 * @param {Date} date
 * @returns {number} Day of year.
 */
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    return Math.floor((date - start) / 86400000);
}

// =============================================================================
//  SECTION: Orchestrator
//  Main data-fetching and rendering pipeline. Coordinates all API calls
//  and section rendering in the correct order.
// =============================================================================

/** Cached latitude from the last weather data fetch (for re-fetch on unit toggle). */
let _lastLat = null;
/** Cached longitude from the last weather data fetch. */
let _lastLon = null;

/**
 * Main orchestrator: fetches all weather data in parallel and renders
 * every section of the weather view. Called on initial search, unit toggle,
 * and time format toggle.
 *
 * Parallel API calls:
 * - Open-Meteo weather data (current + hourly + daily)
 * - NWS alerts (US only)
 * - Open-Meteo air quality (including European pollen)
 *
 * Render order:
 * 1. Summary sentence
 * 2. Current conditions
 * 3. Pollen / details
 * 4. Hourly forecast
 * 5. Daily forecast (with chart canvases)
 * 6. Weather alerts
 * 7. Radar
 * 8. Sun / Moon
 * 9. Section preferences (layout, hidden/minimized state, controls)
 *
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 */
async function fetchAllWeatherData(lat, lon) {
    _lastLat = lat;
    _lastLon = lon;
    // Reset all sections to loading/empty state
    document.getElementById('alerts-section').hidden = true;
    document.getElementById('weather-summary').textContent = '';
    document.getElementById('current-section').innerHTML = '<div class="loading">Loading...</div>';
    document.getElementById('details-section').innerHTML = '';
    document.getElementById('hourly-section').innerHTML = '';
    document.getElementById('daily-section').innerHTML = '';
    document.getElementById('radar-section').innerHTML = '';
    document.getElementById('sun-section').innerHTML = '';
    document.getElementById('moon-section').innerHTML = '';

    try {
        // Fetch all data sources in parallel
        const [meteo, alerts, airQuality] = await Promise.all([
            fetchOpenMeteo(lat, lon),
            fetchAlerts(lat, lon),
            fetchAirQuality(lat, lon),
        ]);

        // Render all sections
        document.getElementById('weather-summary').textContent =
            generateSummary(meteo.current, meteo.hourly, meteo.daily);
        renderCurrent(meteo.current, airQuality);
        renderPollen(airQuality, lat, lon);
        renderHourly(meteo.hourly);
        renderDaily(meteo.daily, meteo.hourly);
        renderAlerts(alerts);
        renderRadar(lat, lon);
        renderSunMoon(meteo.daily, lat, lon);
        // Apply user's section layout preferences (order, visibility, controls)
        applySectionPreferences();
    } catch (err) {
        document.getElementById('current-section').innerHTML =
            `<p class="error">Failed to load weather data. Please try again.</p>`;
    }
}

// =============================================================================
//  SECTION: Navigation & Event Listeners
//  Handles view transitions, search form submission, and toolbar button clicks.
// =============================================================================

/**
 * Shows the home/search view and hides the weather view.
 * Clears the search input and error message.
 */
function showHome() {
    weatherView.hidden = true;
    homeView.hidden = false;
    searchInput.value = '';
    searchError.hidden = true;
}

/**
 * Shows the weather view and hides the home/search view.
 * Sets the location name header, including the zip code in parentheses
 * if the query was a 5-digit US zip.
 * @param {Object} location - Geocoded location with .name and .region.
 * @param {string} query - The original search query string.
 */
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

// Search form submission handler
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    searchError.hidden = true;
    searchForm.querySelector('button').disabled = true;
    searchForm.querySelector('button').textContent = 'Searching...';

    try {
        const location = await geocode(query);
        setUnitsForCountry(location.country);
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

// Back button returns to the search/home view
backBtn.addEventListener('click', () => {
    showHome();
    history.pushState(null, '', location.pathname);
});

// Temperature unit toggle -- switches F/C and re-fetches weather data
document.getElementById('units-toggle').addEventListener('click', () => {
    toggleUnits();
    if (_lastLat !== null) {
        fetchAllWeatherData(_lastLat, _lastLon);
    }
});

// Time format toggle -- switches 12H/24H and re-fetches weather data
document.getElementById('time-toggle').addEventListener('click', () => {
    units.time24h = !units.time24h;
    updateUnitsToggleLabel();
    saveUnitsPref();
    if (_lastLat !== null) {
        fetchAllWeatherData(_lastLat, _lastLon);
    }
});

// =============================================================================
//  SECTION: URL State Management
//  Manages the browser URL for deep-linking to specific locations.
//  Supports query parameter (?q=...) and legacy hash (#...) formats.
// =============================================================================

/**
 * Updates the browser URL with the search query as a query parameter.
 * @param {string} query - The search query to encode in the URL.
 */
function updateURL(query) {
    history.pushState(null, '', `?q=${encodeURIComponent(query)}`);
}

/**
 * Extracts the search query from the current URL.
 * Checks for ?q= parameter first, then falls back to hash fragment
 * for backward compatibility with older URL format.
 * @returns {string} The search query, or empty string if none.
 */
function getQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) return params.get('q');
    if (window.location.hash.length > 1) return decodeURIComponent(window.location.hash.slice(1));
    return '';
}

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    const query = getQueryFromURL();
    if (query) {
        searchInput.value = query;
        searchForm.dispatchEvent(new Event('submit'));
    } else {
        showHome();
    }
});

// Auto-load weather data from URL on initial page load
(function () {
    const query = getQueryFromURL();
    if (query) {
        searchInput.value = query;
        searchForm.dispatchEvent(new Event('submit'));
    }
})();

// Initialize drag-to-reorder (uses event delegation, works across re-renders)
initSectionDrag();
initChartDrag();

// =============================================================================
//  SECTION: Dark Mode / Theme Toggle
//  Manages dark/light theme with localStorage persistence and OS preference
//  detection. Re-renders theme-sensitive elements (day backgrounds, radar)
//  on toggle.
// =============================================================================

(function () {
    const toggle = document.getElementById('theme-toggle');
    const stored = localStorage.getItem('theme');

    /**
     * Applies a theme (dark or light) to the page.
     * Sets the data-theme attribute, updates the toggle button icon,
     * persists the choice, and re-renders theme-sensitive elements.
     * @param {string} theme - 'dark' or 'light'.
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
        // Re-render elements that have theme-dependent colors
        updateDayBackgrounds();
        if (_lastLat !== null) renderRadar(_lastLat, _lastLon);
    }

    // Initialize: use stored preference, fall back to OS preference
    if (stored) {
        setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    }

    // Toggle theme on button click
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
})();

// =============================================================================
//  SECTION: Restore Defaults
//  Resets all section layout preferences to defaults and re-fetches data.
// =============================================================================

document.getElementById('restore-defaults').addEventListener('click', () => {
    localStorage.removeItem('sectionPrefs');
    if (_lastLat !== null) {
        fetchAllWeatherData(_lastLat, _lastLon);
    }
});

// =============================================================================
//  SECTION: Privacy Panel
//  Toggleable privacy information panel accessible from both home and
//  weather views. Closes when clicking outside the panel.
// =============================================================================

/**
 * Toggles the visibility of the privacy information panel.
 */
function togglePrivacy() {
    const panel = document.getElementById('privacy-panel');
    panel.hidden = !panel.hidden;
}

// Open privacy panel from either the home or weather view toggle
document.getElementById('privacy-toggle-home').addEventListener('click', togglePrivacy);
document.getElementById('privacy-toggle-weather').addEventListener('click', togglePrivacy);

// Close button inside the privacy panel
document.getElementById('privacy-close').addEventListener('click', () => {
    document.getElementById('privacy-panel').hidden = true;
});

// Close privacy panel when clicking outside of it
document.addEventListener('click', (e) => {
    const panel = document.getElementById('privacy-panel');
    if (!panel.hidden &&
        !panel.contains(e.target) &&
        e.target.id !== 'privacy-toggle-home' &&
        e.target.id !== 'privacy-toggle-weather') {
        panel.hidden = true;
    }
});
