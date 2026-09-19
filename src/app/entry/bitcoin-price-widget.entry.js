import { mount } from 'svelte';
import BitcoinPrice from '../../lib/components/BitcoinPrice.svelte';

if (!document.getElementById('bitcoin-price-widget')) {
  const target = document.createElement('div');
  target.id = 'bitcoin-price-widget';
  const weatherIndicator = document.getElementById('weather-indicator');
  const topbarActions = document.querySelector('.app-shell__topbar-actions');

  if (weatherIndicator) {
    weatherIndicator.insertAdjacentElement('afterend', target);
  } else if (topbarActions) {
    topbarActions.appendChild(target);
  } else {
    document.body.appendChild(target);
  }

  mount(BitcoinPrice, { target });
}
