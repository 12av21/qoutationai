/**
 * Settings View
 */

import { registerView } from '../main.js';
import { SettingsService, CurrencyService, AuthService } from '../services.js';
import { layout, panel, button, selectField, inputField } from './ui.js';

function renderSettings() {
  const user = AuthService.getCurrentUser();
  const currencies = CurrencyService.getAll();
  
  return `
    <div class="settings-tabs">
      <nav class="tab-nav">
        <button class="tab-btn active" data-tab="general">General</button>
        <button class="tab-btn" data-tab="currency">Currency & Tax</button>
        <button class="tab-btn" data-tab="approvals">Approvals</button>
        <button class="tab-btn" data-tab="notifications">Notifications</button>
      </nav>
      
      <div class="tab-panel active" id="tab-general">
        <div class="panel"><div class="section-head"><h3>Company</h3></div>
          <div class="form-grid">
            ${inputField('companyName', { label: 'Company Name', value: 'Apex Flow Control' })}
            ${inputField('companyAddress', { label: 'Address', value: '123 Industrial Blvd, Houston, TX' })}
            ${selectField('defaultCurrency', currencies.map(c => ({ value: c.code, label: `${c.code} (${c.symbol})` })), 'INR', 'Default Currency')}
          </div>
        </div>
        <div class="panel"><div class="section-head"><h3>User Profile</h3></div>
          <div class="form-grid">
            ${inputField('userName', { label: 'Name', value: user?.name || '' })}
            ${inputField('userEmail', { type: 'email', label: 'Email', value: user?.email || '' })}
            ${selectField('userRole', [{ value: 'ADMIN', label: 'Admin' }, { value: 'SALES_REP', label: 'Sales Rep' }, { value: 'COMMERCIAL_MANAGER', label: 'Commercial Manager' }], user?.role || 'SALES_REP', 'Role')}
          </div>
        </div>
      </div>
      
      <div class="tab-panel" id="tab-currency">
        <div class="panel"><div class="section-head"><h3>Exchange Rates</h3></div>
          <p class="muted">Exchange rate management coming soon.</p>
        </div>
      </div>
      
      <div class="tab-panel" id="tab-approvals">
        <div class="panel"><div class="section-head"><h3>Approval Workflows</h3></div>
          <p class="muted">Approval workflow configuration coming soon.</p>
        </div>
      </div>
      
      <div class="tab-panel" id="tab-notifications">
        <div class="panel"><div class="section-head"><h3>Notification Preferences</h3></div>
          <p class="muted">Notification settings coming soon.</p>
        </div>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });
}

registerView('/settings', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Settings', 'SYSTEM SETTINGS', renderSettings());
  bindEvents();
});