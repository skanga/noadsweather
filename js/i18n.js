// CONTRACT: This file must remain top-level side-effect-free. No DOM access,
// no event listeners, no global mutations outside the explicit declarations
// (TRANSLATIONS, LANGUAGE_FLAGS, getCurrentLang, getLocaleForDate, t,
// setLanguage, setLanguageOverride). The build script (scripts/build-cities.js)
// loads this file in a Node context via `new Function(src + '; return TRANSLATIONS;')`
// to extract translations at build time. Anything that touches `window`,
// `document`, or `navigator` at top level will throw under Node.
//
// Lazy access inside function bodies (e.g. navigator.language inside
// getCurrentLang) is fine — those functions just aren't called by the build.

// =============================================================================
// NoAdsWeather - i18n.js
// Internationalization — all translations for all 15 languages in one file.
// =============================================================================

const TRANSLATIONS = {
    en: {
        // UI
        currentConditions: 'Current Conditions',
        hourlyForecast: 'Hourly Forecast',
        tenDayForecast: '10-Day Forecast',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sun',
        moon: 'Moon',
        weatherAlerts: '⚠️ Weather Alerts',
        translateAlert: 'Translate',
        searchPlaceholder: 'Enter city or zip code',
        searchButton: 'Search',
        back: '← Back',
        privacyCookies: 'Privacy',
        about: 'About',
        supportThisSite: 'Support this site',
        showMore: 'Show more',
        showLess: 'Show less',
        lockLayout: 'Lock layout',
        unlockLayout: 'Unlock layout',
        settings: 'Settings',
        restoreDefaultLayout: 'Restore Default Layout',
        seePollenData: 'See pollen data',
        feelsLike: 'Feels like',
        humidity: 'Humidity',
        dewPoint: 'Dew Point',
        wind: 'Wind',
        gusts: 'Gusts',
        airQuality: 'Air Quality',
        uvIndex: 'UV Index',
        nwsRadarLink: 'NWS radar ↗',
        language: 'Language',

        // Style names
        style: 'Style',
        styleDefault: 'Default',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Quiet',

        machineTranslationNotice: 'UI translations are machine-generated and may not be perfect.',

        // Settings labels
        settingForecastColors: 'Show color backgrounds on 10-day forecast',
        settingSupportBtn: 'Show Annoying Support Button',
        settingWeatherSummary: 'Show weather summary',
        settingThemeToggle: 'Show Light Mode / Dark Mode button',
        settingUnitsBtn: 'Show °C / °F button',
        settingTimeBtn: 'Show 12H / 24H button',
        settingLockBtn: 'Show Lock / Unlock button',
        settingNwsLink: 'Show NWS Radar link',
        settingShowSectionButtons: 'Show "Show section" buttons when sections are hidden',
        settingTranslateLink: 'Show alert translation link',
        settingAutoPlayRadar: 'Always auto-play radar',
        settingRememberCity: 'Remember last city',
        cityPageTitle: '{city} Weather with No Ads',
        cityPageSeoBlurb: 'Get the {city} weather forecast without ads, cookies, or tracking. Open-Meteo data, 10-day forecast, hourly conditions, and radar — all free.',
        cityPageHideBlurb: 'click here to hide this',

        // Weather codes (WMO)
        wc0: 'Clear sky',
        wc1: 'Mainly clear',
        wc2: 'Partly cloudy',
        wc3: 'Overcast',
        wc45: 'Foggy',
        wc48: 'Depositing rime fog',
        wc51: 'Light drizzle',
        wc53: 'Moderate drizzle',
        wc55: 'Dense drizzle',
        wc61: 'Slight rain',
        wc63: 'Moderate rain',
        wc65: 'Heavy rain',
        wc71: 'Slight snow',
        wc73: 'Moderate snow',
        wc75: 'Heavy snow',
        wc77: 'Snow grains',
        wc80: 'Slight rain showers',
        wc81: 'Moderate rain showers',
        wc82: 'Violent rain showers',
        wc85: 'Slight snow showers',
        wc86: 'Heavy snow showers',
        wc95: 'Thunderstorm',
        wc96: 'Thunderstorm with slight hail',
        wc99: 'Thunderstorm with heavy hail',
        wcUnknown: 'Unknown',

        // Weather summary — temp adjectives
        sumTempFreezing: "It's freezing",
        sumTempCold: "It's cold",
        sumTempCool: "It's cool",
        sumTempMild: "It's",
        sumTempWarm: "It's warm",
        sumTempHot: "It's hot",

        // Opening template
        sumOpeningTemplate: '{tempAdj} at {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (feels like {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' with thunderstorms',
        sumConditionSnowing: ' and snowing',
        sumConditionRaining: ' and raining',
        sumConditionRainingWithAmount: ' and raining ({amount} expected today)',
        sumConditionRainingWithAmountClearingBy: ' and raining ({amount} expected today), clearing around {hour}',
        sumConditionRainSoon: ' with rain expected very soon',
        sumConditionRainLikelyAround: ' with rain likely around {hour}',
        sumConditionClearSkies: ' with clear skies',
        sumConditionCloudy: ' and cloudy',

        // Follow-up sentences
        sumTodayHigh: 'High of {high}{unit} today',
        sumTomorrowRainWithAmount: 'Rain expected tomorrow ({amount})',
        sumTomorrowSnowWithAmount: 'Snow expected tomorrow ({amount})',
        sumTomorrowRainNoAmount: 'Rain expected tomorrow',
        sumTomorrowWarming: 'warming up to {high}{unit} tomorrow',
        sumTomorrowCooling: 'cooling to {high}{unit} tomorrow',

        // UV Index levels
        uvLow: '(Low)',
        uvModerate: '(Moderate)',
        uvHigh: '(High)',
        uvVeryHigh: '(Very High)',
        uvExtreme: '(Extreme)',

        // Loading / unavailable messages
        loading: 'Loading...',
        loadingRadar: 'Loading radar...',
        refreshingRadar: 'Refreshing radar...',
        radarUnavailable: 'Radar unavailable',
        pollenDataUnavailable: 'Pollen data unavailable for this location',

        // Astronomy section labels
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        solarNoon: 'Solar Noon',
        moonrise: 'Moonrise',
        moonset: 'Moonset',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'New Moon',
        moonPhaseWaxingCrescent: 'Waxing Crescent',
        moonPhaseFirstQuarter: 'First Quarter',
        moonPhaseWaxingGibbous: 'Waxing Gibbous',
        moonPhaseFullMoon: 'Full Moon',
        moonPhaseWaningGibbous: 'Waning Gibbous',
        moonPhaseLastQuarter: 'Last Quarter',
        moonPhaseWaningCrescent: 'Waning Crescent',

        // Chart legends (10-day forecast)
        chartTemperature: 'Temperature',
        chartFeelsLike: 'Feels Like',
        chartDewPoint: 'Dew Point',
        chartCloudCover: 'Cloud Cover',
        chartPrecipChance: 'Precip Chance',
        chartHumidity: 'Humidity',
        chartPressure: 'Pressure',
        chartPrecipAccum: 'Precip Accum.',
        chartHourlyPrecip: 'Hourly Precip',
        chartWindSpeed: 'Wind Speed',
        chartWindGusts: 'Wind Gusts',

        // Section controls
        dragToReorder: 'Drag to reorder',
        moveUp: 'Move up',
        moveDown: 'Move down',
        singleColumn: 'Single column',
        fullWidth: 'Full width',
        removeSection: 'Remove section',
        minimizeSection: 'Minimize section',
        hideChart: 'Hide chart',

        // Radar controls
        refreshRadar: 'Refresh radar',
        pauseRadar: 'Pause',
        playRadar: 'Play',
        // Radar progress / forecast labels
        forecastLabel: 'FORECAST',
        radarNow: 'NOW',
        slowerRadar: 'Slower',
        fasterRadar: 'Faster',

        // Show prefix for restoring hidden sections
        showSectionPrefix: 'Show {name}',

        // Home page tagline
        tagline: 'Weather without the clutter.',

        // Air quality severity labels
        aqiGood: 'Good',
        aqiModerate: 'Moderate',
        aqiUnhealthyForSensitive: 'Unhealthy for Sensitive Groups',
        aqiUnhealthy: 'Unhealthy',
        aqiVeryUnhealthy: 'Very Unhealthy',
        aqiHazardous: 'Hazardous',

        // Pollen level labels
        pollenLow: 'Low',
        pollenLowMed: 'Low-Medium',
        pollenMedium: 'Medium',
        pollenHigh: 'High',
        pollenVeryHigh: 'Very High',

        // Misc short labels
        highTemp: 'High',
        lowTemp: 'Low',

        // Search / errors / aria-labels
        searching: 'Searching...',
        didYouMean: 'Did you mean:',
        locationNotFound: 'Location not found. Try a different city or zip code.',
        failedToLoadWeather: 'Failed to load weather data. Please try again.',
        retry: 'Retry',
        hide: 'Hide',
        close: 'Close',
        toggleTheme: 'Toggle dark mode',
        backToSearch: 'Back to search'
    },

    es: {
        // UI
        currentConditions: 'Condiciones actuales',
        hourlyForecast: 'Pronóstico por hora',
        tenDayForecast: 'Pronóstico de 10 días',
        radar: 'Radar',
        pollen: 'Polen',
        sun: 'Sol',
        moon: 'Luna',
        weatherAlerts: '⚠️ Alertas meteorológicas',
        translateAlert: 'Traducir',
        searchPlaceholder: 'Ingresa ciudad o código postal',
        searchButton: 'Buscar',
        back: '← Volver',
        privacyCookies: 'Privacidad',
        about: 'Acerca de',
        supportThisSite: 'Apoya este sitio',
        showMore: 'Mostrar más',
        showLess: 'Mostrar menos',
        lockLayout: 'Bloquear diseño',
        unlockLayout: 'Desbloquear diseño',
        settings: 'Configuración',
        restoreDefaultLayout: 'Restaurar diseño predeterminado',
        seePollenData: 'Ver datos de polen',
        feelsLike: 'Sensación',
        humidity: 'Humedad',
        dewPoint: 'Punto de rocío',
        wind: 'Viento',
        gusts: 'Ráfagas',
        airQuality: 'Calidad del aire',
        uvIndex: 'Índice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Idioma',

        // Style names
        style: 'Estilo',
        styleDefault: 'Predeterminado',
        styleEditorial: 'Editorial',
        styleBulletin: 'Boletín',
        styleQuiet: 'Tranquilo',

        machineTranslationNotice: 'Las traducciones de la interfaz son automáticas y pueden no ser perfectas.',

        // Settings labels
        settingForecastColors: 'Mostrar fondos de color en el pronóstico de 10 días',
        settingSupportBtn: 'Mostrar botón de apoyo molesto',
        settingWeatherSummary: 'Mostrar resumen del clima',
        settingThemeToggle: 'Mostrar botón Modo claro / Modo oscuro',
        settingUnitsBtn: 'Mostrar botón °C / °F',
        settingTimeBtn: 'Mostrar botón 12H / 24H',
        settingLockBtn: 'Mostrar botón Bloquear / Desbloquear',
        settingNwsLink: 'Mostrar enlace al radar NWS',
        settingShowSectionButtons: 'Mostrar botones "Mostrar sección" cuando las secciones están ocultas',
        settingTranslateLink: 'Mostrar enlace de traducción de alertas',
        settingAutoPlayRadar: 'Reproducir radar automáticamente',
        settingRememberCity: 'Recordar última ciudad',
        cityPageTitle: 'Clima {city} sin anuncios',
        cityPageSeoBlurb: 'Consulta el pronóstico del tiempo para {city} sin publicidad, cookies ni rastreamiento. Datos de Open-Meteo, pronóstico de 10 días, condiciones por hora y radar — todo gratis.',
        cityPageHideBlurb: 'haz clic aquí para ocultar',

        // Weather codes
        wc0: 'Cielo despejado',
        wc1: 'Mayormente despejado',
        wc2: 'Parcialmente nublado',
        wc3: 'Nublado',
        wc45: 'Niebla',
        wc48: 'Niebla con escarcha',
        wc51: 'Llovizna ligera',
        wc53: 'Llovizna moderada',
        wc55: 'Llovizna densa',
        wc61: 'Lluvia ligera',
        wc63: 'Lluvia moderada',
        wc65: 'Lluvia fuerte',
        wc71: 'Nieve ligera',
        wc73: 'Nieve moderada',
        wc75: 'Nieve fuerte',
        wc77: 'Granos de nieve',
        wc80: 'Chubascos ligeros',
        wc81: 'Chubascos moderados',
        wc82: 'Chubascos violentos',
        wc85: 'Chubascos de nieve ligeros',
        wc86: 'Chubascos de nieve fuertes',
        wc95: 'Tormenta eléctrica',
        wc96: 'Tormenta con granizo ligero',
        wc99: 'Tormenta con granizo fuerte',
        wcUnknown: 'Desconocido',

        // Temp adjectives
        sumTempFreezing: 'Hace un frío glacial',
        sumTempCold: 'Hace frío',
        sumTempCool: 'Hace fresco',
        sumTempMild: 'Está',
        sumTempWarm: 'Hace calor templado',
        sumTempHot: 'Hace calor',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (sensación térmica {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' con tormentas eléctricas',
        sumConditionSnowing: ' y nevando',
        sumConditionRaining: ' y lloviendo',
        sumConditionRainingWithAmount: ' y lloviendo ({amount} esperados hoy)',
        sumConditionRainingWithAmountClearingBy: ' y lloviendo ({amount} esperados hoy), despejando alrededor de {hour}',
        sumConditionRainSoon: ' con lluvia prevista muy pronto',
        sumConditionRainLikelyAround: ' con lluvia probable alrededor de {hour}',
        sumConditionClearSkies: ' con cielos despejados',
        sumConditionCloudy: ' y nublado',

        // Follow-up sentences
        sumTodayHigh: 'Máxima de {high}{unit} hoy',
        sumTomorrowRainWithAmount: 'Lluvia prevista mañana ({amount})',
        sumTomorrowSnowWithAmount: 'Nieve prevista mañana ({amount})',
        sumTomorrowRainNoAmount: 'Lluvia prevista mañana',
        sumTomorrowWarming: 'subiendo hasta {high}{unit} mañana',
        sumTomorrowCooling: 'bajando a {high}{unit} mañana',

        // UV Index levels
        uvLow: '(Bajo)',
        uvModerate: '(Moderado)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Muy alto)',
        uvExtreme: '(Extremo)',

        // Loading / unavailable messages
        loading: 'Cargando...',
        loadingRadar: 'Cargando radar...',
        refreshingRadar: 'Actualizando radar...',
        radarUnavailable: 'Radar no disponible',
        pollenDataUnavailable: 'Datos de polen no disponibles para esta ubicación',

        // Astronomy section labels
        sunrise: 'Amanecer',
        sunset: 'Atardecer',
        solarNoon: 'Mediodía solar',
        moonrise: 'Salida de la luna',
        moonset: 'Puesta de la luna',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Luna nueva',
        moonPhaseWaxingCrescent: 'Creciente',
        moonPhaseFirstQuarter: 'Cuarto creciente',
        moonPhaseWaxingGibbous: 'Gibosa creciente',
        moonPhaseFullMoon: 'Luna llena',
        moonPhaseWaningGibbous: 'Gibosa menguante',
        moonPhaseLastQuarter: 'Cuarto menguante',
        moonPhaseWaningCrescent: 'Menguante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Sensación',
        chartDewPoint: 'Punto de rocío',
        chartCloudCover: 'Nubosidad',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Humedad',
        chartPressure: 'Presión',
        chartPrecipAccum: 'Precip. acum.',
        chartHourlyPrecip: 'Precip. horaria',
        chartWindSpeed: 'Velocidad del viento',
        chartWindGusts: 'Ráfagas',

        // Section controls
        dragToReorder: 'Arrastrar para reordenar',
        moveUp: 'Mover arriba',
        moveDown: 'Mover abajo',
        singleColumn: 'Columna única',
        fullWidth: 'Ancho completo',
        removeSection: 'Quitar sección',
        minimizeSection: 'Minimizar sección',
        hideChart: 'Ocultar gráfico',

        // Radar controls
        refreshRadar: 'Actualizar radar',
        pauseRadar: 'Pausar',
        playRadar: 'Reproducir',
        // Radar progress / forecast labels
        forecastLabel: 'PRONÓSTICO',
        radarNow: 'AHORA',
        slowerRadar: 'Más lento',
        fasterRadar: 'Más rápido',

        // Show prefix
        showSectionPrefix: 'Mostrar {name}',

        // Tagline
        tagline: 'El clima sin lo superfluo.',

        // AQI severity
        aqiGood: 'Bueno',
        aqiModerate: 'Moderado',
        aqiUnhealthyForSensitive: 'Insalubre para grupos sensibles',
        aqiUnhealthy: 'Insalubre',
        aqiVeryUnhealthy: 'Muy insalubre',
        aqiHazardous: 'Peligroso',

        // Pollen levels
        pollenLow: 'Bajo',
        pollenLowMed: 'Bajo-Medio',
        pollenMedium: 'Medio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Muy alto',

        // Misc
        highTemp: 'Máx',
        lowTemp: 'Mín',

        // Search / errors / aria-labels
        searching: 'Buscando...',
        didYouMean: '¿Quisiste decir:',
        locationNotFound: 'Ubicación no encontrada. Prueba con otra ciudad o código postal.',
        failedToLoadWeather: 'No se pudieron cargar los datos del clima. Inténtalo de nuevo.',
        retry: 'Reintentar',
        hide: 'Ocultar',
        close: 'Cerrar',
        toggleTheme: 'Cambiar modo oscuro',
        backToSearch: 'Volver a la búsqueda'
    },

    fr: {
        // UI
        currentConditions: 'Conditions actuelles',
        hourlyForecast: 'Prévisions horaires',
        tenDayForecast: 'Prévisions sur 10 jours',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Soleil',
        moon: 'Lune',
        weatherAlerts: '⚠️ Alertes météo',
        translateAlert: 'Traduire',
        searchPlaceholder: 'Entrez ville ou code postal',
        searchButton: 'Rechercher',
        back: '← Retour',
        privacyCookies: 'Confidentialité',
        about: 'À propos',
        supportThisSite: 'Soutenir ce site',
        showMore: 'Afficher plus',
        showLess: 'Afficher moins',
        lockLayout: 'Verrouiller la mise en page',
        unlockLayout: 'Déverrouiller la mise en page',
        settings: 'Paramètres',
        restoreDefaultLayout: 'Restaurer la mise en page par défaut',
        seePollenData: 'Voir les données du pollen',
        feelsLike: 'Ressenti',
        humidity: 'Humidité',
        dewPoint: 'Point de rosée',
        wind: 'Vent',
        gusts: 'Rafales',
        airQuality: 'Qualité de l\'air',
        uvIndex: 'Indice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Langue',

        // Style names
        style: 'Style',
        styleDefault: 'Par défaut',
        styleEditorial: 'Éditorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Calme',

        machineTranslationNotice: 'Les traductions de l\'interface sont générées automatiquement et peuvent ne pas être parfaites.',

        // Settings labels
        settingForecastColors: 'Afficher les fonds colorés sur les prévisions à 10 jours',
        settingSupportBtn: 'Afficher le bouton de soutien gênant',
        settingWeatherSummary: 'Afficher le résumé météo',
        settingThemeToggle: 'Afficher le bouton Mode clair / Mode sombre',
        settingUnitsBtn: 'Afficher le bouton °C / °F',
        settingTimeBtn: 'Afficher le bouton 12H / 24H',
        settingLockBtn: 'Afficher le bouton Verrouiller / Déverrouiller',
        settingNwsLink: 'Afficher le lien du radar NWS',
        settingShowSectionButtons: 'Afficher les boutons "Afficher la section" lorsque les sections sont masquées',
        settingTranslateLink: 'Afficher le lien de traduction des alertes',
        settingAutoPlayRadar: 'Lire le radar automatiquement',
        settingRememberCity: 'Mémoriser la dernière ville',
        cityPageTitle: 'Météo {city} sans publicité',
        cityPageSeoBlurb: 'Consultez les prévisions météo pour {city} sans publicité, cookies ni suivi. Données Open-Meteo, prévisions sur 10 jours, conditions horaires et radar — tout gratuit.',
        cityPageHideBlurb: 'cliquez ici pour masquer',

        // Weather codes
        wc0: 'Ciel dégagé',
        wc1: 'Principalement clair',
        wc2: 'Partiellement nuageux',
        wc3: 'Couvert',
        wc45: 'Brouillard',
        wc48: 'Brouillard givrant',
        wc51: 'Bruine légère',
        wc53: 'Bruine modérée',
        wc55: 'Bruine dense',
        wc61: 'Pluie faible',
        wc63: 'Pluie modérée',
        wc65: 'Forte pluie',
        wc71: 'Neige faible',
        wc73: 'Neige modérée',
        wc75: 'Forte neige',
        wc77: 'Grains de neige',
        wc80: 'Averses de pluie légères',
        wc81: 'Averses de pluie modérées',
        wc82: 'Averses de pluie violentes',
        wc85: 'Averses de neige légères',
        wc86: 'Averses de neige fortes',
        wc95: 'Orage',
        wc96: 'Orage avec grêle légère',
        wc99: 'Orage avec forte grêle',
        wcUnknown: 'Inconnu',

        // Temp adjectives
        sumTempFreezing: 'Il fait un froid glacial',
        sumTempCold: 'Il fait froid',
        sumTempCool: 'Il fait frais',
        sumTempMild: 'Il fait',
        sumTempWarm: 'Il fait doux',
        sumTempHot: 'Il fait chaud',

        // Opening template
        sumOpeningTemplate: '{tempAdj} à {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (ressenti {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' avec des orages',
        sumConditionSnowing: ' et il neige',
        sumConditionRaining: ' et il pleut',
        sumConditionRainingWithAmount: ' et il pleut ({amount} prévus aujourd\'hui)',
        sumConditionRainingWithAmountClearingBy: ' et il pleut ({amount} prévus aujourd\'hui), éclaircies vers {hour}',
        sumConditionRainSoon: ' avec de la pluie prévue très bientôt',
        sumConditionRainLikelyAround: ' avec de la pluie probable vers {hour}',
        sumConditionClearSkies: ' avec un ciel dégagé',
        sumConditionCloudy: ' et nuageux',

        // Follow-up sentences
        sumTodayHigh: 'Maximum de {high}{unit} aujourd\'hui',
        sumTomorrowRainWithAmount: 'Pluie prévue demain ({amount})',
        sumTomorrowSnowWithAmount: 'Neige prévue demain ({amount})',
        sumTomorrowRainNoAmount: 'Pluie prévue demain',
        sumTomorrowWarming: 'se réchauffant jusqu\'à {high}{unit} demain',
        sumTomorrowCooling: 'se refroidissant à {high}{unit} demain',

        // UV Index levels
        uvLow: '(Faible)',
        uvModerate: '(Modéré)',
        uvHigh: '(Élevé)',
        uvVeryHigh: '(Très élevé)',
        uvExtreme: '(Extrême)',

        // Loading / unavailable messages
        loading: 'Chargement...',
        loadingRadar: 'Chargement du radar...',
        refreshingRadar: 'Actualisation du radar...',
        radarUnavailable: 'Radar indisponible',
        pollenDataUnavailable: 'Données de pollen indisponibles pour cet emplacement',

        // Astronomy section labels
        sunrise: 'Lever du soleil',
        sunset: 'Coucher du soleil',
        solarNoon: 'Midi solaire',
        moonrise: 'Lever de la lune',
        moonset: 'Coucher de la lune',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'Nouvelle lune',
        moonPhaseWaxingCrescent: 'Premier croissant',
        moonPhaseFirstQuarter: 'Premier quartier',
        moonPhaseWaxingGibbous: 'Gibbeuse croissante',
        moonPhaseFullMoon: 'Pleine lune',
        moonPhaseWaningGibbous: 'Gibbeuse décroissante',
        moonPhaseLastQuarter: 'Dernier quartier',
        moonPhaseWaningCrescent: 'Dernier croissant',

        // Chart legends
        chartTemperature: 'Température',
        chartFeelsLike: 'Ressenti',
        chartDewPoint: 'Point de rosée',
        chartCloudCover: 'Nébulosité',
        chartPrecipChance: 'Prob. de précip.',
        chartHumidity: 'Humidité',
        chartPressure: 'Pression',
        chartPrecipAccum: 'Précip. cumul.',
        chartHourlyPrecip: 'Précip. horaire',
        chartWindSpeed: 'Vitesse du vent',
        chartWindGusts: 'Rafales',

        // Section controls
        dragToReorder: 'Faire glisser pour réorganiser',
        moveUp: 'Monter',
        moveDown: 'Descendre',
        singleColumn: 'Colonne unique',
        fullWidth: 'Pleine largeur',
        removeSection: 'Supprimer la section',
        minimizeSection: 'Réduire la section',
        hideChart: 'Masquer le graphique',

        // Radar controls
        refreshRadar: 'Actualiser le radar',
        pauseRadar: 'Pause',
        playRadar: 'Lecture',
        // Radar progress / forecast labels
        forecastLabel: 'PRÉVISION',
        radarNow: 'MAINTENANT',
        slowerRadar: 'Plus lent',
        fasterRadar: 'Plus rapide',

        // Show prefix
        showSectionPrefix: 'Afficher {name}',

        // Tagline
        tagline: 'La météo sans le superflu.',

        // AQI severity
        aqiGood: 'Bon',
        aqiModerate: 'Modéré',
        aqiUnhealthyForSensitive: 'Malsain pour groupes sensibles',
        aqiUnhealthy: 'Malsain',
        aqiVeryUnhealthy: 'Très malsain',
        aqiHazardous: 'Dangereux',

        // Pollen levels
        pollenLow: 'Faible',
        pollenLowMed: 'Faible-Moyen',
        pollenMedium: 'Moyen',
        pollenHigh: 'Élevé',
        pollenVeryHigh: 'Très élevé',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Recherche...',
        didYouMean: 'Vouliez-vous dire :',
        locationNotFound: 'Lieu introuvable. Essayez une autre ville ou un autre code postal.',
        failedToLoadWeather: 'Échec du chargement des données météo. Veuillez réessayer.',
        retry: 'Réessayer',
        hide: 'Masquer',
        close: 'Fermer',
        toggleTheme: 'Basculer le mode sombre',
        backToSearch: 'Retour à la recherche'
    },

    de: {
        // UI
        currentConditions: 'Aktuelle Bedingungen',
        hourlyForecast: 'Stündliche Vorhersage',
        tenDayForecast: '10-Tage-Vorhersage',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sonne',
        moon: 'Mond',
        weatherAlerts: '⚠️ Wetterwarnungen',
        translateAlert: 'Übersetzen',
        searchPlaceholder: 'Stadt oder Postleitzahl eingeben',
        searchButton: 'Suchen',
        back: '← Zurück',
        privacyCookies: 'Datenschutz',
        about: 'Über uns',
        supportThisSite: 'Diese Seite unterstützen',
        showMore: 'Mehr anzeigen',
        showLess: 'Weniger anzeigen',
        lockLayout: 'Layout sperren',
        unlockLayout: 'Layout entsperren',
        settings: 'Einstellungen',
        restoreDefaultLayout: 'Standardlayout wiederherstellen',
        seePollenData: 'Pollendaten anzeigen',
        feelsLike: 'Gefühlt',
        humidity: 'Luftfeuchtigkeit',
        dewPoint: 'Taupunkt',
        wind: 'Wind',
        gusts: 'Böen',
        airQuality: 'Luftqualität',
        uvIndex: 'UV-Index',
        nwsRadarLink: 'NWS-Radar ↗',
        language: 'Sprache',

        // Style names
        style: 'Stil',
        styleDefault: 'Standard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Ruhig',

        machineTranslationNotice: 'Die Übersetzungen der Benutzeroberfläche sind maschinell erstellt und möglicherweise nicht perfekt.',

        // Settings labels
        settingForecastColors: 'Farbige Hintergründe in der 10-Tage-Vorhersage anzeigen',
        settingSupportBtn: 'Nervigen Unterstützungsbutton anzeigen',
        settingWeatherSummary: 'Wetterzusammenfassung anzeigen',
        settingThemeToggle: 'Hell-/Dunkelmodus-Schaltfläche anzeigen',
        settingUnitsBtn: '°C / °F-Schaltfläche anzeigen',
        settingTimeBtn: '12H / 24H-Schaltfläche anzeigen',
        settingLockBtn: 'Sperren/Entsperren-Schaltfläche anzeigen',
        settingNwsLink: 'NWS-Radar-Link anzeigen',
        settingShowSectionButtons: '"Bereich anzeigen"-Schaltflächen anzeigen, wenn Bereiche ausgeblendet sind',
        settingTranslateLink: 'Übersetzungslink für Warnungen anzeigen',
        settingAutoPlayRadar: 'Radar automatisch abspielen',
        settingRememberCity: 'Letzte Stadt merken',
        cityPageTitle: 'Wetter {city} ohne Werbung',
        cityPageSeoBlurb: 'Wettervorhersage für {city} ohne Werbung, Cookies oder Tracking. Open-Meteo-Daten, 10-Tage-Vorhersage, stündliche Bedingungen und Radar — alles kostenlos.',
        cityPageHideBlurb: 'hier klicken zum Ausblenden',

        // Weather codes
        wc0: 'Klarer Himmel',
        wc1: 'Überwiegend klar',
        wc2: 'Teilweise bewölkt',
        wc3: 'Bedeckt',
        wc45: 'Neblig',
        wc48: 'Gefrierender Nebel',
        wc51: 'Leichter Nieselregen',
        wc53: 'Mäßiger Nieselregen',
        wc55: 'Dichter Nieselregen',
        wc61: 'Leichter Regen',
        wc63: 'Mäßiger Regen',
        wc65: 'Starker Regen',
        wc71: 'Leichter Schneefall',
        wc73: 'Mäßiger Schneefall',
        wc75: 'Starker Schneefall',
        wc77: 'Schneegriesel',
        wc80: 'Leichte Regenschauer',
        wc81: 'Mäßige Regenschauer',
        wc82: 'Heftige Regenschauer',
        wc85: 'Leichte Schneeschauer',
        wc86: 'Starke Schneeschauer',
        wc95: 'Gewitter',
        wc96: 'Gewitter mit leichtem Hagel',
        wc99: 'Gewitter mit starkem Hagel',
        wcUnknown: 'Unbekannt',

        // Temp adjectives
        sumTempFreezing: 'Es ist eiskalt',
        sumTempCold: 'Es ist kalt',
        sumTempCool: 'Es ist kühl',
        sumTempMild: 'Es ist',
        sumTempWarm: 'Es ist warm',
        sumTempHot: 'Es ist heiß',

        // Opening template
        sumOpeningTemplate: '{tempAdj} bei {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (gefühlt {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' mit Gewittern',
        sumConditionSnowing: ' und es schneit',
        sumConditionRaining: ' und es regnet',
        sumConditionRainingWithAmount: ' und es regnet (heute {amount} erwartet)',
        sumConditionRainingWithAmountClearingBy: ' und es regnet (heute {amount} erwartet), klart gegen {hour} auf',
        sumConditionRainSoon: ' mit Regen in Kürze',
        sumConditionRainLikelyAround: ' mit Regen wahrscheinlich gegen {hour}',
        sumConditionClearSkies: ' mit klarem Himmel',
        sumConditionCloudy: ' und bewölkt',

        // Follow-up sentences
        sumTodayHigh: 'Höchsttemperatur heute {high}{unit}',
        sumTomorrowRainWithAmount: 'Regen morgen erwartet ({amount})',
        sumTomorrowSnowWithAmount: 'Schnee morgen erwartet ({amount})',
        sumTomorrowRainNoAmount: 'Regen morgen erwartet',
        sumTomorrowWarming: 'Erwärmung auf {high}{unit} morgen',
        sumTomorrowCooling: 'Abkühlung auf {high}{unit} morgen',

        // UV Index levels
        uvLow: '(Niedrig)',
        uvModerate: '(Mäßig)',
        uvHigh: '(Hoch)',
        uvVeryHigh: '(Sehr hoch)',
        uvExtreme: '(Extrem)',

        // Loading / unavailable messages
        loading: 'Wird geladen...',
        loadingRadar: 'Radar wird geladen...',
        refreshingRadar: 'Radar wird aktualisiert...',
        radarUnavailable: 'Radar nicht verfügbar',
        pollenDataUnavailable: 'Pollendaten für diesen Ort nicht verfügbar',

        // Astronomy labels
        sunrise: 'Sonnenaufgang',
        sunset: 'Sonnenuntergang',
        solarNoon: 'Sonnenhöchststand',
        moonrise: 'Mondaufgang',
        moonset: 'Monduntergang',
        phase: 'Phase',

        // Moon phase names
        moonPhaseNewMoon: 'Neumond',
        moonPhaseWaxingCrescent: 'Zunehmende Sichel',
        moonPhaseFirstQuarter: 'Erstes Viertel',
        moonPhaseWaxingGibbous: 'Zunehmender Mond',
        moonPhaseFullMoon: 'Vollmond',
        moonPhaseWaningGibbous: 'Abnehmender Mond',
        moonPhaseLastQuarter: 'Letztes Viertel',
        moonPhaseWaningCrescent: 'Abnehmende Sichel',

        // Chart legends
        chartTemperature: 'Temperatur',
        chartFeelsLike: 'Gefühlt',
        chartDewPoint: 'Taupunkt',
        chartCloudCover: 'Bewölkung',
        chartPrecipChance: 'Niederschlagschance',
        chartHumidity: 'Luftfeuchtigkeit',
        chartPressure: 'Luftdruck',
        chartPrecipAccum: 'Niederschlag gesamt',
        chartHourlyPrecip: 'Stündl. Niederschlag',
        chartWindSpeed: 'Windgeschw.',
        chartWindGusts: 'Böen',

        // Section controls
        dragToReorder: 'Zum Neuanordnen ziehen',
        moveUp: 'Nach oben',
        moveDown: 'Nach unten',
        singleColumn: 'Einspaltig',
        fullWidth: 'Volle Breite',
        removeSection: 'Bereich entfernen',
        minimizeSection: 'Bereich minimieren',
        hideChart: 'Diagramm ausblenden',

        // Radar controls
        refreshRadar: 'Radar aktualisieren',
        pauseRadar: 'Pause',
        playRadar: 'Abspielen',
        // Radar progress / forecast labels
        forecastLabel: 'VORHERSAGE',
        radarNow: 'JETZT',
        slowerRadar: 'Langsamer',
        fasterRadar: 'Schneller',

        // Show prefix
        showSectionPrefix: '{name} anzeigen',

        // Tagline
        tagline: 'Wetter ohne Schnickschnack.',

        // AQI severity
        aqiGood: 'Gut',
        aqiModerate: 'Mäßig',
        aqiUnhealthyForSensitive: 'Ungesund für empfindliche Gruppen',
        aqiUnhealthy: 'Ungesund',
        aqiVeryUnhealthy: 'Sehr ungesund',
        aqiHazardous: 'Gesundheitsgefährdend',

        // Pollen levels
        pollenLow: 'Niedrig',
        pollenLowMed: 'Niedrig-Mittel',
        pollenMedium: 'Mittel',
        pollenHigh: 'Hoch',
        pollenVeryHigh: 'Sehr hoch',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Suche...',
        didYouMean: 'Meintest du:',
        locationNotFound: 'Standort nicht gefunden. Versuche eine andere Stadt oder Postleitzahl.',
        failedToLoadWeather: 'Wetterdaten konnten nicht geladen werden. Bitte erneut versuchen.',
        retry: 'Erneut versuchen',
        hide: 'Ausblenden',
        close: 'Schließen',
        toggleTheme: 'Dunkelmodus umschalten',
        backToSearch: 'Zurück zur Suche'
    },

    it: {
        // UI
        currentConditions: 'Condizioni attuali',
        hourlyForecast: 'Previsioni orarie',
        tenDayForecast: 'Previsioni a 10 giorni',
        radar: 'Radar',
        pollen: 'Polline',
        sun: 'Sole',
        moon: 'Luna',
        weatherAlerts: '⚠️ Allerte meteo',
        translateAlert: 'Traduci',
        searchPlaceholder: 'Inserisci città o CAP',
        searchButton: 'Cerca',
        back: '← Indietro',
        privacyCookies: 'Privacy',
        about: 'Informazioni',
        supportThisSite: 'Sostieni questo sito',
        showMore: 'Mostra di più',
        showLess: 'Mostra meno',
        lockLayout: 'Blocca layout',
        unlockLayout: 'Sblocca layout',
        settings: 'Impostazioni',
        restoreDefaultLayout: 'Ripristina layout predefinito',
        seePollenData: 'Vedi dati del polline',
        feelsLike: 'Percepita',
        humidity: 'Umidità',
        dewPoint: 'Punto di rugiada',
        wind: 'Vento',
        gusts: 'Raffiche',
        airQuality: 'Qualità dell\'aria',
        uvIndex: 'Indice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Lingua',

        // Style names
        style: 'Stile',
        styleDefault: 'Predefinito',
        styleEditorial: 'Editoriale',
        styleBulletin: 'Bollettino',
        styleQuiet: 'Sobrio',

        machineTranslationNotice: 'Le traduzioni dell\'interfaccia sono generate automaticamente e potrebbero non essere perfette.',

        // Settings labels
        settingForecastColors: 'Mostra sfondi colorati nelle previsioni a 10 giorni',
        settingSupportBtn: 'Mostra fastidioso pulsante di supporto',
        settingWeatherSummary: 'Mostra riepilogo meteo',
        settingThemeToggle: 'Mostra pulsante Modalità chiara / Modalità scura',
        settingUnitsBtn: 'Mostra pulsante °C / °F',
        settingTimeBtn: 'Mostra pulsante 12H / 24H',
        settingLockBtn: 'Mostra pulsante Blocca / Sblocca',
        settingNwsLink: 'Mostra link radar NWS',
        settingShowSectionButtons: 'Mostra i pulsanti "Mostra sezione" quando le sezioni sono nascoste',
        settingTranslateLink: 'Mostra link di traduzione delle allerte',
        settingAutoPlayRadar: 'Riproduci sempre il radar automaticamente',
        settingRememberCity: 'Ricorda ultima città',
        cityPageTitle: 'Meteo {city} senza pubblicità',
        cityPageSeoBlurb: 'Previsioni meteo per {city} senza pubblicità, cookie o tracciamento. Dati Open-Meteo, previsioni a 10 giorni, condizioni orarie e radar — tutto gratis.',
        cityPageHideBlurb: 'clicca qui per nascondere',

        // Weather codes
        wc0: 'Cielo sereno',
        wc1: 'Prevalentemente sereno',
        wc2: 'Parzialmente nuvoloso',
        wc3: 'Coperto',
        wc45: 'Nebbia',
        wc48: 'Nebbia con brina',
        wc51: 'Pioggerella leggera',
        wc53: 'Pioggerella moderata',
        wc55: 'Pioggerella fitta',
        wc61: 'Pioggia leggera',
        wc63: 'Pioggia moderata',
        wc65: 'Pioggia intensa',
        wc71: 'Neve leggera',
        wc73: 'Neve moderata',
        wc75: 'Neve intensa',
        wc77: 'Granelli di neve',
        wc80: 'Rovesci di pioggia leggeri',
        wc81: 'Rovesci di pioggia moderati',
        wc82: 'Rovesci di pioggia violenti',
        wc85: 'Rovesci di neve leggeri',
        wc86: 'Rovesci di neve intensi',
        wc95: 'Temporale',
        wc96: 'Temporale con grandine leggera',
        wc99: 'Temporale con grandine intensa',
        wcUnknown: 'Sconosciuto',

        // Temp adjectives
        sumTempFreezing: 'Fa un freddo gelido',
        sumTempCold: 'Fa freddo',
        sumTempCool: 'Fa fresco',
        sumTempMild: 'È',
        sumTempWarm: 'Fa caldo mite',
        sumTempHot: 'Fa caldo',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (percepita {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' con temporali',
        sumConditionSnowing: ' e sta nevicando',
        sumConditionRaining: ' e sta piovendo',
        sumConditionRainingWithAmount: ' e sta piovendo ({amount} previsti oggi)',
        sumConditionRainingWithAmountClearingBy: ' e sta piovendo ({amount} previsti oggi), schiarite intorno alle {hour}',
        sumConditionRainSoon: ' con pioggia prevista a breve',
        sumConditionRainLikelyAround: ' con pioggia probabile intorno alle {hour}',
        sumConditionClearSkies: ' con cieli sereni',
        sumConditionCloudy: ' e nuvoloso',

        // Follow-up sentences
        sumTodayHigh: 'Massima di {high}{unit} oggi',
        sumTomorrowRainWithAmount: 'Pioggia prevista domani ({amount})',
        sumTomorrowSnowWithAmount: 'Neve prevista domani ({amount})',
        sumTomorrowRainNoAmount: 'Pioggia prevista domani',
        sumTomorrowWarming: 'riscaldamento fino a {high}{unit} domani',
        sumTomorrowCooling: 'raffreddamento a {high}{unit} domani',

        // UV Index levels
        uvLow: '(Basso)',
        uvModerate: '(Moderato)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Molto alto)',
        uvExtreme: '(Estremo)',

        // Loading / unavailable messages
        loading: 'Caricamento...',
        loadingRadar: 'Caricamento radar...',
        refreshingRadar: 'Aggiornamento radar...',
        radarUnavailable: 'Radar non disponibile',
        pollenDataUnavailable: 'Dati polline non disponibili per questa località',

        // Astronomy labels
        sunrise: 'Alba',
        sunset: 'Tramonto',
        solarNoon: 'Mezzogiorno solare',
        moonrise: 'Sorgere della luna',
        moonset: 'Tramonto della luna',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Luna nuova',
        moonPhaseWaxingCrescent: 'Luna crescente',
        moonPhaseFirstQuarter: 'Primo quarto',
        moonPhaseWaxingGibbous: 'Gibbosa crescente',
        moonPhaseFullMoon: 'Luna piena',
        moonPhaseWaningGibbous: 'Gibbosa calante',
        moonPhaseLastQuarter: 'Ultimo quarto',
        moonPhaseWaningCrescent: 'Luna calante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Percepita',
        chartDewPoint: 'Punto di rugiada',
        chartCloudCover: 'Nuvolosità',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Umidità',
        chartPressure: 'Pressione',
        chartPrecipAccum: 'Precip. cumul.',
        chartHourlyPrecip: 'Precip. oraria',
        chartWindSpeed: 'Velocità vento',
        chartWindGusts: 'Raffiche',

        // Section controls
        dragToReorder: 'Trascina per riordinare',
        moveUp: 'Sposta su',
        moveDown: 'Sposta giù',
        singleColumn: 'Colonna singola',
        fullWidth: 'Larghezza piena',
        removeSection: 'Rimuovi sezione',
        minimizeSection: 'Minimizza sezione',
        hideChart: 'Nascondi grafico',

        // Radar controls
        refreshRadar: 'Aggiorna radar',
        pauseRadar: 'Pausa',
        playRadar: 'Riproduci',
        // Radar progress / forecast labels
        forecastLabel: 'PREVISIONE',
        radarNow: 'ORA',
        slowerRadar: 'Più lento',
        fasterRadar: 'Più veloce',

        // Show prefix
        showSectionPrefix: 'Mostra {name}',

        // Tagline
        tagline: 'Il meteo senza fronzoli.',

        // AQI severity
        aqiGood: 'Buona',
        aqiModerate: 'Moderata',
        aqiUnhealthyForSensitive: 'Malsana per gruppi sensibili',
        aqiUnhealthy: 'Malsana',
        aqiVeryUnhealthy: 'Molto malsana',
        aqiHazardous: 'Pericolosa',

        // Pollen levels
        pollenLow: 'Basso',
        pollenLowMed: 'Basso-Medio',
        pollenMedium: 'Medio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Molto alto',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Ricerca...',
        didYouMean: 'Forse cercavi:',
        locationNotFound: 'Posizione non trovata. Prova con un\'altra città o CAP.',
        failedToLoadWeather: 'Impossibile caricare i dati meteo. Riprova.',
        retry: 'Riprova',
        hide: 'Nascondi',
        close: 'Chiudi',
        toggleTheme: 'Attiva/disattiva modalità scura',
        backToSearch: 'Torna alla ricerca'
    },

    pt: {
        // UI
        currentConditions: 'Condições atuais',
        hourlyForecast: 'Previsão por hora',
        tenDayForecast: 'Previsão de 10 dias',
        radar: 'Radar',
        pollen: 'Pólen',
        sun: 'Sol',
        moon: 'Lua',
        weatherAlerts: '⚠️ Alertas meteorológicos',
        translateAlert: 'Traduzir',
        searchPlaceholder: 'Digite cidade ou CEP',
        searchButton: 'Buscar',
        back: '← Voltar',
        privacyCookies: 'Privacidade',
        about: 'Sobre',
        supportThisSite: 'Apoie este site',
        showMore: 'Mostrar mais',
        showLess: 'Mostrar menos',
        lockLayout: 'Bloquear layout',
        unlockLayout: 'Desbloquear layout',
        settings: 'Configurações',
        restoreDefaultLayout: 'Restaurar layout padrão',
        seePollenData: 'Ver dados de pólen',
        feelsLike: 'Sensação',
        humidity: 'Umidade',
        dewPoint: 'Ponto de orvalho',
        wind: 'Vento',
        gusts: 'Rajadas',
        airQuality: 'Qualidade do ar',
        uvIndex: 'Índice UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Idioma',

        // Style names
        style: 'Estilo',
        styleDefault: 'Padrão',
        styleEditorial: 'Editorial',
        styleBulletin: 'Boletim',
        styleQuiet: 'Tranquilo',

        machineTranslationNotice: 'As traduções da interface são geradas automaticamente e podem não estar perfeitas.',

        // Settings labels
        settingForecastColors: 'Mostrar fundos coloridos na previsão de 10 dias',
        settingSupportBtn: 'Mostrar botão chato de apoio',
        settingWeatherSummary: 'Mostrar resumo do clima',
        settingThemeToggle: 'Mostrar botão Modo claro / Modo escuro',
        settingUnitsBtn: 'Mostrar botão °C / °F',
        settingTimeBtn: 'Mostrar botão 12H / 24H',
        settingLockBtn: 'Mostrar botão Bloquear / Desbloquear',
        settingNwsLink: 'Mostrar link do radar NWS',
        settingShowSectionButtons: 'Mostrar botões "Mostrar seção" quando as seções estiverem ocultas',
        settingTranslateLink: 'Mostrar link de tradução de alertas',
        settingAutoPlayRadar: 'Reproduzir radar automaticamente',
        settingRememberCity: 'Lembrar última cidade',
        cityPageTitle: 'Tempo {city} sem anúncios',
        cityPageSeoBlurb: 'Previsão do tempo para {city} sem publicidade, cookies ou rastreamento. Dados do Open-Meteo, previsão de 10 dias, condições horárias e radar — tudo grátis.',
        cityPageHideBlurb: 'clique aqui para ocultar',

        // Weather codes
        wc0: 'Céu limpo',
        wc1: 'Predominantemente claro',
        wc2: 'Parcialmente nublado',
        wc3: 'Encoberto',
        wc45: 'Nevoeiro',
        wc48: 'Nevoeiro com geada',
        wc51: 'Garoa leve',
        wc53: 'Garoa moderada',
        wc55: 'Garoa densa',
        wc61: 'Chuva fraca',
        wc63: 'Chuva moderada',
        wc65: 'Chuva forte',
        wc71: 'Neve fraca',
        wc73: 'Neve moderada',
        wc75: 'Neve forte',
        wc77: 'Grãos de neve',
        wc80: 'Pancadas de chuva leves',
        wc81: 'Pancadas de chuva moderadas',
        wc82: 'Pancadas de chuva violentas',
        wc85: 'Pancadas de neve leves',
        wc86: 'Pancadas de neve fortes',
        wc95: 'Tempestade',
        wc96: 'Tempestade com granizo leve',
        wc99: 'Tempestade com granizo forte',
        wcUnknown: 'Desconhecido',

        // Temp adjectives
        sumTempFreezing: 'Está congelando',
        sumTempCold: 'Está frio',
        sumTempCool: 'Está fresco',
        sumTempMild: 'Está',
        sumTempWarm: 'Está quente ameno',
        sumTempHot: 'Está quente',

        // Opening template
        sumOpeningTemplate: '{tempAdj} a {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (sensação de {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' com tempestades',
        sumConditionSnowing: ' e nevando',
        sumConditionRaining: ' e chovendo',
        sumConditionRainingWithAmount: ' e chovendo ({amount} esperados hoje)',
        sumConditionRainingWithAmountClearingBy: ' e chovendo ({amount} esperados hoje), melhorando por volta das {hour}',
        sumConditionRainSoon: ' com chuva prevista muito em breve',
        sumConditionRainLikelyAround: ' com chuva provável por volta das {hour}',
        sumConditionClearSkies: ' com céu limpo',
        sumConditionCloudy: ' e nublado',

        // Follow-up sentences
        sumTodayHigh: 'Máxima de {high}{unit} hoje',
        sumTomorrowRainWithAmount: 'Chuva prevista amanhã ({amount})',
        sumTomorrowSnowWithAmount: 'Neve prevista amanhã ({amount})',
        sumTomorrowRainNoAmount: 'Chuva prevista amanhã',
        sumTomorrowWarming: 'esquentando até {high}{unit} amanhã',
        sumTomorrowCooling: 'esfriando para {high}{unit} amanhã',

        // UV Index levels
        uvLow: '(Baixo)',
        uvModerate: '(Moderado)',
        uvHigh: '(Alto)',
        uvVeryHigh: '(Muito alto)',
        uvExtreme: '(Extremo)',

        // Loading / unavailable messages
        loading: 'Carregando...',
        loadingRadar: 'Carregando radar...',
        refreshingRadar: 'Atualizando radar...',
        radarUnavailable: 'Radar indisponível',
        pollenDataUnavailable: 'Dados de pólen indisponíveis para esta localização',

        // Astronomy labels
        sunrise: 'Nascer do sol',
        sunset: 'Pôr do sol',
        solarNoon: 'Meio-dia solar',
        moonrise: 'Nascer da lua',
        moonset: 'Pôr da lua',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Lua nova',
        moonPhaseWaxingCrescent: 'Crescente',
        moonPhaseFirstQuarter: 'Quarto crescente',
        moonPhaseWaxingGibbous: 'Gibosa crescente',
        moonPhaseFullMoon: 'Lua cheia',
        moonPhaseWaningGibbous: 'Gibosa minguante',
        moonPhaseLastQuarter: 'Quarto minguante',
        moonPhaseWaningCrescent: 'Minguante',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Sensação',
        chartDewPoint: 'Ponto de orvalho',
        chartCloudCover: 'Nebulosidade',
        chartPrecipChance: 'Prob. precip.',
        chartHumidity: 'Umidade',
        chartPressure: 'Pressão',
        chartPrecipAccum: 'Precip. acum.',
        chartHourlyPrecip: 'Precip. por hora',
        chartWindSpeed: 'Velocidade do vento',
        chartWindGusts: 'Rajadas',

        // Section controls
        dragToReorder: 'Arrastar para reordenar',
        moveUp: 'Mover para cima',
        moveDown: 'Mover para baixo',
        singleColumn: 'Coluna única',
        fullWidth: 'Largura total',
        removeSection: 'Remover seção',
        minimizeSection: 'Minimizar seção',
        hideChart: 'Ocultar gráfico',

        // Radar controls
        refreshRadar: 'Atualizar radar',
        pauseRadar: 'Pausar',
        playRadar: 'Reproduzir',
        // Radar progress / forecast labels
        forecastLabel: 'PREVISÃO',
        radarNow: 'AGORA',
        slowerRadar: 'Mais lento',
        fasterRadar: 'Mais rápido',

        // Show prefix
        showSectionPrefix: 'Mostrar {name}',

        // Tagline
        tagline: 'Clima sem enrolação.',

        // AQI severity
        aqiGood: 'Bom',
        aqiModerate: 'Moderado',
        aqiUnhealthyForSensitive: 'Insalubre para grupos sensíveis',
        aqiUnhealthy: 'Insalubre',
        aqiVeryUnhealthy: 'Muito insalubre',
        aqiHazardous: 'Perigoso',

        // Pollen levels
        pollenLow: 'Baixo',
        pollenLowMed: 'Baixo-Médio',
        pollenMedium: 'Médio',
        pollenHigh: 'Alto',
        pollenVeryHigh: 'Muito alto',

        // Misc
        highTemp: 'Máx',
        lowTemp: 'Mín',

        // Search / errors / aria-labels
        searching: 'Buscando...',
        didYouMean: 'Você quis dizer:',
        locationNotFound: 'Local não encontrado. Tente outra cidade ou CEP.',
        failedToLoadWeather: 'Falha ao carregar os dados do clima. Tente novamente.',
        retry: 'Tentar novamente',
        hide: 'Ocultar',
        close: 'Fechar',
        toggleTheme: 'Alternar modo escuro',
        backToSearch: 'Voltar à busca'
    },

    nl: {
        // UI
        currentConditions: 'Huidige omstandigheden',
        hourlyForecast: 'Verwachting per uur',
        tenDayForecast: '10-daagse verwachting',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Zon',
        moon: 'Maan',
        weatherAlerts: '⚠️ Weerwaarschuwingen',
        translateAlert: 'Vertalen',
        searchPlaceholder: 'Voer stad of postcode in',
        searchButton: 'Zoeken',
        back: '← Terug',
        privacyCookies: 'Privacy',
        about: 'Over ons',
        supportThisSite: 'Steun deze site',
        showMore: 'Meer tonen',
        showLess: 'Minder tonen',
        lockLayout: 'Layout vergrendelen',
        unlockLayout: 'Layout ontgrendelen',
        settings: 'Instellingen',
        restoreDefaultLayout: 'Standaardlayout herstellen',
        seePollenData: 'Bekijk pollengegevens',
        feelsLike: 'Gevoelstemperatuur',
        humidity: 'Luchtvochtigheid',
        dewPoint: 'Dauwpunt',
        wind: 'Wind',
        gusts: 'Windstoten',
        airQuality: 'Luchtkwaliteit',
        uvIndex: 'UV-index',
        nwsRadarLink: 'NWS-radar ↗',
        language: 'Taal',

        // Style names
        style: 'Stijl',
        styleDefault: 'Standaard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Rustig',

        machineTranslationNotice: 'UI-vertalingen zijn automatisch gegenereerd en zijn mogelijk niet perfect.',

        // Settings labels
        settingForecastColors: 'Gekleurde achtergronden tonen in 10-daagse verwachting',
        settingSupportBtn: 'Irritante ondersteuningsknop tonen',
        settingWeatherSummary: 'Weeroverzicht tonen',
        settingThemeToggle: 'Lichte / Donkere modus-knop tonen',
        settingUnitsBtn: '°C / °F-knop tonen',
        settingTimeBtn: '12U / 24U-knop tonen',
        settingLockBtn: 'Vergrendel- / Ontgrendelknop tonen',
        settingNwsLink: 'NWS-radarlink tonen',
        settingShowSectionButtons: '"Sectie tonen"-knoppen tonen wanneer secties verborgen zijn',
        settingTranslateLink: 'Vertaallink voor waarschuwingen tonen',
        settingAutoPlayRadar: 'Radar altijd automatisch afspelen',
        settingRememberCity: 'Laatste stad onthouden',
        cityPageTitle: 'Weer {city} zonder reclame',
        cityPageSeoBlurb: 'Weersverwachting voor {city} zonder reclame, cookies of tracking. Open-Meteo-data, 10-daagse verwachting, uurlijkse omstandigheden en radar — alles gratis.',
        cityPageHideBlurb: 'klik hier om te verbergen',

        // Weather codes
        wc0: 'Heldere hemel',
        wc1: 'Overwegend helder',
        wc2: 'Gedeeltelijk bewolkt',
        wc3: 'Bewolkt',
        wc45: 'Mistig',
        wc48: 'Aanvriezende mist',
        wc51: 'Lichte motregen',
        wc53: 'Matige motregen',
        wc55: 'Dichte motregen',
        wc61: 'Lichte regen',
        wc63: 'Matige regen',
        wc65: 'Zware regen',
        wc71: 'Lichte sneeuw',
        wc73: 'Matige sneeuw',
        wc75: 'Zware sneeuw',
        wc77: 'Sneeuwkorrels',
        wc80: 'Lichte regenbuien',
        wc81: 'Matige regenbuien',
        wc82: 'Hevige regenbuien',
        wc85: 'Lichte sneeuwbuien',
        wc86: 'Zware sneeuwbuien',
        wc95: 'Onweer',
        wc96: 'Onweer met lichte hagel',
        wc99: 'Onweer met zware hagel',
        wcUnknown: 'Onbekend',

        // Temp adjectives
        sumTempFreezing: 'Het vriest',
        sumTempCold: 'Het is koud',
        sumTempCool: 'Het is fris',
        sumTempMild: 'Het is',
        sumTempWarm: 'Het is warm',
        sumTempHot: 'Het is heet',

        // Opening template
        sumOpeningTemplate: '{tempAdj} bij {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (voelt als {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' met onweer',
        sumConditionSnowing: ' en het sneeuwt',
        sumConditionRaining: ' en het regent',
        sumConditionRainingWithAmount: ' en het regent (vandaag {amount} verwacht)',
        sumConditionRainingWithAmountClearingBy: ' en het regent (vandaag {amount} verwacht), opklaringen rond {hour}',
        sumConditionRainSoon: ' met regen zeer binnenkort verwacht',
        sumConditionRainLikelyAround: ' met regen waarschijnlijk rond {hour}',
        sumConditionClearSkies: ' met heldere hemel',
        sumConditionCloudy: ' en bewolkt',

        // Follow-up sentences
        sumTodayHigh: 'Maximum van {high}{unit} vandaag',
        sumTomorrowRainWithAmount: 'Regen verwacht morgen ({amount})',
        sumTomorrowSnowWithAmount: 'Sneeuw verwacht morgen ({amount})',
        sumTomorrowRainNoAmount: 'Regen verwacht morgen',
        sumTomorrowWarming: 'opwarmend tot {high}{unit} morgen',
        sumTomorrowCooling: 'afkoelend tot {high}{unit} morgen',

        // UV Index levels
        uvLow: '(Laag)',
        uvModerate: '(Gematigd)',
        uvHigh: '(Hoog)',
        uvVeryHigh: '(Zeer hoog)',
        uvExtreme: '(Extreem)',

        // Loading / unavailable messages
        loading: 'Laden...',
        loadingRadar: 'Radar laden...',
        refreshingRadar: 'Radar verversen...',
        radarUnavailable: 'Radar niet beschikbaar',
        pollenDataUnavailable: 'Pollengegevens niet beschikbaar voor deze locatie',

        // Astronomy labels
        sunrise: 'Zonsopkomst',
        sunset: 'Zonsondergang',
        solarNoon: 'Zonnehoogtepunt',
        moonrise: 'Maansopkomst',
        moonset: 'Maansondergang',
        phase: 'Fase',

        // Moon phase names
        moonPhaseNewMoon: 'Nieuwe maan',
        moonPhaseWaxingCrescent: 'Wassende maansikkel',
        moonPhaseFirstQuarter: 'Eerste kwartier',
        moonPhaseWaxingGibbous: 'Wassende maan',
        moonPhaseFullMoon: 'Volle maan',
        moonPhaseWaningGibbous: 'Afnemende maan',
        moonPhaseLastQuarter: 'Laatste kwartier',
        moonPhaseWaningCrescent: 'Afnemende maansikkel',

        // Chart legends
        chartTemperature: 'Temperatuur',
        chartFeelsLike: 'Gevoelstemperatuur',
        chartDewPoint: 'Dauwpunt',
        chartCloudCover: 'Bewolking',
        chartPrecipChance: 'Neerslagkans',
        chartHumidity: 'Luchtvochtigheid',
        chartPressure: 'Luchtdruk',
        chartPrecipAccum: 'Neerslag totaal',
        chartHourlyPrecip: 'Neerslag per uur',
        chartWindSpeed: 'Windsnelheid',
        chartWindGusts: 'Windstoten',

        // Section controls
        dragToReorder: 'Slepen om te herschikken',
        moveUp: 'Omhoog',
        moveDown: 'Omlaag',
        singleColumn: 'Eén kolom',
        fullWidth: 'Volle breedte',
        removeSection: 'Sectie verwijderen',
        minimizeSection: 'Sectie minimaliseren',
        hideChart: 'Grafiek verbergen',

        // Radar controls
        refreshRadar: 'Radar verversen',
        pauseRadar: 'Pauze',
        playRadar: 'Afspelen',
        // Radar progress / forecast labels
        forecastLabel: 'VOORSPELLING',
        radarNow: 'NU',
        slowerRadar: 'Langzamer',
        fasterRadar: 'Sneller',

        // Show prefix
        showSectionPrefix: '{name} tonen',

        // Tagline
        tagline: 'Weer zonder rommel.',

        // AQI severity
        aqiGood: 'Goed',
        aqiModerate: 'Matig',
        aqiUnhealthyForSensitive: 'Ongezond voor gevoelige groepen',
        aqiUnhealthy: 'Ongezond',
        aqiVeryUnhealthy: 'Zeer ongezond',
        aqiHazardous: 'Gevaarlijk',

        // Pollen levels
        pollenLow: 'Laag',
        pollenLowMed: 'Laag-Middel',
        pollenMedium: 'Middel',
        pollenHigh: 'Hoog',
        pollenVeryHigh: 'Zeer hoog',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Zoeken...',
        didYouMean: 'Bedoelde je:',
        locationNotFound: 'Locatie niet gevonden. Probeer een andere stad of postcode.',
        failedToLoadWeather: 'Kan weergegevens niet laden. Probeer het opnieuw.',
        retry: 'Opnieuw',
        hide: 'Verbergen',
        close: 'Sluiten',
        toggleTheme: 'Donkere modus wisselen',
        backToSearch: 'Terug naar zoeken'
    },

    pl: {
        // UI
        currentConditions: 'Aktualne warunki',
        hourlyForecast: 'Prognoza godzinowa',
        tenDayForecast: 'Prognoza 10-dniowa',
        radar: 'Radar',
        pollen: 'Pyłki',
        sun: 'Słońce',
        moon: 'Księżyc',
        weatherAlerts: '⚠️ Ostrzeżenia pogodowe',
        translateAlert: 'Przetłumacz',
        searchPlaceholder: 'Wpisz miasto lub kod pocztowy',
        searchButton: 'Szukaj',
        back: '← Wstecz',
        privacyCookies: 'Prywatność',
        about: 'O nas',
        supportThisSite: 'Wesprzyj tę stronę',
        showMore: 'Pokaż więcej',
        showLess: 'Pokaż mniej',
        lockLayout: 'Zablokuj układ',
        unlockLayout: 'Odblokuj układ',
        settings: 'Ustawienia',
        restoreDefaultLayout: 'Przywróć domyślny układ',
        seePollenData: 'Zobacz dane o pyłkach',
        feelsLike: 'Odczuwalna',
        humidity: 'Wilgotność',
        dewPoint: 'Punkt rosy',
        wind: 'Wiatr',
        gusts: 'Porywy',
        airQuality: 'Jakość powietrza',
        uvIndex: 'Indeks UV',
        nwsRadarLink: 'Radar NWS ↗',
        language: 'Język',

        // Style names
        style: 'Styl',
        styleDefault: 'Domyślny',
        styleEditorial: 'Edytorski',
        styleBulletin: 'Biuletyn',
        styleQuiet: 'Spokojny',

        machineTranslationNotice: 'Tłumaczenia interfejsu są generowane maszynowo i mogą nie być idealne.',

        // Settings labels
        settingForecastColors: 'Pokaż kolorowe tła w prognozie 10-dniowej',
        settingSupportBtn: 'Pokaż irytujący przycisk wsparcia',
        settingWeatherSummary: 'Pokaż podsumowanie pogody',
        settingThemeToggle: 'Pokaż przycisk Tryb jasny / Tryb ciemny',
        settingUnitsBtn: 'Pokaż przycisk °C / °F',
        settingTimeBtn: 'Pokaż przycisk 12H / 24H',
        settingLockBtn: 'Pokaż przycisk Zablokuj / Odblokuj',
        settingNwsLink: 'Pokaż link do radaru NWS',
        settingShowSectionButtons: 'Pokaż przyciski "Pokaż sekcję", gdy sekcje są ukryte',
        settingTranslateLink: 'Pokaż link do tłumaczenia ostrzeżeń',
        settingAutoPlayRadar: 'Zawsze automatycznie odtwarzaj radar',
        settingRememberCity: 'Zapamiętaj ostatnie miasto',
        cityPageTitle: 'Pogoda {city} bez reklam',
        cityPageSeoBlurb: 'Prognoza pogody dla {city} bez reklam, plików cookie ani śledzenia. Dane Open-Meteo, 10-dniowa prognoza, warunki godzinowe i radar — wszystko za darmo.',
        cityPageHideBlurb: 'kliknij tutaj, aby ukryć',

        // Weather codes
        wc0: 'Bezchmurnie',
        wc1: 'Głównie bezchmurnie',
        wc2: 'Częściowe zachmurzenie',
        wc3: 'Zachmurzenie całkowite',
        wc45: 'Mgła',
        wc48: 'Mgła osadzająca szadź',
        wc51: 'Lekka mżawka',
        wc53: 'Umiarkowana mżawka',
        wc55: 'Gęsta mżawka',
        wc61: 'Lekki deszcz',
        wc63: 'Umiarkowany deszcz',
        wc65: 'Silny deszcz',
        wc71: 'Lekki śnieg',
        wc73: 'Umiarkowany śnieg',
        wc75: 'Silny śnieg',
        wc77: 'Krupy śnieżne',
        wc80: 'Lekkie przelotne deszcze',
        wc81: 'Umiarkowane przelotne deszcze',
        wc82: 'Gwałtowne przelotne deszcze',
        wc85: 'Lekkie przelotne opady śniegu',
        wc86: 'Silne przelotne opady śniegu',
        wc95: 'Burza',
        wc96: 'Burza z lekkim gradem',
        wc99: 'Burza z silnym gradem',
        wcUnknown: 'Nieznane',

        // Temp adjectives
        sumTempFreezing: 'Jest mróz',
        sumTempCold: 'Jest zimno',
        sumTempCool: 'Jest chłodno',
        sumTempMild: 'Jest',
        sumTempWarm: 'Jest ciepło',
        sumTempHot: 'Jest gorąco',

        // Opening template
        sumOpeningTemplate: '{tempAdj} przy {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (odczuwalna {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' z burzami',
        sumConditionSnowing: ' i pada śnieg',
        sumConditionRaining: ' i pada deszcz',
        sumConditionRainingWithAmount: ' i pada deszcz (dziś spodziewane {amount})',
        sumConditionRainingWithAmountClearingBy: ' i pada deszcz (dziś spodziewane {amount}), przejaśnienia około {hour}',
        sumConditionRainSoon: ' z deszczem spodziewanym bardzo wkrótce',
        sumConditionRainLikelyAround: ' z prawdopodobnym deszczem około {hour}',
        sumConditionClearSkies: ' z bezchmurnym niebem',
        sumConditionCloudy: ' i pochmurno',

        // Follow-up sentences
        sumTodayHigh: 'Maksymalna dzisiaj {high}{unit}',
        sumTomorrowRainWithAmount: 'Jutro spodziewany deszcz ({amount})',
        sumTomorrowSnowWithAmount: 'Jutro spodziewany śnieg ({amount})',
        sumTomorrowRainNoAmount: 'Jutro spodziewany deszcz',
        sumTomorrowWarming: 'ocieplenie do {high}{unit} jutro',
        sumTomorrowCooling: 'ochłodzenie do {high}{unit} jutro',

        // UV Index levels
        uvLow: '(Niski)',
        uvModerate: '(Umiarkowany)',
        uvHigh: '(Wysoki)',
        uvVeryHigh: '(Bardzo wysoki)',
        uvExtreme: '(Ekstremalny)',

        // Loading / unavailable messages
        loading: 'Ładowanie...',
        loadingRadar: 'Ładowanie radaru...',
        refreshingRadar: 'Odświeżanie radaru...',
        radarUnavailable: 'Radar niedostępny',
        pollenDataUnavailable: 'Dane o pyłkach niedostępne dla tej lokalizacji',

        // Astronomy labels
        sunrise: 'Wschód słońca',
        sunset: 'Zachód słońca',
        solarNoon: 'Południe słoneczne',
        moonrise: 'Wschód księżyca',
        moonset: 'Zachód księżyca',
        phase: 'Faza',

        // Moon phase names
        moonPhaseNewMoon: 'Nów',
        moonPhaseWaxingCrescent: 'Przybywający sierp',
        moonPhaseFirstQuarter: 'Pierwsza kwadra',
        moonPhaseWaxingGibbous: 'Przybywający garb',
        moonPhaseFullMoon: 'Pełnia',
        moonPhaseWaningGibbous: 'Ubywający garb',
        moonPhaseLastQuarter: 'Ostatnia kwadra',
        moonPhaseWaningCrescent: 'Ubywający sierp',

        // Chart legends
        chartTemperature: 'Temperatura',
        chartFeelsLike: 'Odczuwalna',
        chartDewPoint: 'Punkt rosy',
        chartCloudCover: 'Zachmurzenie',
        chartPrecipChance: 'Szansa opadów',
        chartHumidity: 'Wilgotność',
        chartPressure: 'Ciśnienie',
        chartPrecipAccum: 'Suma opadów',
        chartHourlyPrecip: 'Opady godz.',
        chartWindSpeed: 'Prędkość wiatru',
        chartWindGusts: 'Porywy',

        // Section controls
        dragToReorder: 'Przeciągnij, aby zmienić kolejność',
        moveUp: 'Przesuń w górę',
        moveDown: 'Przesuń w dół',
        singleColumn: 'Jedna kolumna',
        fullWidth: 'Pełna szerokość',
        removeSection: 'Usuń sekcję',
        minimizeSection: 'Zminimalizuj sekcję',
        hideChart: 'Ukryj wykres',

        // Radar controls
        refreshRadar: 'Odśwież radar',
        pauseRadar: 'Pauza',
        playRadar: 'Odtwórz',
        // Radar progress / forecast labels
        forecastLabel: 'PROGNOZA',
        radarNow: 'TERAZ',
        slowerRadar: 'Wolniej',
        fasterRadar: 'Szybciej',

        // Show prefix
        showSectionPrefix: 'Pokaż {name}',

        // Tagline
        tagline: 'Pogoda bez zbędnego hałasu.',

        // AQI severity
        aqiGood: 'Dobra',
        aqiModerate: 'Umiarkowana',
        aqiUnhealthyForSensitive: 'Niezdrowa dla wrażliwych grup',
        aqiUnhealthy: 'Niezdrowa',
        aqiVeryUnhealthy: 'Bardzo niezdrowa',
        aqiHazardous: 'Niebezpieczna',

        // Pollen levels
        pollenLow: 'Niski',
        pollenLowMed: 'Niski-Średni',
        pollenMedium: 'Średni',
        pollenHigh: 'Wysoki',
        pollenVeryHigh: 'Bardzo wysoki',

        // Misc
        highTemp: 'Maks',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Szukam...',
        didYouMean: 'Czy chodziło Ci o:',
        locationNotFound: 'Nie znaleziono lokalizacji. Spróbuj innego miasta lub kodu pocztowego.',
        failedToLoadWeather: 'Nie udało się załadować danych pogodowych. Spróbuj ponownie.',
        retry: 'Ponów',
        hide: 'Ukryj',
        close: 'Zamknij',
        toggleTheme: 'Przełącz tryb ciemny',
        backToSearch: 'Powrót do wyszukiwania'
    },

    sv: {
        // UI
        currentConditions: 'Aktuella förhållanden',
        hourlyForecast: 'Timprognos',
        tenDayForecast: '10-dagarsprognos',
        radar: 'Radar',
        pollen: 'Pollen',
        sun: 'Sol',
        moon: 'Måne',
        weatherAlerts: '⚠️ Vädervarningar',
        translateAlert: 'Översätt',
        searchPlaceholder: 'Ange stad eller postnummer',
        searchButton: 'Sök',
        back: '← Tillbaka',
        privacyCookies: 'Integritet',
        about: 'Om',
        supportThisSite: 'Stöd denna sida',
        showMore: 'Visa mer',
        showLess: 'Visa mindre',
        lockLayout: 'Lås layout',
        unlockLayout: 'Lås upp layout',
        settings: 'Inställningar',
        restoreDefaultLayout: 'Återställ standardlayout',
        seePollenData: 'Se pollendata',
        feelsLike: 'Känns som',
        humidity: 'Luftfuktighet',
        dewPoint: 'Daggpunkt',
        wind: 'Vind',
        gusts: 'Vindbyar',
        airQuality: 'Luftkvalitet',
        uvIndex: 'UV-index',
        nwsRadarLink: 'NWS-radar ↗',
        language: 'Språk',

        // Style names
        style: 'Stil',
        styleDefault: 'Standard',
        styleEditorial: 'Editorial',
        styleBulletin: 'Bulletin',
        styleQuiet: 'Lugn',

        machineTranslationNotice: 'Översättningar av gränssnittet är maskingenererade och kanske inte är perfekta.',

        // Settings labels
        settingForecastColors: 'Visa färgbakgrunder i 10-dagarsprognosen',
        settingSupportBtn: 'Visa irriterande stödknapp',
        settingWeatherSummary: 'Visa vädersammanfattning',
        settingThemeToggle: 'Visa knappen Ljust läge / Mörkt läge',
        settingUnitsBtn: 'Visa knappen °C / °F',
        settingTimeBtn: 'Visa knappen 12H / 24H',
        settingLockBtn: 'Visa knappen Lås / Lås upp',
        settingNwsLink: 'Visa länk till NWS-radar',
        settingShowSectionButtons: 'Visa "Visa sektion"-knappar när sektioner är dolda',
        settingTranslateLink: 'Visa översättningslänk för varningar',
        settingAutoPlayRadar: 'Spela alltid upp radar automatiskt',
        settingRememberCity: 'Kom ihåg senaste stad',
        cityPageTitle: 'Väder {city} utan reklam',
        cityPageSeoBlurb: 'Väderprognos för {city} utan reklam, cookies eller spårning. Open-Meteo-data, 10-dagarsprognos, timvis förhållanden och radar — allt gratis.',
        cityPageHideBlurb: 'klicka här för att dölja',

        // Weather codes
        wc0: 'Klar himmel',
        wc1: 'Huvudsakligen klart',
        wc2: 'Delvis molnigt',
        wc3: 'Mulet',
        wc45: 'Dimma',
        wc48: 'Dimfrost',
        wc51: 'Lätt duggregn',
        wc53: 'Måttligt duggregn',
        wc55: 'Tätt duggregn',
        wc61: 'Lätt regn',
        wc63: 'Måttligt regn',
        wc65: 'Kraftigt regn',
        wc71: 'Lätt snöfall',
        wc73: 'Måttligt snöfall',
        wc75: 'Kraftigt snöfall',
        wc77: 'Snökorn',
        wc80: 'Lätta regnskurar',
        wc81: 'Måttliga regnskurar',
        wc82: 'Häftiga regnskurar',
        wc85: 'Lätta snöbyar',
        wc86: 'Kraftiga snöbyar',
        wc95: 'Åskväder',
        wc96: 'Åskväder med lätt hagel',
        wc99: 'Åskväder med kraftigt hagel',
        wcUnknown: 'Okänt',

        // Temp adjectives
        sumTempFreezing: 'Det är iskallt',
        sumTempCold: 'Det är kallt',
        sumTempCool: 'Det är svalt',
        sumTempMild: 'Det är',
        sumTempWarm: 'Det är varmt',
        sumTempHot: 'Det är hett',

        // Opening template
        sumOpeningTemplate: '{tempAdj} vid {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (känns som {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' med åskväder',
        sumConditionSnowing: ' och snöar',
        sumConditionRaining: ' och regnar',
        sumConditionRainingWithAmount: ' och regnar ({amount} väntas idag)',
        sumConditionRainingWithAmountClearingBy: ' och regnar ({amount} väntas idag), klarnar upp runt {hour}',
        sumConditionRainSoon: ' med regn väntat mycket snart',
        sumConditionRainLikelyAround: ' med troligt regn runt {hour}',
        sumConditionClearSkies: ' med klar himmel',
        sumConditionCloudy: ' och molnigt',

        // Follow-up sentences
        sumTodayHigh: 'Högsta temperatur {high}{unit} idag',
        sumTomorrowRainWithAmount: 'Regn väntas imorgon ({amount})',
        sumTomorrowSnowWithAmount: 'Snö väntas imorgon ({amount})',
        sumTomorrowRainNoAmount: 'Regn väntas imorgon',
        sumTomorrowWarming: 'stiger till {high}{unit} imorgon',
        sumTomorrowCooling: 'sjunker till {high}{unit} imorgon',

        // UV Index levels
        uvLow: '(Låg)',
        uvModerate: '(Måttlig)',
        uvHigh: '(Hög)',
        uvVeryHigh: '(Mycket hög)',
        uvExtreme: '(Extrem)',

        // Loading / unavailable messages
        loading: 'Laddar...',
        loadingRadar: 'Laddar radar...',
        refreshingRadar: 'Uppdaterar radar...',
        radarUnavailable: 'Radar ej tillgänglig',
        pollenDataUnavailable: 'Pollendata ej tillgänglig för denna plats',

        // Astronomy labels
        sunrise: 'Soluppgång',
        sunset: 'Solnedgång',
        solarNoon: 'Solmiddag',
        moonrise: 'Månuppgång',
        moonset: 'Månnedgång',
        phase: 'Fas',

        // Moon phase names
        moonPhaseNewMoon: 'Nymåne',
        moonPhaseWaxingCrescent: 'Växande skära',
        moonPhaseFirstQuarter: 'Första kvarteret',
        moonPhaseWaxingGibbous: 'Växande måne',
        moonPhaseFullMoon: 'Fullmåne',
        moonPhaseWaningGibbous: 'Avtagande måne',
        moonPhaseLastQuarter: 'Sista kvarteret',
        moonPhaseWaningCrescent: 'Avtagande skära',

        // Chart legends
        chartTemperature: 'Temperatur',
        chartFeelsLike: 'Känns som',
        chartDewPoint: 'Daggpunkt',
        chartCloudCover: 'Molnighet',
        chartPrecipChance: 'Nederbörd. chans',
        chartHumidity: 'Luftfuktighet',
        chartPressure: 'Lufttryck',
        chartPrecipAccum: 'Nederbörd tot.',
        chartHourlyPrecip: 'Nederbörd per timme',
        chartWindSpeed: 'Vindhastighet',
        chartWindGusts: 'Vindbyar',

        // Section controls
        dragToReorder: 'Dra för att ordna om',
        moveUp: 'Flytta upp',
        moveDown: 'Flytta ner',
        singleColumn: 'En kolumn',
        fullWidth: 'Full bredd',
        removeSection: 'Ta bort sektion',
        minimizeSection: 'Minimera sektion',
        hideChart: 'Dölj diagram',

        // Radar controls
        refreshRadar: 'Uppdatera radar',
        pauseRadar: 'Pausa',
        playRadar: 'Spela',
        // Radar progress / forecast labels
        forecastLabel: 'PROGNOS',
        radarNow: 'NU',
        slowerRadar: 'Långsammare',
        fasterRadar: 'Snabbare',

        // Show prefix
        showSectionPrefix: 'Visa {name}',

        // Tagline
        tagline: 'Väder utan krångel.',

        // AQI severity
        aqiGood: 'Bra',
        aqiModerate: 'Måttlig',
        aqiUnhealthyForSensitive: 'Ohälsosam för känsliga grupper',
        aqiUnhealthy: 'Ohälsosam',
        aqiVeryUnhealthy: 'Mycket ohälsosam',
        aqiHazardous: 'Farlig',

        // Pollen levels
        pollenLow: 'Låg',
        pollenLowMed: 'Låg-Medium',
        pollenMedium: 'Medium',
        pollenHigh: 'Hög',
        pollenVeryHigh: 'Mycket hög',

        // Misc
        highTemp: 'Max',
        lowTemp: 'Min',

        // Search / errors / aria-labels
        searching: 'Söker...',
        didYouMean: 'Menade du:',
        locationNotFound: 'Plats hittades inte. Försök med en annan stad eller postnummer.',
        failedToLoadWeather: 'Det gick inte att läsa in väderdata. Försök igen.',
        retry: 'Försök igen',
        hide: 'Dölj',
        close: 'Stäng',
        toggleTheme: 'Växla mörkt läge',
        backToSearch: 'Tillbaka till sökning'
    },

    ru: {
        // UI
        currentConditions: 'Текущие условия',
        hourlyForecast: 'Почасовой прогноз',
        tenDayForecast: 'Прогноз на 10 дней',
        radar: 'Радар',
        pollen: 'Пыльца',
        sun: 'Солнце',
        moon: 'Луна',
        weatherAlerts: '⚠️ Погодные предупреждения',
        translateAlert: 'Перевести',
        searchPlaceholder: 'Введите город или почтовый индекс',
        searchButton: 'Поиск',
        back: '← Назад',
        privacyCookies: 'Конфиденциальность',
        about: 'О сайте',
        supportThisSite: 'Поддержать сайт',
        showMore: 'Показать больше',
        showLess: 'Показать меньше',
        lockLayout: 'Заблокировать макет',
        unlockLayout: 'Разблокировать макет',
        settings: 'Настройки',
        restoreDefaultLayout: 'Восстановить макет по умолчанию',
        seePollenData: 'Посмотреть данные о пыльце',
        feelsLike: 'Ощущается как',
        humidity: 'Влажность',
        dewPoint: 'Точка росы',
        wind: 'Ветер',
        gusts: 'Порывы',
        airQuality: 'Качество воздуха',
        uvIndex: 'УФ-индекс',
        nwsRadarLink: 'Радар NWS ↗',
        language: 'Язык',

        // Style names
        style: 'Стиль',
        styleDefault: 'По умолчанию',
        styleEditorial: 'Журнальный',
        styleBulletin: 'Бюллетень',
        styleQuiet: 'Тихий',

        machineTranslationNotice: 'Переводы интерфейса сгенерированы автоматически и могут быть неидеальными.',

        // Settings labels
        settingForecastColors: 'Показывать цветной фон в 10-дневном прогнозе',
        settingSupportBtn: 'Показывать назойливую кнопку поддержки',
        settingWeatherSummary: 'Показывать сводку погоды',
        settingThemeToggle: 'Показывать кнопку Светлый / Тёмный режим',
        settingUnitsBtn: 'Показывать кнопку °C / °F',
        settingTimeBtn: 'Показывать кнопку 12H / 24H',
        settingLockBtn: 'Показывать кнопку Заблокировать / Разблокировать',
        settingNwsLink: 'Показывать ссылку на радар NWS',
        settingShowSectionButtons: 'Показывать кнопки "Показать раздел", когда разделы скрыты',
        settingTranslateLink: 'Показывать ссылку для перевода предупреждений',
        settingAutoPlayRadar: 'Всегда воспроизводить радар автоматически',
        settingRememberCity: 'Запомнить последний город',
        cityPageTitle: 'Погода {city} без рекламы',
        cityPageSeoBlurb: 'Прогноз погоды для {city} без рекламы, cookies и отслеживания. Данные Open-Meteo, прогноз на 10 дней, почасовые условия и радар — всё бесплатно.',
        cityPageHideBlurb: 'нажмите здесь, чтобы скрыть',

        // Weather codes
        wc0: 'Ясное небо',
        wc1: 'Преимущественно ясно',
        wc2: 'Переменная облачность',
        wc3: 'Пасмурно',
        wc45: 'Туман',
        wc48: 'Изморозь',
        wc51: 'Лёгкая морось',
        wc53: 'Умеренная морось',
        wc55: 'Сильная морось',
        wc61: 'Слабый дождь',
        wc63: 'Умеренный дождь',
        wc65: 'Сильный дождь',
        wc71: 'Слабый снег',
        wc73: 'Умеренный снег',
        wc75: 'Сильный снег',
        wc77: 'Снежная крупа',
        wc80: 'Слабые ливни',
        wc81: 'Умеренные ливни',
        wc82: 'Сильные ливни',
        wc85: 'Слабые снежные заряды',
        wc86: 'Сильные снежные заряды',
        wc95: 'Гроза',
        wc96: 'Гроза с мелким градом',
        wc99: 'Гроза с крупным градом',
        wcUnknown: 'Неизвестно',

        // Temp adjectives
        sumTempFreezing: 'Морозно',
        sumTempCold: 'Холодно',
        sumTempCool: 'Прохладно',
        sumTempMild: 'Сейчас',
        sumTempWarm: 'Тепло',
        sumTempHot: 'Жарко',

        // Opening template
        sumOpeningTemplate: '{tempAdj} при {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (ощущается как {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' с грозами',
        sumConditionSnowing: ' и идёт снег',
        sumConditionRaining: ' и идёт дождь',
        sumConditionRainingWithAmount: ' и идёт дождь (сегодня ожидается {amount})',
        sumConditionRainingWithAmountClearingBy: ' и идёт дождь (сегодня ожидается {amount}), прояснение около {hour}',
        sumConditionRainSoon: ' с дождём, ожидаемым очень скоро',
        sumConditionRainLikelyAround: ' с вероятным дождём около {hour}',
        sumConditionClearSkies: ' с ясным небом',
        sumConditionCloudy: ' и облачно',

        // Follow-up sentences
        sumTodayHigh: 'Максимум {high}{unit} сегодня',
        sumTomorrowRainWithAmount: 'Завтра ожидается дождь ({amount})',
        sumTomorrowSnowWithAmount: 'Завтра ожидается снег ({amount})',
        sumTomorrowRainNoAmount: 'Завтра ожидается дождь',
        sumTomorrowWarming: 'потепление до {high}{unit} завтра',
        sumTomorrowCooling: 'похолодание до {high}{unit} завтра',

        // UV Index levels
        uvLow: '(Низкий)',
        uvModerate: '(Умеренный)',
        uvHigh: '(Высокий)',
        uvVeryHigh: '(Очень высокий)',
        uvExtreme: '(Экстремальный)',

        // Loading / unavailable messages
        loading: 'Загрузка...',
        loadingRadar: 'Загрузка радара...',
        refreshingRadar: 'Обновление радара...',
        radarUnavailable: 'Радар недоступен',
        pollenDataUnavailable: 'Данные о пыльце недоступны для этого места',

        // Astronomy labels
        sunrise: 'Восход',
        sunset: 'Закат',
        solarNoon: 'Солнечный полдень',
        moonrise: 'Восход луны',
        moonset: 'Заход луны',
        phase: 'Фаза',

        // Moon phase names
        moonPhaseNewMoon: 'Новолуние',
        moonPhaseWaxingCrescent: 'Молодая луна',
        moonPhaseFirstQuarter: 'Первая четверть',
        moonPhaseWaxingGibbous: 'Растущая луна',
        moonPhaseFullMoon: 'Полнолуние',
        moonPhaseWaningGibbous: 'Убывающая луна',
        moonPhaseLastQuarter: 'Последняя четверть',
        moonPhaseWaningCrescent: 'Старая луна',

        // Chart legends
        chartTemperature: 'Температура',
        chartFeelsLike: 'Ощущается',
        chartDewPoint: 'Точка росы',
        chartCloudCover: 'Облачность',
        chartPrecipChance: 'Вероятн. осадков',
        chartHumidity: 'Влажность',
        chartPressure: 'Давление',
        chartPrecipAccum: 'Сумма осадков',
        chartHourlyPrecip: 'Осадки за час',
        chartWindSpeed: 'Скорость ветра',
        chartWindGusts: 'Порывы',

        // Section controls
        dragToReorder: 'Перетащите для перестановки',
        moveUp: 'Переместить вверх',
        moveDown: 'Переместить вниз',
        singleColumn: 'Одна колонка',
        fullWidth: 'На всю ширину',
        removeSection: 'Удалить раздел',
        minimizeSection: 'Свернуть раздел',
        hideChart: 'Скрыть график',

        // Radar controls
        refreshRadar: 'Обновить радар',
        pauseRadar: 'Пауза',
        playRadar: 'Воспроизвести',
        // Radar progress / forecast labels
        forecastLabel: 'ПРОГНОЗ',
        radarNow: 'СЕЙЧАС',
        slowerRadar: 'Медленнее',
        fasterRadar: 'Быстрее',

        // Show prefix
        showSectionPrefix: 'Показать {name}',

        // Tagline
        tagline: 'Погода без лишнего шума.',

        // AQI severity
        aqiGood: 'Хорошее',
        aqiModerate: 'Умеренное',
        aqiUnhealthyForSensitive: 'Нездоровое для чувствительных групп',
        aqiUnhealthy: 'Нездоровое',
        aqiVeryUnhealthy: 'Очень нездоровое',
        aqiHazardous: 'Опасное',

        // Pollen levels
        pollenLow: 'Низкий',
        pollenLowMed: 'Низкий-Средний',
        pollenMedium: 'Средний',
        pollenHigh: 'Высокий',
        pollenVeryHigh: 'Очень высокий',

        // Misc
        highTemp: 'Макс',
        lowTemp: 'Мин',

        // Search / errors / aria-labels
        searching: 'Поиск...',
        didYouMean: 'Возможно, вы имели в виду:',
        locationNotFound: 'Местоположение не найдено. Попробуйте другой город или почтовый индекс.',
        failedToLoadWeather: 'Не удалось загрузить данные о погоде. Попробуйте снова.',
        retry: 'Повторить',
        hide: 'Скрыть',
        close: 'Закрыть',
        toggleTheme: 'Переключить тёмный режим',
        backToSearch: 'Назад к поиску'
    },

    ja: {
        // UI
        currentConditions: '現在の状況',
        hourlyForecast: '1時間ごとの予報',
        tenDayForecast: '10日間予報',
        radar: 'レーダー',
        pollen: '花粉',
        sun: '日の出・日の入',
        moon: '月',
        weatherAlerts: '⚠️ 気象警報',
        translateAlert: '翻訳',
        searchPlaceholder: '都市名または郵便番号を入力',
        searchButton: '検索',
        back: '← 戻る',
        privacyCookies: 'プライバシー',
        about: '概要',
        supportThisSite: 'このサイトを応援する',
        showMore: 'もっと見る',
        showLess: '折りたたむ',
        lockLayout: 'レイアウトをロック',
        unlockLayout: 'レイアウトのロック解除',
        settings: '設定',
        restoreDefaultLayout: 'デフォルトのレイアウトに戻す',
        seePollenData: '花粉データを見る',
        feelsLike: '体感温度',
        humidity: '湿度',
        dewPoint: '露点',
        wind: '風',
        gusts: '突風',
        airQuality: '大気質',
        uvIndex: '紫外線指数',
        nwsRadarLink: 'NWSレーダー ↗',
        language: '言語',

        // Style names
        style: 'スタイル',
        styleDefault: 'デフォルト',
        styleEditorial: 'エディトリアル',
        styleBulletin: '速報',
        styleQuiet: '静か',

        machineTranslationNotice: 'UI翻訳は機械生成のため、完璧ではない場合があります。',

        // Settings labels
        settingForecastColors: '10日間予報に色付き背景を表示',
        settingSupportBtn: '目立つ応援ボタンを表示',
        settingWeatherSummary: '天気の概要を表示',
        settingThemeToggle: 'ライトモード / ダークモードのボタンを表示',
        settingUnitsBtn: '°C / °F ボタンを表示',
        settingTimeBtn: '12時間 / 24時間 ボタンを表示',
        settingLockBtn: 'ロック / ロック解除ボタンを表示',
        settingNwsLink: 'NWSレーダーリンクを表示',
        settingShowSectionButtons: 'セクションが非表示のときに「セクションを表示」ボタンを表示',
        settingTranslateLink: '警報の翻訳リンクを表示',
        settingAutoPlayRadar: 'レーダーを常に自動再生',
        settingRememberCity: '前回の都市を記憶',
        cityPageTitle: '{city} 天気 広告なし',
        cityPageSeoBlurb: '{city}の天気予報を広告、Cookie、トラッキングなしで。Open-Meteoデータ、10日間予報、時間ごとの状況、レーダー — すべて無料。',
        cityPageHideBlurb: 'ここをクリックして非表示',

        // Weather codes
        wc0: '快晴',
        wc1: 'ほぼ晴れ',
        wc2: '晴れ時々曇り',
        wc3: '曇り',
        wc45: '霧',
        wc48: '樹氷性の霧',
        wc51: '弱い霧雨',
        wc53: '中程度の霧雨',
        wc55: '濃い霧雨',
        wc61: '弱い雨',
        wc63: '中程度の雨',
        wc65: '強い雨',
        wc71: '弱い雪',
        wc73: '中程度の雪',
        wc75: '強い雪',
        wc77: '霧雪',
        wc80: '弱いにわか雨',
        wc81: '中程度のにわか雨',
        wc82: '激しいにわか雨',
        wc85: '弱いにわか雪',
        wc86: '強いにわか雪',
        wc95: '雷雨',
        wc96: '弱いひょうを伴う雷雨',
        wc99: '強いひょうを伴う雷雨',
        wcUnknown: '不明',

        // Temp adjectives
        sumTempFreezing: '凍えるほど寒いです',
        sumTempCold: '寒いです',
        sumTempCool: '涼しいです',
        sumTempMild: '気温は',
        sumTempWarm: '暖かいです',
        sumTempHot: '暑いです',

        // Opening template
        sumOpeningTemplate: '{tempAdj}。気温は{temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: '（体感{feelsLike}{unit}）',

        // Condition clauses
        sumConditionThunderstorms: '、雷雨があります',
        sumConditionSnowing: '、雪が降っています',
        sumConditionRaining: '、雨が降っています',
        sumConditionRainingWithAmount: '、雨が降っています（本日{amount}の予想）',
        sumConditionRainingWithAmountClearingBy: '、雨が降っています（本日{amount}の予想）。{hour}頃に晴れます',
        sumConditionRainSoon: '、まもなく雨が予想されます',
        sumConditionRainLikelyAround: '、{hour}頃に雨の可能性があります',
        sumConditionClearSkies: '、空は晴れています',
        sumConditionCloudy: '、曇っています',

        // Follow-up sentences
        sumTodayHigh: '今日の最高気温は{high}{unit}',
        sumTomorrowRainWithAmount: '明日は雨の予報です（{amount}）',
        sumTomorrowSnowWithAmount: '明日は雪の予報です（{amount}）',
        sumTomorrowRainNoAmount: '明日は雨の予報です',
        sumTomorrowWarming: '明日は{high}{unit}まで上昇',
        sumTomorrowCooling: '明日は{high}{unit}まで低下',

        // UV Index levels
        uvLow: '（弱い）',
        uvModerate: '（中程度）',
        uvHigh: '（強い）',
        uvVeryHigh: '（非常に強い）',
        uvExtreme: '（極端）',

        // Loading / unavailable messages
        loading: '読み込み中...',
        loadingRadar: 'レーダー読み込み中...',
        refreshingRadar: 'レーダー更新中...',
        radarUnavailable: 'レーダー利用不可',
        pollenDataUnavailable: 'この地域の花粉データは利用できません',

        // Astronomy labels
        sunrise: '日の出',
        sunset: '日の入',
        solarNoon: '南中時刻',
        moonrise: '月の出',
        moonset: '月の入',
        phase: '月相',

        // Moon phase names
        moonPhaseNewMoon: '新月',
        moonPhaseWaxingCrescent: '三日月',
        moonPhaseFirstQuarter: '上弦の月',
        moonPhaseWaxingGibbous: '十三夜月',
        moonPhaseFullMoon: '満月',
        moonPhaseWaningGibbous: '十六夜月',
        moonPhaseLastQuarter: '下弦の月',
        moonPhaseWaningCrescent: '有明月',

        // Chart legends
        chartTemperature: '気温',
        chartFeelsLike: '体感温度',
        chartDewPoint: '露点',
        chartCloudCover: '雲量',
        chartPrecipChance: '降水確率',
        chartHumidity: '湿度',
        chartPressure: '気圧',
        chartPrecipAccum: '累積降水量',
        chartHourlyPrecip: '時間降水量',
        chartWindSpeed: '風速',
        chartWindGusts: '突風',

        // Section controls
        dragToReorder: 'ドラッグして並べ替え',
        moveUp: '上へ移動',
        moveDown: '下へ移動',
        singleColumn: '1列',
        fullWidth: '全幅',
        removeSection: 'セクションを削除',
        minimizeSection: 'セクションを最小化',
        hideChart: 'グラフを非表示',

        // Radar controls
        refreshRadar: 'レーダーを更新',
        pauseRadar: '一時停止',
        playRadar: '再生',
        // Radar progress / forecast labels
        forecastLabel: '予測',
        radarNow: '現在',
        slowerRadar: '遅く',
        fasterRadar: '速く',

        // Show prefix
        showSectionPrefix: '{name}を表示',

        // Tagline
        tagline: 'シンプルな天気予報。',

        // AQI severity
        aqiGood: '良好',
        aqiModerate: '普通',
        aqiUnhealthyForSensitive: '敏感な人に不健康',
        aqiUnhealthy: '不健康',
        aqiVeryUnhealthy: '非常に不健康',
        aqiHazardous: '危険',

        // Pollen levels
        pollenLow: '低い',
        pollenLowMed: '低-中',
        pollenMedium: '中程度',
        pollenHigh: '高い',
        pollenVeryHigh: '非常に高い',

        // Misc
        highTemp: '最高',
        lowTemp: '最低',

        // Search / errors / aria-labels
        searching: '検索中...',
        didYouMean: 'もしかして：',
        locationNotFound: '場所が見つかりません。別の都市または郵便番号をお試しください。',
        failedToLoadWeather: '天気データの読み込みに失敗しました。もう一度お試しください。',
        retry: '再試行',
        hide: '非表示',
        close: '閉じる',
        toggleTheme: 'ダークモード切替',
        backToSearch: '検索に戻る'
    },

    zh: {
        // UI
        currentConditions: '当前天气',
        hourlyForecast: '每小时预报',
        tenDayForecast: '10天预报',
        radar: '雷达',
        pollen: '花粉',
        sun: '日出日落',
        moon: '月相',
        weatherAlerts: '⚠️ 天气警报',
        translateAlert: '翻译',
        searchPlaceholder: '输入城市或邮政编码',
        searchButton: '搜索',
        back: '← 返回',
        privacyCookies: '隐私',
        about: '关于',
        supportThisSite: '支持本站',
        showMore: '显示更多',
        showLess: '收起',
        lockLayout: '锁定布局',
        unlockLayout: '解锁布局',
        settings: '设置',
        restoreDefaultLayout: '恢复默认布局',
        seePollenData: '查看花粉数据',
        feelsLike: '体感温度',
        humidity: '湿度',
        dewPoint: '露点',
        wind: '风',
        gusts: '阵风',
        airQuality: '空气质量',
        uvIndex: '紫外线指数',
        nwsRadarLink: 'NWS雷达 ↗',
        language: '语言',

        // Style names
        style: '样式',
        styleDefault: '默认',
        styleEditorial: '杂志风',
        styleBulletin: '公告',
        styleQuiet: '静谧',

        machineTranslationNotice: '界面翻译由机器生成，可能不完美。',

        // Settings labels
        settingForecastColors: '在10天预报上显示彩色背景',
        settingSupportBtn: '显示烦人的支持按钮',
        settingWeatherSummary: '显示天气摘要',
        settingThemeToggle: '显示浅色 / 深色模式按钮',
        settingUnitsBtn: '显示 °C / °F 按钮',
        settingTimeBtn: '显示 12小时 / 24小时 按钮',
        settingLockBtn: '显示锁定 / 解锁按钮',
        settingNwsLink: '显示NWS雷达链接',
        settingShowSectionButtons: '当部分隐藏时显示"显示部分"按钮',
        settingTranslateLink: '显示警报翻译链接',
        settingAutoPlayRadar: '始终自动播放雷达',
        settingRememberCity: '记住上次城市',
        cityPageTitle: '{city} 天气 无广告',
        cityPageSeoBlurb: '{city}天气预报，无广告、无Cookie、无跟踪。Open-Meteo数据，10天预报，每小时状况和雷达——全部免费。',
        cityPageHideBlurb: '点击此处隐藏',

        // Weather codes
        wc0: '晴',
        wc1: '大部分晴朗',
        wc2: '局部多云',
        wc3: '阴',
        wc45: '雾',
        wc48: '雾凇',
        wc51: '小毛毛雨',
        wc53: '中等毛毛雨',
        wc55: '大毛毛雨',
        wc61: '小雨',
        wc63: '中雨',
        wc65: '大雨',
        wc71: '小雪',
        wc73: '中雪',
        wc75: '大雪',
        wc77: '米雪',
        wc80: '小阵雨',
        wc81: '中阵雨',
        wc82: '强阵雨',
        wc85: '小阵雪',
        wc86: '大阵雪',
        wc95: '雷暴',
        wc96: '雷暴伴小冰雹',
        wc99: '雷暴伴大冰雹',
        wcUnknown: '未知',

        // Temp adjectives
        sumTempFreezing: '极寒',
        sumTempCold: '寒冷',
        sumTempCool: '凉爽',
        sumTempMild: '气温',
        sumTempWarm: '温暖',
        sumTempHot: '炎热',

        // Opening template
        sumOpeningTemplate: '{tempAdj}，{temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: '（体感{feelsLike}{unit}）',

        // Condition clauses
        sumConditionThunderstorms: '，有雷暴',
        sumConditionSnowing: '，正在下雪',
        sumConditionRaining: '，正在下雨',
        sumConditionRainingWithAmount: '，正在下雨（今日预计{amount}）',
        sumConditionRainingWithAmountClearingBy: '，正在下雨（今日预计{amount}），{hour}前后转晴',
        sumConditionRainSoon: '，即将有雨',
        sumConditionRainLikelyAround: '，{hour}前后可能有雨',
        sumConditionClearSkies: '，天空晴朗',
        sumConditionCloudy: '，多云',

        // Follow-up sentences
        sumTodayHigh: '今日最高{high}{unit}',
        sumTomorrowRainWithAmount: '明天预计有雨（{amount}）',
        sumTomorrowSnowWithAmount: '明天预计有雪（{amount}）',
        sumTomorrowRainNoAmount: '明天预计有雨',
        sumTomorrowWarming: '明天回暖至{high}{unit}',
        sumTomorrowCooling: '明天降至{high}{unit}',

        // UV Index levels
        uvLow: '（低）',
        uvModerate: '（中等）',
        uvHigh: '（高）',
        uvVeryHigh: '（很高）',
        uvExtreme: '（极高）',

        // Loading / unavailable messages
        loading: '加载中...',
        loadingRadar: '雷达加载中...',
        refreshingRadar: '雷达刷新中...',
        radarUnavailable: '雷达不可用',
        pollenDataUnavailable: '该位置花粉数据不可用',

        // Astronomy labels
        sunrise: '日出',
        sunset: '日落',
        solarNoon: '正午',
        moonrise: '月出',
        moonset: '月落',
        phase: '月相',

        // Moon phase names
        moonPhaseNewMoon: '新月',
        moonPhaseWaxingCrescent: '娥眉月',
        moonPhaseFirstQuarter: '上弦月',
        moonPhaseWaxingGibbous: '盈凸月',
        moonPhaseFullMoon: '满月',
        moonPhaseWaningGibbous: '亏凸月',
        moonPhaseLastQuarter: '下弦月',
        moonPhaseWaningCrescent: '残月',

        // Chart legends
        chartTemperature: '温度',
        chartFeelsLike: '体感温度',
        chartDewPoint: '露点',
        chartCloudCover: '云量',
        chartPrecipChance: '降水概率',
        chartHumidity: '湿度',
        chartPressure: '气压',
        chartPrecipAccum: '累积降水',
        chartHourlyPrecip: '每小时降水',
        chartWindSpeed: '风速',
        chartWindGusts: '阵风',

        // Section controls
        dragToReorder: '拖动以重新排序',
        moveUp: '上移',
        moveDown: '下移',
        singleColumn: '单列',
        fullWidth: '全宽',
        removeSection: '移除部分',
        minimizeSection: '最小化部分',
        hideChart: '隐藏图表',

        // Radar controls
        refreshRadar: '刷新雷达',
        pauseRadar: '暂停',
        playRadar: '播放',
        // Radar progress / forecast labels
        forecastLabel: '预报',
        radarNow: '现在',
        slowerRadar: '较慢',
        fasterRadar: '较快',

        // Show prefix
        showSectionPrefix: '显示{name}',

        // Tagline
        tagline: '简洁的天气预报。',

        // AQI severity
        aqiGood: '良好',
        aqiModerate: '中等',
        aqiUnhealthyForSensitive: '对敏感人群不健康',
        aqiUnhealthy: '不健康',
        aqiVeryUnhealthy: '非常不健康',
        aqiHazardous: '危险',

        // Pollen levels
        pollenLow: '低',
        pollenLowMed: '低-中',
        pollenMedium: '中',
        pollenHigh: '高',
        pollenVeryHigh: '很高',

        // Misc
        highTemp: '最高',
        lowTemp: '最低',

        // Search / errors / aria-labels
        searching: '搜索中...',
        didYouMean: '您是不是想找：',
        locationNotFound: '未找到位置。请尝试其他城市或邮政编码。',
        failedToLoadWeather: '加载天气数据失败。请重试。',
        retry: '重试',
        hide: '隐藏',
        close: '关闭',
        toggleTheme: '切换深色模式',
        backToSearch: '返回搜索'
    },

    ko: {
        // UI
        currentConditions: '현재 날씨',
        hourlyForecast: '시간별 예보',
        tenDayForecast: '10일 예보',
        radar: '레이더',
        pollen: '꽃가루',
        sun: '일출/일몰',
        moon: '달',
        weatherAlerts: '⚠️ 기상 경보',
        translateAlert: '번역',
        searchPlaceholder: '도시 또는 우편번호 입력',
        searchButton: '검색',
        back: '← 뒤로',
        privacyCookies: '개인정보',
        about: '소개',
        supportThisSite: '이 사이트 지원하기',
        showMore: '더 보기',
        showLess: '간략히 보기',
        lockLayout: '레이아웃 잠금',
        unlockLayout: '레이아웃 잠금 해제',
        settings: '설정',
        restoreDefaultLayout: '기본 레이아웃 복원',
        seePollenData: '꽃가루 데이터 보기',
        feelsLike: '체감온도',
        humidity: '습도',
        dewPoint: '이슬점',
        wind: '바람',
        gusts: '돌풍',
        airQuality: '공기질',
        uvIndex: '자외선 지수',
        nwsRadarLink: 'NWS 레이더 ↗',
        language: '언어',

        // Style names
        style: '스타일',
        styleDefault: '기본',
        styleEditorial: '에디토리얼',
        styleBulletin: '회보',
        styleQuiet: '정적',

        machineTranslationNotice: 'UI 번역은 기계 번역으로 생성되어 완벽하지 않을 수 있습니다.',

        // Settings labels
        settingForecastColors: '10일 예보에 색상 배경 표시',
        settingSupportBtn: '귀찮은 후원 버튼 표시',
        settingWeatherSummary: '날씨 요약 표시',
        settingThemeToggle: '라이트 모드 / 다크 모드 버튼 표시',
        settingUnitsBtn: '°C / °F 버튼 표시',
        settingTimeBtn: '12시간 / 24시간 버튼 표시',
        settingLockBtn: '잠금 / 잠금 해제 버튼 표시',
        settingNwsLink: 'NWS 레이더 링크 표시',
        settingShowSectionButtons: '섹션이 숨겨져 있을 때 "섹션 표시" 버튼 표시',
        settingTranslateLink: '경보 번역 링크 표시',
        settingAutoPlayRadar: '레이더 자동 재생',
        settingRememberCity: '마지막 도시 기억하기',
        cityPageTitle: '{city} 날씨 광고 없음',
        cityPageSeoBlurb: '{city} 날씨 예보, 광고, 쿠키, 추적 없이. Open-Meteo 데이터, 10일 예보, 시간별 상태 및 레이더 — 모두 무료.',
        cityPageHideBlurb: '여기를 클릭하여 숨기기',

        // Weather codes
        wc0: '맑음',
        wc1: '대체로 맑음',
        wc2: '부분적으로 흐림',
        wc3: '흐림',
        wc45: '안개',
        wc48: '상고대 안개',
        wc51: '약한 이슬비',
        wc53: '보통 이슬비',
        wc55: '강한 이슬비',
        wc61: '약한 비',
        wc63: '보통 비',
        wc65: '강한 비',
        wc71: '약한 눈',
        wc73: '보통 눈',
        wc75: '강한 눈',
        wc77: '싸락눈',
        wc80: '약한 소나기',
        wc81: '보통 소나기',
        wc82: '강한 소나기',
        wc85: '약한 눈 소나기',
        wc86: '강한 눈 소나기',
        wc95: '뇌우',
        wc96: '약한 우박을 동반한 뇌우',
        wc99: '강한 우박을 동반한 뇌우',
        wcUnknown: '알 수 없음',

        // Temp adjectives
        sumTempFreezing: '매우 춥습니다',
        sumTempCold: '춥습니다',
        sumTempCool: '쌀쌀합니다',
        sumTempMild: '기온은',
        sumTempWarm: '따뜻합니다',
        sumTempHot: '덥습니다',

        // Opening template
        sumOpeningTemplate: '{tempAdj}. {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (체감 {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ', 뇌우가 있습니다',
        sumConditionSnowing: ', 눈이 내립니다',
        sumConditionRaining: ', 비가 내립니다',
        sumConditionRainingWithAmount: ', 비가 내립니다 (오늘 {amount} 예상)',
        sumConditionRainingWithAmountClearingBy: ', 비가 내립니다 (오늘 {amount} 예상), {hour}경 개임',
        sumConditionRainSoon: ', 곧 비가 올 예정입니다',
        sumConditionRainLikelyAround: ', {hour}경 비가 올 가능성이 있습니다',
        sumConditionClearSkies: ', 하늘이 맑습니다',
        sumConditionCloudy: ', 흐립니다',

        // Follow-up sentences
        sumTodayHigh: '오늘 최고 {high}{unit}',
        sumTomorrowRainWithAmount: '내일 비 예상 ({amount})',
        sumTomorrowSnowWithAmount: '내일 눈 예상 ({amount})',
        sumTomorrowRainNoAmount: '내일 비 예상',
        sumTomorrowWarming: '내일 {high}{unit}까지 상승',
        sumTomorrowCooling: '내일 {high}{unit}까지 하강',

        // UV Index levels
        uvLow: '(낮음)',
        uvModerate: '(보통)',
        uvHigh: '(높음)',
        uvVeryHigh: '(매우 높음)',
        uvExtreme: '(극심)',

        // Loading / unavailable messages
        loading: '로드 중...',
        loadingRadar: '레이더 로드 중...',
        refreshingRadar: '레이더 새로 고침 중...',
        radarUnavailable: '레이더 사용 불가',
        pollenDataUnavailable: '이 위치에 대한 꽃가루 데이터를 사용할 수 없습니다',

        // Astronomy labels
        sunrise: '일출',
        sunset: '일몰',
        solarNoon: '태양 남중시',
        moonrise: '월출',
        moonset: '월몰',
        phase: '위상',

        // Moon phase names
        moonPhaseNewMoon: '삭',
        moonPhaseWaxingCrescent: '초승달',
        moonPhaseFirstQuarter: '상현',
        moonPhaseWaxingGibbous: '상현망간',
        moonPhaseFullMoon: '보름달',
        moonPhaseWaningGibbous: '하현망간',
        moonPhaseLastQuarter: '하현',
        moonPhaseWaningCrescent: '그믐달',

        // Chart legends
        chartTemperature: '온도',
        chartFeelsLike: '체감온도',
        chartDewPoint: '이슬점',
        chartCloudCover: '구름량',
        chartPrecipChance: '강수확률',
        chartHumidity: '습도',
        chartPressure: '기압',
        chartPrecipAccum: '누적 강수량',
        chartHourlyPrecip: '시간당 강수량',
        chartWindSpeed: '풍속',
        chartWindGusts: '돌풍',

        // Section controls
        dragToReorder: '드래그하여 재정렬',
        moveUp: '위로 이동',
        moveDown: '아래로 이동',
        singleColumn: '한 열',
        fullWidth: '전체 너비',
        removeSection: '섹션 제거',
        minimizeSection: '섹션 최소화',
        hideChart: '차트 숨기기',

        // Radar controls
        refreshRadar: '레이더 새로고침',
        pauseRadar: '일시정지',
        playRadar: '재생',
        // Radar progress / forecast labels
        forecastLabel: '예보',
        radarNow: '지금',
        slowerRadar: '느리게',
        fasterRadar: '빠르게',

        // Show prefix
        showSectionPrefix: '{name} 표시',

        // Tagline
        tagline: '깔끔한 날씨 예보.',

        // AQI severity
        aqiGood: '좋음',
        aqiModerate: '보통',
        aqiUnhealthyForSensitive: '민감군에 나쁨',
        aqiUnhealthy: '나쁨',
        aqiVeryUnhealthy: '매우 나쁨',
        aqiHazardous: '위험',

        // Pollen levels
        pollenLow: '낮음',
        pollenLowMed: '낮음-중간',
        pollenMedium: '중간',
        pollenHigh: '높음',
        pollenVeryHigh: '매우 높음',

        // Misc
        highTemp: '최고',
        lowTemp: '최저',

        // Search / errors / aria-labels
        searching: '검색 중...',
        didYouMean: '다음을 찾으셨나요:',
        locationNotFound: '위치를 찾을 수 없습니다. 다른 도시나 우편번호를 시도해 보세요.',
        failedToLoadWeather: '날씨 데이터를 불러오지 못했습니다. 다시 시도해 주세요.',
        retry: '다시 시도',
        hide: '숨기기',
        close: '닫기',
        toggleTheme: '다크 모드 전환',
        backToSearch: '검색으로 돌아가기'
    },

    ar: {
        // UI
        currentConditions: 'الأحوال الحالية',
        hourlyForecast: 'التوقعات بالساعة',
        tenDayForecast: 'توقعات 10 أيام',
        radar: 'الرادار',
        pollen: 'حبوب اللقاح',
        sun: 'الشمس',
        moon: 'القمر',
        weatherAlerts: '⚠️ تنبيهات الطقس',
        translateAlert: 'ترجمة',
        searchPlaceholder: 'أدخل المدينة أو الرمز البريدي',
        searchButton: 'بحث',
        back: '← رجوع',
        privacyCookies: 'الخصوصية',
        about: 'حول',
        supportThisSite: 'ادعم هذا الموقع',
        showMore: 'عرض المزيد',
        showLess: 'عرض أقل',
        lockLayout: 'قفل التخطيط',
        unlockLayout: 'إلغاء قفل التخطيط',
        settings: 'الإعدادات',
        restoreDefaultLayout: 'استعادة التخطيط الافتراضي',
        seePollenData: 'عرض بيانات حبوب اللقاح',
        feelsLike: 'درجة الإحساس',
        humidity: 'الرطوبة',
        dewPoint: 'نقطة الندى',
        wind: 'الرياح',
        gusts: 'العواصف',
        airQuality: 'جودة الهواء',
        uvIndex: 'مؤشر الأشعة فوق البنفسجية',
        nwsRadarLink: 'رادار NWS ↗',
        language: 'اللغة',

        // Style names
        style: 'النمط',
        styleDefault: 'افتراضي',
        styleEditorial: 'تحريري',
        styleBulletin: 'نشرة',
        styleQuiet: 'هادئ',

        machineTranslationNotice: 'ترجمات واجهة المستخدم مُولَّدة آليًا وقد لا تكون مثالية.',

        // Settings labels
        settingForecastColors: 'عرض خلفيات ملونة في توقعات 10 أيام',
        settingSupportBtn: 'عرض زر الدعم المزعج',
        settingWeatherSummary: 'عرض ملخص الطقس',
        settingThemeToggle: 'عرض زر الوضع الفاتح / الوضع الداكن',
        settingUnitsBtn: 'عرض زر °C / °F',
        settingTimeBtn: 'عرض زر 12 ساعة / 24 ساعة',
        settingLockBtn: 'عرض زر القفل / إلغاء القفل',
        settingNwsLink: 'عرض رابط رادار NWS',
        settingShowSectionButtons: 'عرض أزرار "إظهار القسم" عندما تكون الأقسام مخفية',
        settingTranslateLink: 'عرض رابط ترجمة التنبيهات',
        settingAutoPlayRadar: 'تشغيل الرادار تلقائيًا دائمًا',
        settingRememberCity: 'تذكر آخر مدينة',
        cityPageTitle: 'طقس {city} بدون إعلانات',
        cityPageSeoBlurb: 'توقعات الطقس لـ {city} بدون إعلانات أو ملفات تعريف الارتباط أو التتبع. بيانات Open-Meteo، توقعات لمدة 10 أيام، حالة كل ساعة، ورادار — كل ذلك مجاناً.',
        cityPageHideBlurb: 'انقر هنا للإخفاء',

        // Weather codes
        wc0: 'سماء صافية',
        wc1: 'صافية في الغالب',
        wc2: 'غائمة جزئيًا',
        wc3: 'غائم',
        wc45: 'ضباب',
        wc48: 'ضباب متجمد',
        wc51: 'رذاذ خفيف',
        wc53: 'رذاذ معتدل',
        wc55: 'رذاذ كثيف',
        wc61: 'مطر خفيف',
        wc63: 'مطر معتدل',
        wc65: 'مطر غزير',
        wc71: 'ثلج خفيف',
        wc73: 'ثلج معتدل',
        wc75: 'ثلج غزير',
        wc77: 'حبيبات ثلجية',
        wc80: 'زخات مطر خفيفة',
        wc81: 'زخات مطر معتدلة',
        wc82: 'زخات مطر عنيفة',
        wc85: 'زخات ثلج خفيفة',
        wc86: 'زخات ثلج كثيفة',
        wc95: 'عاصفة رعدية',
        wc96: 'عاصفة رعدية مع برد خفيف',
        wc99: 'عاصفة رعدية مع برد غزير',
        wcUnknown: 'غير معروف',

        // Temp adjectives
        sumTempFreezing: 'الجو متجمد',
        sumTempCold: 'الجو بارد',
        sumTempCool: 'الجو منعش',
        sumTempMild: 'الجو',
        sumTempWarm: 'الجو دافئ',
        sumTempHot: 'الجو حار',

        // Opening template
        sumOpeningTemplate: '{tempAdj} عند {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' (يُحس بها {feelsLike}{unit})',

        // Condition clauses
        sumConditionThunderstorms: ' مع عواصف رعدية',
        sumConditionSnowing: ' وتساقط للثلج',
        sumConditionRaining: ' وتساقط للمطر',
        sumConditionRainingWithAmount: ' وتساقط للمطر ({amount} متوقعة اليوم)',
        sumConditionRainingWithAmountClearingBy: ' وتساقط للمطر ({amount} متوقعة اليوم)، تتحسن الحالة حوالي {hour}',
        sumConditionRainSoon: ' مع توقع هطول مطر قريبًا جدًا',
        sumConditionRainLikelyAround: ' مع احتمال هطول مطر حوالي {hour}',
        sumConditionClearSkies: ' مع سماء صافية',
        sumConditionCloudy: ' وغائم',

        // Follow-up sentences
        sumTodayHigh: 'درجة الحرارة العظمى اليوم {high}{unit}',
        sumTomorrowRainWithAmount: 'يُتوقع هطول مطر غدًا ({amount})',
        sumTomorrowSnowWithAmount: 'يُتوقع تساقط ثلج غدًا ({amount})',
        sumTomorrowRainNoAmount: 'يُتوقع هطول مطر غدًا',
        sumTomorrowWarming: 'ارتفاع إلى {high}{unit} غدًا',
        sumTomorrowCooling: 'انخفاض إلى {high}{unit} غدًا',

        // UV Index levels
        uvLow: '(منخفض)',
        uvModerate: '(معتدل)',
        uvHigh: '(مرتفع)',
        uvVeryHigh: '(مرتفع جدًا)',
        uvExtreme: '(شديد)',

        // Loading / unavailable messages
        loading: 'جاري التحميل...',
        loadingRadar: 'جاري تحميل الرادار...',
        refreshingRadar: 'جاري تحديث الرادار...',
        radarUnavailable: 'الرادار غير متاح',
        pollenDataUnavailable: 'بيانات حبوب اللقاح غير متاحة لهذا الموقع',

        // Astronomy labels
        sunrise: 'شروق الشمس',
        sunset: 'غروب الشمس',
        solarNoon: 'الظهر الشمسي',
        moonrise: 'شروق القمر',
        moonset: 'غروب القمر',
        phase: 'الطور',

        // Moon phase names
        moonPhaseNewMoon: 'محاق',
        moonPhaseWaxingCrescent: 'هلال أول',
        moonPhaseFirstQuarter: 'تربيع أول',
        moonPhaseWaxingGibbous: 'أحدب متزايد',
        moonPhaseFullMoon: 'بدر',
        moonPhaseWaningGibbous: 'أحدب متناقص',
        moonPhaseLastQuarter: 'تربيع ثانٍ',
        moonPhaseWaningCrescent: 'هلال أخير',

        // Chart legends
        chartTemperature: 'درجة الحرارة',
        chartFeelsLike: 'درجة الإحساس',
        chartDewPoint: 'نقطة الندى',
        chartCloudCover: 'الغيوم',
        chartPrecipChance: 'احتمال الهطول',
        chartHumidity: 'الرطوبة',
        chartPressure: 'الضغط',
        chartPrecipAccum: 'الهطول المتراكم',
        chartHourlyPrecip: 'الهطول الساعي',
        chartWindSpeed: 'سرعة الرياح',
        chartWindGusts: 'هبات الرياح',

        // Section controls
        dragToReorder: 'اسحب لإعادة الترتيب',
        moveUp: 'نقل لأعلى',
        moveDown: 'نقل لأسفل',
        singleColumn: 'عمود واحد',
        fullWidth: 'عرض كامل',
        removeSection: 'إزالة القسم',
        minimizeSection: 'تصغير القسم',
        hideChart: 'إخفاء الرسم',

        // Radar controls
        refreshRadar: 'تحديث الرادار',
        pauseRadar: 'إيقاف مؤقت',
        playRadar: 'تشغيل',
        // Radar progress / forecast labels
        forecastLabel: 'توقعات',
        radarNow: 'الآن',
        slowerRadar: 'أبطأ',
        fasterRadar: 'أسرع',

        // Show prefix
        showSectionPrefix: 'عرض {name}',

        // Tagline
        tagline: 'الطقس بدون فوضى.',

        // AQI severity
        aqiGood: 'جيد',
        aqiModerate: 'معتدل',
        aqiUnhealthyForSensitive: 'غير صحي للفئات الحساسة',
        aqiUnhealthy: 'غير صحي',
        aqiVeryUnhealthy: 'غير صحي جدًا',
        aqiHazardous: 'خطير',

        // Pollen levels
        pollenLow: 'منخفض',
        pollenLowMed: 'منخفض-متوسط',
        pollenMedium: 'متوسط',
        pollenHigh: 'مرتفع',
        pollenVeryHigh: 'مرتفع جدًا',

        // Misc
        highTemp: 'العظمى',
        lowTemp: 'الصغرى',

        // Search / errors / aria-labels
        searching: 'جارٍ البحث...',
        didYouMean: 'هل تقصد:',
        locationNotFound: 'لم يتم العثور على الموقع. جرّب مدينة أو رمزًا بريديًا آخر.',
        failedToLoadWeather: 'فشل تحميل بيانات الطقس. حاول مرة أخرى.',
        retry: 'إعادة المحاولة',
        hide: 'إخفاء',
        close: 'إغلاق',
        toggleTheme: 'تبديل الوضع الداكن',
        backToSearch: 'العودة إلى البحث'
    },

    hi: {
        // UI
        currentConditions: 'वर्तमान स्थिति',
        hourlyForecast: 'प्रति घंटा पूर्वानुमान',
        tenDayForecast: '10-दिवसीय पूर्वानुमान',
        radar: 'रडार',
        pollen: 'पराग',
        sun: 'सूर्य',
        moon: 'चंद्रमा',
        weatherAlerts: '⚠️ मौसम चेतावनी',
        translateAlert: 'अनुवाद करें',
        searchPlaceholder: 'शहर या पिन कोड दर्ज करें',
        searchButton: 'खोजें',
        back: '← वापस',
        privacyCookies: 'गोपनीयता',
        about: 'परिचय',
        supportThisSite: 'इस साइट का समर्थन करें',
        showMore: 'और देखें',
        showLess: 'कम दिखाएं',
        lockLayout: 'लेआउट लॉक करें',
        unlockLayout: 'लेआउट अनलॉक करें',
        settings: 'सेटिंग्स',
        restoreDefaultLayout: 'डिफ़ॉल्ट लेआउट पुनर्स्थापित करें',
        seePollenData: 'पराग डेटा देखें',
        feelsLike: 'महसूस होता है',
        humidity: 'आर्द्रता',
        dewPoint: 'ओस बिंदु',
        wind: 'हवा',
        gusts: 'झोंके',
        airQuality: 'वायु गुणवत्ता',
        uvIndex: 'यूवी इंडेक्स',
        nwsRadarLink: 'NWS रडार ↗',
        language: 'भाषा',

        // Style names
        style: 'शैली',
        styleDefault: 'डिफ़ॉल्ट',
        styleEditorial: 'संपादकीय',
        styleBulletin: 'बुलेटिन',
        styleQuiet: 'शांत',

        machineTranslationNotice: 'UI अनुवाद मशीन द्वारा उत्पन्न हैं और पूर्ण नहीं हो सकते हैं।',

        // Settings labels
        settingForecastColors: '10-दिवसीय पूर्वानुमान पर रंगीन पृष्ठभूमि दिखाएं',
        settingSupportBtn: 'परेशान करने वाला सहायता बटन दिखाएं',
        settingWeatherSummary: 'मौसम सारांश दिखाएं',
        settingThemeToggle: 'लाइट मोड / डार्क मोड बटन दिखाएं',
        settingUnitsBtn: '°C / °F बटन दिखाएं',
        settingTimeBtn: '12H / 24H बटन दिखाएं',
        settingLockBtn: 'लॉक / अनलॉक बटन दिखाएं',
        settingNwsLink: 'NWS रडार लिंक दिखाएं',
        settingShowSectionButtons: 'जब अनुभाग छिपे हों तो "अनुभाग दिखाएं" बटन दिखाएं',
        settingTranslateLink: 'चेतावनी अनुवाद लिंक दिखाएं',
        settingAutoPlayRadar: 'हमेशा रडार स्वतः चलाएं',
        settingRememberCity: 'अंतिम शहर याद रखें',
        cityPageTitle: '{city} मौसम बिना विज्ञापन',
        cityPageSeoBlurb: '{city} के लिए मौसम पूर्वानुमान, बिना विज्ञापन, कुकीज़ या ट्रैकिंग के। Open-Meteo डेटा, 10-दिन का पूर्वानुमान, घंटे की स्थिति और रडार — सब कुछ मुफ़्त।',
        cityPageHideBlurb: 'छिपाने के लिए यहां क्लिक करें',

        // Weather codes
        wc0: 'साफ आसमान',
        wc1: 'मुख्यतः साफ',
        wc2: 'आंशिक रूप से बादल',
        wc3: 'पूर्ण बादल',
        wc45: 'कोहरा',
        wc48: 'बर्फीला कोहरा',
        wc51: 'हल्की बूंदाबांदी',
        wc53: 'मध्यम बूंदाबांदी',
        wc55: 'घनी बूंदाबांदी',
        wc61: 'हल्की बारिश',
        wc63: 'मध्यम बारिश',
        wc65: 'भारी बारिश',
        wc71: 'हल्की बर्फबारी',
        wc73: 'मध्यम बर्फबारी',
        wc75: 'भारी बर्फबारी',
        wc77: 'बर्फ के दाने',
        wc80: 'हल्की बौछारें',
        wc81: 'मध्यम बौछारें',
        wc82: 'तेज बौछारें',
        wc85: 'हल्की बर्फ की बौछारें',
        wc86: 'भारी बर्फ की बौछारें',
        wc95: 'आंधी तूफान',
        wc96: 'हल्के ओलों के साथ आंधी',
        wc99: 'भारी ओलों के साथ आंधी',
        wcUnknown: 'अज्ञात',

        // Temp adjectives
        sumTempFreezing: 'बहुत ठंड है',
        sumTempCold: 'ठंड है',
        sumTempCool: 'ठंडक है',
        sumTempMild: 'तापमान',
        sumTempWarm: 'गर्मी है',
        sumTempHot: 'बहुत गर्मी है',

        // Opening template
        sumOpeningTemplate: '{tempAdj}, {temp}{unit}{feelsLikeSuffix}{conditionClause}',
        sumFeelsLikeSuffix: ' ({feelsLike}{unit} जैसा महसूस होता है)',

        // Condition clauses
        sumConditionThunderstorms: ' आंधी तूफान के साथ',
        sumConditionSnowing: ' और बर्फबारी हो रही है',
        sumConditionRaining: ' और बारिश हो रही है',
        sumConditionRainingWithAmount: ' और बारिश हो रही है (आज {amount} की उम्मीद)',
        sumConditionRainingWithAmountClearingBy: ' और बारिश हो रही है (आज {amount} की उम्मीद), {hour} के आसपास साफ हो जाएगा',
        sumConditionRainSoon: ' बहुत जल्द बारिश की संभावना',
        sumConditionRainLikelyAround: ' {hour} के आसपास बारिश की संभावना',
        sumConditionClearSkies: ' साफ आसमान के साथ',
        sumConditionCloudy: ' और बादल छाए हैं',

        // Follow-up sentences
        sumTodayHigh: 'आज अधिकतम {high}{unit}',
        sumTomorrowRainWithAmount: 'कल बारिश की उम्मीद ({amount})',
        sumTomorrowSnowWithAmount: 'कल बर्फबारी की उम्मीद ({amount})',
        sumTomorrowRainNoAmount: 'कल बारिश की उम्मीद',
        sumTomorrowWarming: 'कल {high}{unit} तक गर्मी बढ़ेगी',
        sumTomorrowCooling: 'कल {high}{unit} तक ठंडक होगी',

        // UV Index levels
        uvLow: '(कम)',
        uvModerate: '(मध्यम)',
        uvHigh: '(उच्च)',
        uvVeryHigh: '(बहुत उच्च)',
        uvExtreme: '(अत्यधिक)',

        // Loading / unavailable messages
        loading: 'लोड हो रहा है...',
        loadingRadar: 'रडार लोड हो रहा है...',
        refreshingRadar: 'रडार ताज़ा हो रहा है...',
        radarUnavailable: 'रडार उपलब्ध नहीं',
        pollenDataUnavailable: 'इस स्थान के लिए पराग डेटा उपलब्ध नहीं',

        // Astronomy labels
        sunrise: 'सूर्योदय',
        sunset: 'सूर्यास्त',
        solarNoon: 'सौर मध्याह्न',
        moonrise: 'चंद्रोदय',
        moonset: 'चंद्रास्त',
        phase: 'कला',

        // Moon phase names
        moonPhaseNewMoon: 'अमावस्या',
        moonPhaseWaxingCrescent: 'शुक्ल पक्ष की तृतीया',
        moonPhaseFirstQuarter: 'प्रथम पक्ष',
        moonPhaseWaxingGibbous: 'वर्धमान उभार',
        moonPhaseFullMoon: 'पूर्णिमा',
        moonPhaseWaningGibbous: 'क्षीयमाण उभार',
        moonPhaseLastQuarter: 'अंतिम पक्ष',
        moonPhaseWaningCrescent: 'कृष्ण पक्ष की तृतीया',

        // Chart legends
        chartTemperature: 'तापमान',
        chartFeelsLike: 'महसूस होता है',
        chartDewPoint: 'ओस बिंदु',
        chartCloudCover: 'बादल आवरण',
        chartPrecipChance: 'वर्षा संभावना',
        chartHumidity: 'आर्द्रता',
        chartPressure: 'दबाव',
        chartPrecipAccum: 'वर्षा संचय',
        chartHourlyPrecip: 'घंटेवार वर्षा',
        chartWindSpeed: 'हवा की गति',
        chartWindGusts: 'झोंके',

        // Section controls
        dragToReorder: 'पुनर्व्यवस्थित करने के लिए खींचें',
        moveUp: 'ऊपर ले जाएं',
        moveDown: 'नीचे ले जाएं',
        singleColumn: 'एकल कॉलम',
        fullWidth: 'पूरी चौड़ाई',
        removeSection: 'अनुभाग हटाएं',
        minimizeSection: 'अनुभाग छोटा करें',
        hideChart: 'चार्ट छुपाएं',

        // Radar controls
        refreshRadar: 'रडार ताज़ा करें',
        pauseRadar: 'विराम',
        playRadar: 'चलाएं',
        // Radar progress / forecast labels
        forecastLabel: 'पूर्वानुमान',
        radarNow: 'अभी',
        slowerRadar: 'धीमा',
        fasterRadar: 'तेज़',

        // Show prefix
        showSectionPrefix: '{name} दिखाएं',

        // Tagline
        tagline: 'बिना गड़बड़ी के मौसम।',

        // AQI severity
        aqiGood: 'अच्छा',
        aqiModerate: 'मध्यम',
        aqiUnhealthyForSensitive: 'संवेदनशील समूहों के लिए अस्वस्थ',
        aqiUnhealthy: 'अस्वस्थ',
        aqiVeryUnhealthy: 'बहुत अस्वस्थ',
        aqiHazardous: 'खतरनाक',

        // Pollen levels
        pollenLow: 'कम',
        pollenLowMed: 'कम-मध्यम',
        pollenMedium: 'मध्यम',
        pollenHigh: 'उच्च',
        pollenVeryHigh: 'बहुत उच्च',

        // Misc
        highTemp: 'अधिकतम',
        lowTemp: 'न्यूनतम',

        // Search / errors / aria-labels
        searching: 'खोज रहा है...',
        didYouMean: 'क्या आपका मतलब था:',
        locationNotFound: 'स्थान नहीं मिला। दूसरा शहर या पिन कोड आज़माएँ।',
        failedToLoadWeather: 'मौसम डेटा लोड नहीं हो सका। कृपया फिर से प्रयास करें।',
        retry: 'पुनः प्रयास',
        hide: 'छिपाएँ',
        close: 'बंद करें',
        toggleTheme: 'डार्क मोड टॉगल करें',
        backToSearch: 'खोज पर वापस'
    }
};

const LANGUAGE_NAMES = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    nl: 'Nederlands',
    pl: 'Polski',
    sv: 'Svenska',
    ru: 'Русский',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी'
};

const LANGUAGE_FLAGS = {
    en: '/img/flags/en.png',
    es: '/img/flags/es.png',
    fr: '/img/flags/fr.png',
    de: '/img/flags/de.png',
    it: '/img/flags/it.png',
    pt: '/img/flags/pt-br.png',
    nl: '/img/flags/nl.png',
    pl: '/img/flags/pl.png',
    sv: '/img/flags/sv.png',
    ru: '/img/flags/ru.png',
    ja: '/img/flags/ja.png',
    zh: '/img/flags/zh.png',
    ko: '/img/flags/ko.png',
    ar: '/img/flags/ar.png',
    hi: '/img/flags/hi.png'
};

// Per-page-load language override. Used by SEO city landing pages to
// force the page's language without writing to localStorage (preserving
// the user's saved preference for their next bare visit).
let _languageOverride = null;

function setLanguageOverride(lang) {
    if (lang && TRANSLATIONS[lang]) {
        _languageOverride = lang;
    }
}

function getCurrentLang() {
    if (_languageOverride) return _languageOverride;
    const stored = localStorage.getItem('language');
    if (stored && TRANSLATIONS[stored]) return stored;
    const browser = (navigator.language || '').slice(0, 2).toLowerCase();
    return TRANSLATIONS[browser] ? browser : 'en';
}

// Returns a richer locale tag for date formatting, e.g. en-GB / fr-CA /
// es-MX, when the browser's locale base matches the UI language. Falls
// back to the plain UI language otherwise. This lets a UK English user
// see 15/05 instead of 5/15 without needing to change the UI language.
function getLocaleForDate() {
    const ui = getCurrentLang();
    const nav = navigator.language || '';
    const navBase = nav.slice(0, 2).toLowerCase();
    if (navBase === ui && nav.length > 2) return nav;
    return ui;
}

function t(key, vars) {
    const lang = getCurrentLang();
    let str = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.en[key] || key;
    if (vars && typeof str === 'string') {
        for (const [k, v] of Object.entries(vars)) {
            str = str.replaceAll(`{${k}}`, v);
        }
    }
    return str;
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    _languageOverride = null;  // user picked explicitly; URL override no longer applies
    location.reload();
}
