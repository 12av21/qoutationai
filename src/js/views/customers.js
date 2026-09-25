/**
 * Customers View
 */

import { registerView } from '../main.js';
import { CustomerService } from '../services.js';
import { layout, panel, dataTable, button, iconButton } from './ui.js';

function renderCustomers() {
  const customers = CustomerService.getAll();
  const rows = customers.map(c => ({
    id: c.id,
    cells: [
      `<strong>${c.name}</strong>`,
      c.email,
      c.phone || '—',
      c.country,
      c.status,
      `${iconButton('⌕', 'view-customer', 'View')} ${iconButton('✎', 'edit-customer', 'Edit')}`
    ]
  }));
  return dataTable(['Customer', 'Email', 'Phone', 'Country', 'Status', 'Actions'], rows, { emptyMessage: 'No customers' });
}

function bindEvents() {
  document.querySelector('[data-action="new-customer"]')?.addEventListener('click', () => import('../main.js').then(m => m.navigate('/customers/new')));
}

registerView('/customers', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Customers', 'CUSTOMER MANAGEMENT', `
    <div class="view-toolbar"><div class="toolbar-left">${button('New Customer', { action: 'new-customer', variant: 'primary', icon: '＋ ' })}</div></div>
    ${renderCustomers()}
  `);
  bindEvents();
});

registerView('/customers/new', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('New Customer', 'CREATE CUSTOMER', '<div class="panel"><p class="muted">Customer builder coming soon.</p></div>');
});

registerView('/customers/:id', async (routeInfo) => {
  const view = document.getElementById('view');
  const customer = CustomerService.getById(routeInfo.params.id);
  if (!customer) { view.innerHTML = layout('Not Found', 'NOT FOUND', '<div class="empty">Customer not found</div>'); return; }
  view.innerHTML = layout('Customer', customer.name, `<div class="panel"><p>Email: ${customer.email}</p><p>Phone: ${customer.phone}</p><p>Country: ${customer.country}</p></div>`);
});