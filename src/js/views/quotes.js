/**
 * Quotes View - Minimal implementation
 */

import { registerView } from '../main.js';
import { QuoteService, CustomerService, ApprovalService } from '../services.js';
import { layout, panel, dataTable, statusBadge, formatCurrency, formatDate, button, iconButton } from './ui.js';

function renderQuotesList() {
  const quotes = QuoteService.getAll().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const rows = quotes.map(q => {
    const customer = CustomerService.getById(q.customerId);
    return {
      id: q.id,
      cells: [
        `<strong>${q.quoteNumber}</strong>`,
        customer?.name || 'Unknown',
        formatCurrency(q.totals?.grandTotal || 0, q.currency),
        statusBadge(q.status.replace(/_/g, ' '), q.status.toLowerCase()),
        formatDate(q.updatedAt),
        `${iconButton('⌕', 'view-quote', 'View')}`
      ]
    };
  });
  return dataTable(['Quotation', 'Customer', 'Value', 'Status', 'Updated', 'Actions'], rows, { emptyMessage: 'No quotations yet' });
}

function bindEvents() {
  document.querySelectorAll('[data-action="view-quote"]').forEach(btn => {
    btn.addEventListener('click', (e) => import('../main.js').then(m => m.navigate(`/quotes/${e.currentTarget.dataset.id}`)));
  });
  document.querySelector('[data-action="new-quote"]')?.addEventListener('click', () => import('../main.js').then(m => m.navigate('/quotes/new')));
}

registerView('/quotes', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Quotations', 'ALL QUOTATIONS', `
    <div class="view-toolbar"><div class="toolbar-left">${button('New Quotation', { action: 'new-quote', variant: 'primary', icon: '＋ ' })}</div></div>
    ${renderQuotesList()}
  `);
  bindEvents();
});

registerView('/quotes/new', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('New Quotation', 'CREATE QUOTATION', `
    <div class="panel"><div class="section-head"><h3>Quotation Builder</h3></div>
    <p class="muted">Full quotation builder coming soon. Use the demo workflow for now.</p>
    <div class="builder-actions">${button('Run Demo', { action: 'run-demo', variant: 'primary' })}</div></div>
  `);
  document.querySelector('[data-action="run-demo"]')?.addEventListener('click', () => import('../main.js').then(m => m.navigate('/demo')));
});

registerView('/quotes/:id', async (routeInfo) => {
  const view = document.getElementById('view');
  const quote = QuoteService.getById(routeInfo.params.id);
  if (!quote) { view.innerHTML = layout('Not Found', 'NOT FOUND', '<div class="empty">Quotation not found</div>'); return; }
  const customer = CustomerService.getById(quote.customerId);
  view.innerHTML = layout('Quotation', quote.quoteNumber, `
    <div class="quote-detail">
      <div class="quote-header"><div><h2>${quote.quoteNumber}</h2><p class="muted">${customer?.name}</p></div>
      <div>${statusBadge(quote.status.replace(/_/g, ' '), quote.status.toLowerCase())}</div></div>
      <div class="panel"><h3>Details</h3><p>Value: ${formatCurrency(quote.totals?.grandTotal || 0, quote.currency)}</p>
      <p>Status: ${quote.status}</p><p>Currency: ${quote.currency}</p></div>
    </div>
  `);
});