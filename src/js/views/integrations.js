/**
 * Integrations View
 */

import { registerView } from '../main.js';
import { SettingsService } from '../services.js';
import { layout, panel, button, statusBadge } from './ui.js';

function renderIntegrations() {
  const integrations = SettingsService.getIntegrations();
  return `
    <div class="panel">
      <div class="section-head"><h2>Configured Integrations</h2></div>
      <div class="integrations-grid">
        ${integrations.map(i => `
          <div class="integration-card">
            <div><strong>${i.name}</strong><small>${i.description}</small></div>
            <div>${statusBadge(i.status, i.status)}</div>
            <div>${i.enabled ? button('Disable', { action: 'disable-integration', variant: 'secondary' }) : button('Enable', { action: 'enable-integration', variant: 'primary' })}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

registerView('/integrations', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Integrations', 'SYSTEM INTEGRATIONS', renderIntegrations());
});