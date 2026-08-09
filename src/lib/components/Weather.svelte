<script>
  import { onDestroy, onMount } from 'svelte';

  let weather = null;
  let loading = true;
  let position = null;
  let refreshTimer = null;

  const WEATHER_REFRESH_MS = 15 * 60 * 1000;

  function toTemperature(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.round(parsed);
  }

  function getConditionIcon(condition = '') {
    const normalized = condition.toLowerCase();

    if (
      normalized.includes('neige') ||
      normalized.includes('snow') ||
      normalized.includes('blizzard')
    ) {
      return '❄️';
    }

    if (
      normalized.includes('orage') ||
      normalized.includes('storm') ||
      normalized.includes('thunder')
    ) {
      return '⛈️';
    }

    if (
      normalized.includes('pluie') ||
      normalized.includes('rain') ||
      normalized.includes('showers')
    ) {
      return '🌧️';
    }

    if (normalized.includes('couvert') || normalized.includes('cloud')) {
      return '☁️';
    }

    if (
      normalized.includes('soleil') ||
      normalized.includes('sun') ||
      normalized.includes('ensoleillé')
    ) {
      return '☀️';
    }

    return '🌤️';
  }

  async function fetchWeather(latitude, longitude) {
    const response = await fetch(
      'https://api.weather.gc.ca/collections/citypageweather-realtime/items?lang=fr&f=json&limit=100',
      {
        headers: {
          Accept: 'application/geo+json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Weather API error');
    }

    const payload = await response.json();
    const features = Array.isArray(payload.features) ? payload.features : [];

    let closestFeature = null;
    let closestDistance = Infinity;

    for (const feature of features) {
      const coordinates = feature?.geometry?.coordinates;
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        continue;
      }

      const [featureLongitude, featureLatitude] = coordinates;
      const distance = Math.hypot(
        longitude - featureLongitude,
        latitude - featureLatitude,
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestFeature = feature;
      }
    }

    if (!closestFeature) {
      throw new Error('No weather station found');
    }

    const properties = closestFeature.properties || {};
    const currentConditions = properties.currentConditions || {};
    const conditionText =
      currentConditions?.condition?.fr ||
      currentConditions?.condition?.en ||
      properties?.name ||
      '';
    const temperatureValue =
      toTemperature(currentConditions?.temperature?.value?.fr) ??
      toTemperature(currentConditions?.temperature?.value?.en);

    return {
      city: properties.name || 'Canada',
      condition: conditionText,
      temperature: temperatureValue,
      icon: getConditionIcon(conditionText),
    };
  }

  async function updateWeather() {
    if (!position) {
      weather = null;
      loading = false;
      return;
    }

    loading = true;

    try {
      weather = await fetchWeather(position.latitude, position.longitude);
    } catch (error) {
      console.warn('[Trifoglio Weather]', error);
      weather = null;
    } finally {
      loading = false;
    }
  }

  function handleLocationSuccess(location) {
    position = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    updateWeather();
  }

  function handleLocationError() {
    loading = false;
    weather = null;
  }

  onMount(() => {
    if (!('geolocation' in navigator)) {
      loading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
      enableHighAccuracy: false,
      maximumAge: 15 * 60 * 1000,
      timeout: 10000,
    });

    refreshTimer = window.setInterval(() => {
      if (position) {
        updateWeather();
      }
    }, WEATHER_REFRESH_MS);
  });

  onDestroy(() => {
    if (refreshTimer) {
      window.clearInterval(refreshTimer);
    }
  });
</script>

{#if weather}
  <div class="weather-indicator" title={`${weather.city} · ${weather.condition}`}>
    <span class="weather-indicator__icon" aria-hidden="true">{weather.icon}</span>
    <span class="weather-indicator__temperature">{weather.temperature ?? '—'}°</span>
  </div>
{/if}
