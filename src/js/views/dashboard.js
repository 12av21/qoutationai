/**
 * Dashboard View
 * Main dashboard with metrics, AI activity, and recent quotations
 */

import { registerView } from '../main.js';
import { RFQService, QuoteService, ProductService, CustomerService, AuditService, AuthService } from '../services.js';

function formatCurrency(amount, currency = 'INR') {
  const curr = { INR: '₹', USD: '$', EUR: '€', GBP: '£' }[currency] || currency;
  return `${curr}${Math.round(amount).toLocaleString('en-IN')}`;
}
function renderDashboard() {
  const rfqs = RFQService.getAll();
  const quotes = QuoteService.getAll();
  const products = ProductService.getAll();
  const customers = CustomerService.getAll();
  const auditEvents = AuditService.getAll({ limit: 10 });
  
  const totalQuotes = quotes.length;
  const pendingApproval = quotes.filter(q => q.status === 'PENDING_APPROVAL').length;
  const draftQuotes = quotes.filter(q => q.status === 'DRAFT').length;
  const sentQuotes = quotes.filter(q => q.status === 'SENT').length;
  const wonQuotes = quotes.filter(q => q.status === 'WON').length;
  
  const totalValue = quotes.reduce((sum, q) => sum + (q.totals?.grandTotal || 0), 0);
  
  const recentActivity = auditEvents.slice(0, 5).map(event => {
    const icons = { rfq: '✦', quote: '▤', product: '▦', customer: '♙', approval: '✓' };
    const statusMap = { CREATE: 'work', UPDATE: 'work', APPROVE: 'completed', REJECT: 'warn', VALIDATE: '' };
    return `
      <div class="activity">
        <span class="activity-icon">${icons[event.entityType] || '●'}</span>
        <div>
          <strong>${event.entityType.toUpperCase()} ${event.action}</strong>
          <small>${event.details?.description || event.entityId}</small>
          <span class="pill ${statusMap[event.action] || ''}">● ${statusMap[event.action] || 'Completed'}</span>
        </div>
      </div>
    `;
  }).join('');
  
  return buildDashboardHtml(totalQuotes, pendingApproval, draftQuotes, sentQuotes, wonQuotes, totalValue, recentActivity, products.length);
}
function buildDashboardHtml(totalQuotes, pendingApproval, draftQuotes, sentQuotes, wonQuotes, totalValue, recentActivity, productCount) {
  return `
    <div class="metrics">
      <div class="metric">
        <div class="metric-top"><span>Quotations created</span><b class="metric-icon">▤</b></div>
        <div class="metric-value">${totalQuotes}</div>
        <div class="metric-foot">${draftQuotes} drafts · ${pendingApproval} pending</div>
      </div>
      <div class="metric">
        <div class="metric-top"><span>Pipeline value</span><b class="metric-icon">₹</b></div>
        <div class="metric-value">${formatCurrency(totalValue)}</div>
        <div class="metric-foot">${wonQuotes} won this quarter</div>
      </div>
      <div class="metric">
        <div class="metric-top"><span>Avg. processing time</span><b class="metric-icon">◌</b></div>
        <div class="metric-value">3.2 min</div>
        <div class="metric-foot">↓ 42% faster with AI</div>
      </div>
      <div class="metric">
        <div class="metric-top"><span>Quotation accuracy</span><b class="metric-icon">✓</b></div>
        <div class="metric-value">98.7%</div>
        <div class="metric-foot">↑ 1.2% this month</div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <div class="panel">
        <div class="section-head">
          <h2>AI Activity Today</h2>
          <a href="#/agents" data-action="navigate">View command center →</a>
        </div>
        <div class="activity-list">
          ${recentActivity || '<div class="activity empty">No recent activity</div>'}
        </div>
      </div>
      
      <div class="panel">
        <div class="section-head">
          <h2>Recent Quotations</h2>
          <a href="#/quotes" data-action="navigate">View all →</a>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>Quotation</th><th>Customer</th><th>Value</th><th>Status</th><th>Updated</th><th></th></tr>
            </thead>
            <tbody>
              ${renderRecentQuotes() || '<tr><td colspan="6" class="empty">No quotations yet</td></tr>'}
            </tbody>
          </table>
function renderRecentQuotes() {
  const quotes = QuoteService.getAll();
  const customerService = CustomerService;
  
  return quotes
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map(q => {
      const customer = customerService.getById(q.customerId);
      const statusClass = {
        'DRAFT': 'draft',
        'PENDING_APPROVAL': 'pending',
        'APPROVED': 'approved',
        'SENT': 'sent',
        'WON': 'won',
        'LOST': 'lost'
      }[q.status] || '';
      
      return `
        <tr data-id="${q.id}">
          <td><strong>${q.quoteNumber}</strong></td>
          <td>${customer?.name || 'Unknown'}</td>
          <td>${formatCurrency(q.totals?.grandTotal || 0, q.currency)}</td>
          <td><span class="status ${statusClass}">${q.status.replace(/_/g, ' ')}</span></td>
          <td>${new Date(q.updatedAt).toLocaleDateString()}</td>
          <td>
            <button class="icon-btn" data-action="view-quote" data-id="${q.id}" title="View">⌕</button>
            ${q.status === 'DRAFT' ? `<button class="icon-btn" data-action="edit-quote" data-id="${q.id}" title="Edit">✎</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');
}

function bindEvents() {
  document.querySelector('[data-action="create-quote"]')?.addEventListener('click', () => {
    import('../main.js').then(m => m.navigate('/quotes/new'));
  });
  
  document.querySelector('[data-action="new-rfq"]')?.addEventListener('click', () => {
    import('../main.js').then(m => m.navigate('/rfqs/new'));
  });
  
  document.querySelector('[data-action="view-approvals"]')?.addEventListener('click', () => {
    import('../main.js').then(m => m.navigate('/approvals'));
  });
  
  document.querySelector('[data-action="view-catalog"]')?.addEventListener('click', () => {
    import('../main.js').then(m => m.navigate('/catalog'));
  });
  
  document.querySelectorAll('[data-action="view-quote"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      import('../main.js').then(m => m.navigate(`/quotes/${id}`));
    });
  });
  
  document.querySelectorAll('[data-action="edit-quote"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      import('../main.js').then(m => m.navigate(`/quotes/${id}/edit`));
    });
  });
  
  document.querySelectorAll('[data-action="navigate"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        import('../main.js').then(m => m.navigate(href.slice(1)));
      }
    });
  });
}

// Register the view
registerView('/dashboard', async (routeInfo) => {
  const view = document.getElementById('view');
  const { layout } = await import('./ui.js');
  view.innerHTML = layout('Dashboard', 'MONDAY, 06 SEPTEMBER 2026', renderDashboard());
  bindEvents();
});

// Also register root path to dashboard
registerView('/', async (routeInfo) => {
  const view = document.getElementById('view');
  const { layout } = await import('./ui.js');
  view.innerHTML = layout('Dashboard', 'MONDAY, 06 SEPTEMBER 2026', renderDashboard());
  bindEvents();
});
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <div class="panel">
        <div class="section-head"><h2>Quick Actions</h2></div>
        <div class="quick-actions">
          <button class="action-btn primary" data-action="create-quote">
            <span>＋</span>
            <div><strong>Create Quotation</strong><small>AI-assisted workflow</small></div>
          </button>
          <button class="action-btn" data-action="new-rfq">
            <span>✉</span>
            <div><strong>Log RFQ</strong><small>Record customer request</small></div>
          </button>
          <button class="action-btn" data-action="view-approvals">
            <span>✓</span>
            <div><strong>Approvals</strong><small>${pendingApproval} awaiting review</small></div>
          </button>
          <button class="action-btn" data-action="view-catalog">
            <span>▦</span>
            <div><strong>Product Catalog</strong><small>${productCount} products</small></div>
          </button>
        </div>
      </div>
      
      <div class="panel">
        <div class="section-head"><h2>Pipeline Summary</h2></div>
        <div class="pipeline-summary">
          <div class="pipe-stage">
            <span class="pipe-count">${draftQuotes}</span>
            <span class="pipe-label">Draft</span>
          </div>
          <div class="pipe-stage">
            <span class="pipe-count">${pendingApproval}</span>
            <span class="pipe-label">Pending Approval</span>
          </div>
          <div class="pipe-stage">
            <span class="pipe-count">${sentQuotes}</span>
            <span class="pipe-label">Sent</span>
          </div>
          <div class="pipe-stage">
            <span class="pipe-count">${wonQuotes}</span>
            <span class="pipe-label">Won</span>
          </div>
        </div>
      </div>
    </div>
  `;
}