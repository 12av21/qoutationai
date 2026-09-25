/**
 * UI Helpers - Common layout and component functions
 */

// Main view layout
export function layout(title, eyebrow, content) {
  return `
    <section class="view">
      <div class="view-head">
        <div>
          <p class="eyebrow">${eyebrow}</p>
          <h1>${title}</h1>
        </div>
      </div>
      ${content}
    </section>
  `;
}

// Panel component
export function panel(title, content, actions = '') {
  return `
    <div class="panel">
      <div class="section-head">
        <h2>${title}</h2>
        ${actions}
      </div>
      ${content}
    </div>
  `;
}

// Data table
export function dataTable(headers, rows, options = {}) {
  const { emptyMessage = 'No data', rowClick } = options;
  
  if (!rows || rows.length === 0) {
    return `<div class="table-wrap"><p class="empty">${emptyMessage}</p></div>`;
  }
  
  const head = headers.map(h => `<th>${h}</th>`).join('');
  const body = rows.map((row, i) => {
    const cells = row.map((cell, j) => {
      const isAction = j === row.length - 1 && typeof cell === 'string' && cell.includes('data-action');
      return `<td${isAction ? ' class="actions"' : ''}>${cell}</td>`;
    }).join('');
    return `<tr${rowClick ? ` data-id="${row.id}"` : ''}>${cells}</tr>`;
  }).join('');
  
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

// Status badge
export function statusBadge(text, variant = 'default') {
  const variants = {
    default: '',
    draft: 'draft',
    pending: 'pending',
    approved: 'approved',
    sent: 'sent',
    won: 'won',
    lost: 'lost',
    active: 'active',
    inactive: 'inactive',
    warning: 'warning',
    error: 'error',
    success: 'success'
  };
  return `<span class="status ${variants[variant] || ''}">${text}</span>`;
}

// Currency formatting
export function formatCurrency(amount, currency = 'INR') {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', SGD: 'S$', AUD: 'A$', CAD: 'C$', JPY: '¥', CHF: 'CHF' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
}

// Number formatting
export function formatNumber(num) {
  return Math.round(num).toLocaleString('en-IN');
}

// Date formatting
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Button
export function button(label, options = {}) {
  const { variant = 'primary', icon = '', disabled = false, action = '', id = '', className = '' } = options;
  return `<button class="btn ${variant} ${className}" ${disabled ? 'disabled' : ''} ${action ? `data-action="${action}"` : ''} ${id ? `id="${id}"` : ''}>${icon}${label}</button>`;
}

// Icon button
export function iconButton(icon, action, title = '', variant = 'ghost') {
  return `<button class="icon-btn ${variant}" data-action="${action}" title="${title}">${icon}</button>`;
}

// Input field
export function inputField(name, options = {}) {
  const { type = 'text', label = '', value = '', placeholder = '', required = false, disabled = false, className = '' } = options;
  return `
    <div class="form-field">
      ${label ? `<label>${label}${required ? ' <span class="required">*</span>' : ''}</label>` : ''}
      <input type="${type}" name="${name}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} ${disabled ? 'disabled' : ''} class="${className}">
    </div>
  `;
}

// Select field
export function selectField(name, options, selectedValue = '', label = '', required = false) {
  const opts = options.map(opt => 
    `<option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>`
  ).join('');
  
  return `
    <div class="form-field">
      ${label ? `<label>${label}${required ? ' <span class="required">*</span>' : ''}</label>` : ''}
      <select name="${name}" ${required ? 'required' : ''}>${opts}</select>
    </div>
  `;
}

// Modal
export function modal(id, title, content, footer = '') {
  return `
    <div class="modal" id="${id}" role="dialog" aria-labelledby="${id}-title" hidden>
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <header>
          <h3 id="${id}-title">${title}</h3>
          <button class="modal-close" data-action="close-modal" data-target="${id}">×</button>
        </header>
        <div class="modal-body">${content}</div>
        ${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}
      </div>
    </div>
  `;
}

// Toast (re-export from main)
export { toast } from '../main.js';