/**
 * Catalog View - Products & Services
 */

import { registerView } from '../main.js';
import { ProductService } from '../services.js';
import { layout, panel, dataTable, formatCurrency, button, iconButton } from './ui.js';

function renderCatalog() {
  const products = ProductService.getAll();
  const rows = products.map(p => ({
    id: p.id,
    cells: [
      `<strong>${p.name}</strong><br><small>${p.sku}</small>`,
      p.category,
      formatCurrency(p.basePrice, p.currency),
      p.stock > 0 ? `<span class="status success">${p.stock} in stock</span>` : '<span class="status error">Out of stock</span>',
      `${p.leadTimeDays} days`,
      `${iconButton('⌕', 'view-product', 'View')} ${iconButton('✎', 'edit-product', 'Edit')}`
    ]
  }));
  return dataTable(['Product', 'Category', 'Base Price', 'Stock', 'Lead Time', 'Actions'], rows, { emptyMessage: 'No products in catalog' });
}

function bindEvents() {
  document.querySelector('[data-action="new-product"]')?.addEventListener('click', () => import('../main.js').then(m => m.navigate('/catalog/new')));
}

registerView('/catalog', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Products & Services', 'PRODUCT CATALOG', `
    <div class="view-toolbar"><div class="toolbar-left">${button('New Product', { action: 'new-product', variant: 'primary', icon: '＋ ' })}</div></div>
    ${renderCatalog()}
  `);
  bindEvents();
});

registerView('/catalog/new', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('New Product', 'CREATE PRODUCT', '<div class="panel"><p class="muted">Product builder coming soon.</p></div>');
});

registerView('/catalog/:id', async (routeInfo) => {
  const view = document.getElementById('view');
  const product = ProductService.getById(routeInfo.params.id);
  if (!product) { view.innerHTML = layout('Not Found', 'NOT FOUND', '<div class="empty">Product not found</div>'); return; }
  view.innerHTML = layout('Product', product.name, `<div class="panel"><p>SKU: ${product.sku}</p><p>Price: ${formatCurrency(product.basePrice, product.currency)}</p><p>Stock: ${product.stock}</p></div>`);
});