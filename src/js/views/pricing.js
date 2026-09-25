/**
 * Pricing View - Pricing rules and settings
 */

import { registerView } from '../main.js';
import { SettingsService } from '../services.js';
import { layout, panel, button } from './ui.js';

function renderPricing() {
  const rules = SettingsService.getPricingRules();
  return `
    <div class="panel">
      <div class="section-head"><h2>Discount Approval Tiers</h2></div>
      <div class="extract-list">
        ${rules.discountTiers.map(t => `
          <div class="extract"><span>${t.label}</span><span class="status approved">${t.approval}</span></div>
        `).join('')}
      </div>
    </div>
    <div class="panel">
      <div class="section-head"><h2>Margin & Defaults</h2></div>
      <div class="extract-list">
        <div class="extract"><span>Margin Floor</span><strong>${rules.marginFloor}%</strong></div>
        <div class="extract"><span>Default Currency</span><strong>${rules.defaultCurrency}</strong></div>
        <div class="extract"><span>Default Payment Terms</span><strong>${rules.defaultPaymentTerms}</strong></div>
        <div class="extract"><span>Default Incoterms</span><strong>${rules.defaultIncoterms}</strong></div>
      </div>
    </div>
  `;
}

registerView('/pricing', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Pricing Rules', 'PRICING · BUSINESS CONTROLS', renderPricing());
});

registerView('/pricing/:tab', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Pricing', `PRICING · ${routeInfo.params.tab.toUpperCase()}`, '<div class="panel"><p class="muted">Tab content coming soon.</p></div>');
});