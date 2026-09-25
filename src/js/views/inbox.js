/**
 * AI Inbox View
 */

import { registerView } from '../main.js';
import { NotificationService, AuditService } from '../services.js';
import { layout, panel, formatDate, statusBadge } from './ui.js';

function renderInbox() {
  const notifications = NotificationService.getAll();
  const audits = AuditService.getAll({ limit: 20 });
  
  return `
    <div class="panel">
      <div class="section-head"><h2>Notifications (${notifications.filter(n => !n.read).length} unread)</h2></div>
      <div class="notifications-list">
        ${notifications.slice(0, 20).map(n => `
          <div class="notification ${n.read ? 'read' : 'unread'}">
            <span class="notif-icon">${n.type === 'alert' ? '!' : n.type === 'success' ? '✓' : 'ℹ'}</span>
            <div><strong>${n.title}</strong><small>${n.message}</small></div>
            <span class="notif-time">${formatDate(n.createdAt)}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="panel">
      <div class="section-head"><h2>Recent Activity</h2></div>
      <div class="activity-list">
        ${audits.map(a => `
          <div class="activity">
            <span class="activity-icon">${a.entityType[0].toUpperCase()}</span>
            <div><strong>${a.entityType} ${a.action}</strong><small>${a.entityId}</small></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

registerView('/inbox', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('AI Inbox', 'NOTIFICATIONS & ACTIVITY', renderInbox());
});