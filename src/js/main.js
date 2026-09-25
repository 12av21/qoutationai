/**
 * QuotePilot AI - Main Entry Point
 * Modern ES module architecture with router and services
 */

import { initRouter, navigate, route, beforeEach, afterEach, urlFor, isActive } from './router.js';
import { 
  RFQService, QuoteService, ProductService, CustomerService, 
  UserService, NotificationService, AuditService, AuthService,
  CurrencyService, ApprovalService, SettingsService,
  initDemoData, hasPermission, getCurrentUser, addNotification
} from './services.js';

// Initialize demo data
initDemoData();
// Auth check guard
beforeEach(async (routeInfo) => {
  const publicRoutes = ['/', '/login', '/landing'];
  const isPublic = publicRoutes.some(r => routeInfo.hash.startsWith(r.slice(1)));
  
  if (!isPublic && !AuthService.getCurrentUser()) {
    // Auto-login as demo user for now
    AuthService.login('adarsh@apexflow.com', 'demo');
  }
  
  // Check permissions for protected routes
  if (routeInfo.options?.permissions) {
    const user = AuthService.getCurrentUser();
    if (user && !hasPermission(routeInfo.options.permissions)) {
      addNotification({
        type: 'warning',
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      });
      return '/dashboard';
    }
  }
  
  return true;
});

// Update sidebar active state after navigation
afterEach((routeInfo) => {
  document.querySelectorAll('.nav-item').forEach(item => {
    const view = item.dataset.view;
    if (view && isActive(`/${view}`)) {
      item.classList.add('active');
    } else if (view) {
      item.classList.remove('active');
    }
  });
  
  updateBreadcrumb(routeInfo);
  
  document.querySelector('.sidebar')?.classList.remove('open');
});

