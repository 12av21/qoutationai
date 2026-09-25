/**
 * Approvals View
 */

import { registerView } from '../main.js';
import { ApprovalService } from '../services.js';
import { layout, panel, dataTable, statusBadge, formatDate, button, iconButton } from './ui.js';

function renderApprovals() {
  const pending = ApprovalService.getPending();
  const history = ApprovalService.getHistory({ limit: 20 });
  
  const pendingRows = pending.map(a => ({
    id: a.id,
    cells: [
      `<strong>${a.entityType.toUpperCase()} ${a.entityId}</strong>`,
      a.role,
      a.requestedBy,
      formatDate(a.createdAt),
      `${button('Approve', { action: 'approve', variant: 'primary', size: 'sm' })} ${button('Reject', { action: 'reject', variant: 'secondary', size: 'sm' })}`
    ]
  }));
  
  const historyRows = history.map(a => ({
    id: a.id,
    cells: [
      `${a.entityType} ${a.entityId}`,
      a.role,
      a.status,
      a.userName,
      formatDate(a.timestamp),
      ''
    ]
  }));
  
  return `
    <div class="panel">
      <div class="section-head"><h2>Pending Approvals (${pending.length})</h2></div>
      ${dataTable(['Entity', 'Role', 'Requested By', 'Date', 'Actions'], pendingRows, { emptyMessage: 'No pending approvals' })}
    </div>
    <div class="panel">
      <div class="section-head"><h2>Approval History</h2></div>
      ${dataTable(['Entity', 'Role', 'Status', 'User', 'Date', ''], historyRows, { emptyMessage: 'No history' })}
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-action="approve"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const row = e.currentTarget.closest('tr');
      // Simplified - in real app would get approval ID from data attribute
      import('../main.js').then(m => m.toast('Approval action coming soon'));
    });
  });
}

registerView('/approvals', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Approvals', 'APPROVAL WORKFLOWS', renderApprovals());
  bindEvents();
});