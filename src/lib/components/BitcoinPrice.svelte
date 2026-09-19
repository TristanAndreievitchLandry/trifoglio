<script>
  import { onMount } from 'svelte';

  const API_URL =
    'https://api.coinbase.com/v2/prices/BTC-USD/spot';
  const REFRESH_INTERVAL_MS = 60_000;
  const priceFormatter = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
  });
  const changeFormatter = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always',
  });

  let price = null;
  let previousPrice = null;
  let change = null;
  let loading = true;
  let error = null;
  let lastUpdated = null;
  let requestController = null;

  async function fetchPrice() {
    requestController?.abort();
    const currentRequestController = new AbortController();
    requestController = currentRequestController;
    loading = price === null;
    error = null;

    try {
      const response = await fetch(API_URL, {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        signal: currentRequestController.signal,
      });

      if (!response.ok) {
        throw new Error(`Coinbase request failed with status ${response.status}`);
      }

      const data = await response.json();
      const nextPrice = Number(data?.data?.amount);

      if (!Number.isFinite(nextPrice)) {
        throw new Error('Coinbase returned an invalid Bitcoin price');
      }

      previousPrice = price;
      price = nextPrice;
      change = previousPrice
        ? ((price - previousPrice) / previousPrice) * 100
        : null;
      lastUpdated = new Date();
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        error = requestError;
      }
    } finally {
      if (
        !currentRequestController.signal.aborted &&
        requestController === currentRequestController
      ) {
        loading = false;
      }
    }
  }

  onMount(() => {
    fetchPrice();
    const refreshTimer = window.setInterval(fetchPrice, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(refreshTimer);
      requestController?.abort();
    };
  });
</script>

<aside
  class="bitcoin-price"
  aria-live="polite"
  aria-label="Prix actuel du Bitcoin"
  title={lastUpdated
    ? `Dernière actualisation : ${lastUpdated.toLocaleTimeString('fr-FR')}`
    : undefined}
>
  {#if loading}
    <span class="bitcoin-price__icon" aria-hidden="true">₿</span>
    <span>BTC — chargement…</span>
  {:else if error}
    <span class="bitcoin-price__icon" aria-hidden="true">₿</span>
    <span>BTC — indisponible</span>
  {:else}
    <span class="bitcoin-price__icon" aria-hidden="true">₿</span>
    <span class="bitcoin-price__value">BTC {priceFormatter.format(price)} $ US</span>
    {#if change !== null}
      <span
        class:bitcoin-price__change--positive={change >= 0}
        class:bitcoin-price__change--negative={change < 0}
        class="bitcoin-price__change"
      >
        {change >= 0 ? '▲' : '▼'} {changeFormatter.format(change)} %
      </span>
    {/if}
  {/if}
</aside>

<style>
  .bitcoin-price {
    position: relative;
    z-index: 2002;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 180px;
    height: 34px;
    padding: 0 16px;
    margin: 0 6px;
    box-sizing: border-box;
    border: 1px solid #5b7aa2;
    border-radius: 999px;
    background: rgba(12, 20, 32, 0.97);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.38);
    color: #f3f8ff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;
    flex-shrink: 0;
  }

  .bitcoin-price__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    flex: 0 0 18px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #f7931a;
    color: #ffffff;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
  }

  .bitcoin-price__change {
    position: absolute;
    right: -46px;
    top: -6px;
    width: 64px;
    height: 18px;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid rgba(120, 150, 190, 0.6);
    border-radius: 999px;
    background: #0f1b2e;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
  }

  .bitcoin-price__change--positive {
    color: #7ee2ad;
  }

  .bitcoin-price__change--negative {
    color: #ff9f9f;
  }

  :global(#bitcoin-price-widget) {
    display: contents;
  }

  @media (max-width: 480px) {
    .bitcoin-price {
      font-size: 10px;
    }
  }
</style>