// Breadcrumb mapping
const breadcrumbMap = {
  '/': 'Landing',
  '/dashboard': 'Dashboard',
  '/rfqs': 'RFQs',
  '/rfqs/new': 'New RFQ',
  '/rfqs/:id': 'RFQ Details',
  '/quotes': 'Quotations',
  '/quotes/new': 'New Quotation',
  '/quotes/:id': 'Quotation Details',
  '/catalog': 'Products & Services',
  '/pricing': 'Pricing Rules',
// View renderer - maps routes to view functions
const viewRegistry = new Map();

// Register a view
export function registerView(path, renderFn) {
  viewRegistry.set(path, renderFn);
}

// Get view renderer
export function getView(path) {
  return viewRegistry.get(path);
}

// Initialize app
export async function initApp() {
  // Load views dynamically
  await import('./views/dashboard.js');
  await import('./views/rfqs.js');
  await import('./views/quotes.js');
  await import('./views/catalog.js');
  await import('./views/pricing.js');
  await import('./views/agents.js');
  await import('./views/approvals.js');
  await import('./views/customers.js');
  await import('./views/analytics.js');
  await import('./views/settings.js');
  await import('./views/inbox.js');
  await import('./views/demo.js');
  
  // Initialize router (this will trigger initial route)
// Global event listeners
function setupGlobalListeners() {
  // Sidebar navigation
  document.querySelectorAll('[data-view]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const view = el.dataset.view;
      if (view === 'create') {
        navigate('/quotes/new');
      } else if (view === 'landing') {
        navigate('/');
      } else {
        navigate(`/${view}`);
      }
    });
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-brand');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
    });
  }
  
  // Search
  const searchBtn = document.getElementById('search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      toast('Global search coming soon...');
    });
  }
  
  // Notifications
  const bellBtn = document.getElementById('bell');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => {
      navigate('/inbox');
    });
  }
  
  // Account menu
  const accountBtn = document.getElementById('account');
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      const user = AuthService.getCurrentUser();
      if (user) {
        toast(`Signed in as ${user.name}`);
      }
    });
  }
  
  // Assistant launcher
  const assistantLauncher = document.getElementById('assistantLauncher');
  const assistant = document.getElementById('assistant');
  const closeAssistant = document.getElementById('closeAssistant');
  const assistantForm = document.getElementById('assistantForm');
  const assistantInput = document.getElementById('assistantInput');
  
  if (assistantLauncher && assistant) {
    assistantLauncher.addEventListener('click', () => {
      assistant.hidden = !assistant.hidden;
      if (!assistant.hidden) {
        assistantInput?.focus();
      }
    });
  }
  
  if (closeAssistant && assistant) {
    closeAssistant.addEventListener('click', () => {
// Simple HTML escape
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Assistant reply generator
function generateAssistantReply(msg) {
  const lower = msg.toLowerCase();
  
  if (lower.includes('discount')) {
    return 'The 10% discount is recommended because the request contains 50 units, crossing the configured volume threshold. It remains inside the auto-approval limit.';
  }
  if (lower.includes('pending') || lower.includes('approval')) {
    const approvals = ApprovalService.getPending();
    return `There are ${approvals.length} quotations pending approval. ${approvals.length > 0 ? `The most recent is ${approvals[0].entityId} with ${approvals[0].confidence}% AI confidence.` : ''}`;
  }
  if (lower.includes('rfq') || lower.includes('requirement')) {
    const rfqs = RFQService.getAll();
    return `You have ${rfqs.length} RFQs in the system. The most recent is ${rfqs[0]?.rfqNumber || 'none'}.`;
  }
  if (lower.includes('quote') || lower.includes('quotation')) {
    const quotes = QuoteService.getAll();
    return `There are ${quotes.length} quotations. ${quotes.filter(q => q.status === 'DRAFT').length} drafts, ${quotes.filter(q => q.status === 'PENDING_APPROVAL').length} pending approval.`;
  }
  if (lower.includes('product') || lower.includes('catalog')) {
    const products = ProductService.getAll();
    return `The catalog has ${products.length} products. ${products.filter(p => p.stock > 0).length} in stock.`;
  }
  if (lower.includes('customer')) {
    const customers = CustomerService.getAll();
    return `There are ${customers.length} customers in the system.`;
  }
  
  return 'I can help with quotations, RFQs, products, customers, approvals, and pricing. Try asking about "pending approvals" or "discount rules".';
}

// Toast notification system
export function toast(message, type = 'info') {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  
  toastEl.textContent = message;
  toastEl.className = `toast show ${type}`;
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}

// Export utilities
export { navigate, urlFor, isActive, AuthService, hasPermission, getCurrentUser };

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
      assistant.hidden = true;
    });
  }
  
  if (assistantForm) {
    assistantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = assistantInput.value.trim();
      if (!msg) return;
      
      const messages = document.getElementById('messages');
      if (messages) {
        messages.insertAdjacentHTML('beforeend', `<p class="user">${escapeHtml(msg)}</p>`);
        
        setTimeout(() => {
          const reply = generateAssistantReply(msg);
          messages.insertAdjacentHTML('beforeend', `<p>${reply}</p>`);
          messages.scrollTop = messages.scrollHeight;
        }, 500);
      }
      assistantInput.value = '';
    });
  }
  
  // Landing page actions
  document.querySelectorAll('.landing [data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      if (action === 'enterApp' || action === 'create' || action === 'demo') {
        document.querySelector('.landing').hidden = true;
        document.querySelector('.app-shell').style.display = 'flex';
        document.querySelector('.assistant-launcher').style.display = 'flex';
        if (action === 'create' || action === 'demo') {
          navigate('/quotes/new');
        } else {
          navigate('/dashboard');
        }
      }
    });
  });
  
  // Demo launch button
  const demoLaunch = document.querySelector('[data-demo="launch"]');
  if (demoLaunch) {
    demoLaunch.addEventListener('click', () => {
      import('./views/demo.js').then(m => m.runDemo());
    });
  }
}
  initRouter();
  
  // Setup global event listeners
  setupGlobalListeners();
  
  // Initialize assistant
  initAssistant();
  
  console.log('QuotePilot AI initialized');
}
  '/agents': 'AI Agents',
  '/approvals': 'Approvals',
  '/customers': 'Customers',
  '/analytics': 'Analytics',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
  '/inbox': 'AI Inbox'
};

function updateBreadcrumb(routeInfo) {
  const crumb = document.getElementById('crumb');
  if (!crumb) return;
  
  let label = 'Workspace';
  for (const [path, name] of Object.entries(breadcrumbMap)) {
    const regex = path
      .replace(/\//g, '\\/')
      .replace(/:([a-zA-Z0-9_]+)/g, '[^/]+');
    if (new RegExp(`^${regex}$`).test(routeInfo.hash)) {
      label = name;
      break;
    }
  }
  
  crumb.innerHTML = `Workspace / <strong>${label}</strong>`;
}