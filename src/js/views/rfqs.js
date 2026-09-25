/**
 * RFQs View - Minimal implementation
 */

import { registerView } from '../main.js';
import { RFQService, CustomerService } from '../services.js';
import { layout, panel, dataTable, statusBadge, formatDate, button, iconButton } from './ui.js';

function renderRFQsList() {
  const rfqs = RFQService.getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const rows = rfqs.map(r => ({
    id: r.id,
    cells: [
      `<strong>${r.rfqNumber}</strong>`,
      CustomerService.getById(r.customerId)?.name || 'Unknown',
      formatDate(r.createdAt),
      statusBadge(r.stage.replace(/_/g, ' '), r.stage.toLowerCase()),
      `${iconButton('⌕', 'view-rfq', 'View')}`
    ]
  }));
  return dataTable(['RFQ', 'Customer', 'Date', 'Stage', 'Actions'], rows, { emptyMessage: 'No RFQs yet' });
}

function bindEvents() {
  document.querySelectorAll('[data-action="view-rfq"]').forEach(btn => {
    btn.addEventListener('click', (e) => import('../main.js').then(m => m.navigate(`/rfqs/${e.currentTarget.dataset.id}`)));
  });
  document.querySelector('[data-action="new-rfq"]')?.addEventListener('click', () => import('../main.js').then(m => m.navigate('/rfqs/new')));
}

registerView('/rfqs', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('RFQs', 'ALL REQUESTS FOR QUOTATION', `
    <div class="view-toolbar"><div class="toolbar-left">${button('New RFQ', { action: 'new-rfq', variant: 'primary', icon: '＋ ' })}</div></div>
    ${renderRFQsList()}
  `);
  bindEvents();
});

registerView('/rfqs/new', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('New RFQ', 'CREATE RFQ', `
    <div class="panel"><div class="section-head"><h3>RFQ Builder</h3></div>
    <p class="muted">Full RFQ builder coming soon.</p></div>
  `);
});

registerView('/rfqs/:id', async (routeInfo) => {
  const view = document.getElementById('view');
  const rfq = RFQService.getById(routeInfo.params.id);
  if (!rfq) { view.innerHTML = layout('Not Found', 'NOT FOUND', '<div class="empty">RFQ not found</div>'); return; }
  const customer = CustomerService.getById(rfq.customerId);
  view.innerHTML = layout('RFQ', rfq.rfqNumber, `
    <div class="panel"><h3>Details</h3><p>Customer: ${customer?.name}</p><p>Stage: ${rfq.stage}</p><p>Requirements: ${rfq.requirements?.length || 0}</p></div>
  `);
});