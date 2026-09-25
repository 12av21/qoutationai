(() => {
  const SCENARIOS = {
    India: { currency: 'INR', tax: 'Illustrative GST 18% — demo only', destination: 'India', paymentTerms: 'Net 15', incoterms: 'DAP', exchangeRate: 1 },
    USA: { currency: 'USD', tax: 'Sales tax varies by state + nexus', destination: 'USA', paymentTerms: 'Net 30', incoterms: 'FCA', exchangeRate: 83.25 },
    EU: { currency: 'EUR', tax: 'VAT depends on destination and B2B status', destination: 'EU', paymentTerms: 'Net 30', incoterms: 'DDP', exchangeRate: 90.5 }
  };

  const appState = {
    view: 'dashboard',
    scenario: 'India',
    rfqTab: 'overview',
    selectedProductId: 'PT-100',
    showMobileNav: false,
    overrideReason: '',
    approvalComment: '',
    quoteVersion: 2,
    currentUserRole: 'Commercial Manager',
    currentUser: 'Adarsh Krishnan',
    isAuthenticated: false,
    selectedCustomer: 'ABC Industrial Solutions',
    customers: [
      { company: 'ABC Industrial Solutions', country: 'India', contact: 'Rajesh Kumar', currency: 'INR', rfqs: 8, quotes: 12, status: 'Active' },
      { company: 'Nova Technologies', country: 'USA', contact: 'James Anderson', currency: 'USD', rfqs: 5, quotes: 9, status: 'Active' },
      { company: 'BluePeak Systems', country: 'EU', contact: 'Emma Rossi', currency: 'EUR', rfqs: 4, quotes: 6, status: 'Review' }
    ],
    rfq: {
      id: 'RFQ-2026-0042',
      customer: 'ABC Industrial Solutions',
      owner: 'Adarsh Krishnan',
      status: 'CLARIFICATION_REQUIRED',
      priority: 'High',
      currency: 'INR',
      date: '2026-09-25',
      value: 520000,
      missingFields: ['Process connection size'],
      workflow: [
        { name: 'Intake', status: 'done' },
        { name: 'Verify', status: 'done' },
        { name: 'Clarify', status: 'blocked' },
        { name: 'Match', status: 'current' },
        { name: 'Approve', status: 'pending' },
        { name: 'Quote', status: 'pending' }
      ],
      terms: {
        label: 'India export terms',
        payment: 'Net 15',
        incoterms: 'DAP',
        taxes: 'GST 18%',
        legal: 'Governing law: India'
      }
    },
    notifications: [
      { id: 1, unread: true, type: 'warning', title: 'RFQ clarification required', page: '/rfqs/RFQ-2026-0042', detail: 'Process connection is missing for the required pressure transmitter.' },
      { id: 2, unread: true, type: 'success', title: 'Technical review approved', page: '/approvals', detail: 'Technical specification was reviewed and accepted.' },
      { id: 3, unread: false, type: 'money', title: 'Margin exception flagged', page: '/pricing', detail: 'Offer margin is below the required floor.' },
      { id: 4, unread: false, type: 'info', title: 'Quote version 2 created', page: '/quotes/QT-2026-1042', detail: 'Updated pricing and release notes were saved.' }
    ],
    approvals: [
      { name: 'Technical Review', owner: 'Adarsh', status: 'Approved', time: '10:42 AM', current: false },
      { name: 'Commercial Review', owner: 'Commercial Manager', status: 'Approved', time: '10:48 AM', current: false },
      { name: 'Finance Review', owner: 'Finance Reviewer', status: 'Pending', time: '', current: true },
      { name: 'Quote Release', owner: 'Governed Release', status: 'Blocked', time: '', current: false }
    ],
    auditLog: [
      { time: '09:42', actor: 'RFQ agent', role: 'Automation', action: 'RFQ uploaded', reason: 'Customer document ingested.' },
      { time: '09:44', actor: 'Normalization engine', role: 'AI', action: 'Specifications normalized', reason: 'Field values mapped to governed schema.' },
      { time: '09:47', actor: 'Clarification engine', role: 'AI', action: 'Clarification generated', reason: 'Missing process connection flagged.' },
      { time: '10:03', actor: 'Priya', role: 'Technical Approver', action: 'Technical override approved', reason: 'Process connection resolved using approved engineering policy.' },
      { time: '10:12', actor: 'Product matching engine', role: 'AI', action: 'PT-100 selected', reason: '96% technical fit with stock and lead time.' },
      { time: '10:21', actor: 'Pricing engine', role: 'AI', action: 'Margin calculated', reason: 'Offer margin at 22.2% after discount.' },
      { time: '10:35', actor: 'Adarsh', role: 'Technical Approver', action: 'Technical approval', reason: 'Requirements validated.' },
      { time: '10:42', actor: 'Vikram', role: 'Commercial Manager', action: 'Commercial approval', reason: 'Margin exception accepted.' },
      { time: '10:49', actor: 'Anita', role: 'Finance Reviewer', action: 'Finance approval', reason: 'Price and terms approved.' },
      { time: '10:53', actor: 'QuotePilot', role: 'Automation', action: 'Quote generated', reason: 'Version 2 created.' },
      { time: '10:56', actor: 'Adarsh', role: 'Commercial Manager', action: 'Quote released', reason: 'Governed release completed.' }
    ]
  };

  const products = [
    { id: 'PT-100', name: 'PT-100 Pressure Transmitter', category: 'Pressure Transmitters', stock: 75, leadTime: '2 weeks', fit: 96, price: 95000, cogs: 70000, features: ['Pressure range matches', 'Output matches', 'IP67 confirmed', 'Delivery requirement matched'], availability: 'In stock' },
    { id: 'PT-220', name: 'PT-220 Pressure Transmitter', category: 'Pressure Transmitters', stock: 20, leadTime: '4 weeks', fit: 89, price: 82000, cogs: 62000, features: ['Pressure range aligns', 'Output matches', 'IP66 lower than required', 'Lead time longer'], availability: 'Limited' },
    { id: 'PT-310', name: 'PT-310 Pressure Transmitter', category: 'Pressure Transmitters', stock: 100, leadTime: '1 week', fit: 62, price: 118000, cogs: 84500, features: ['Premium durability', 'High stock', 'IP69K exceeds needs', 'Premium pricing'], availability: 'Available' }
  ];

  const customerCards = [
    { company: 'ABC Industrial Solutions', country: 'India', contact: 'Rajesh Kumar', currency: 'INR', rfqs: 8, quotes: 12, status: 'Active' },
    { company: 'Nova Technologies', country: 'USA', contact: 'James Anderson', currency: 'USD', rfqs: 5, quotes: 9, status: 'Active' },
    { company: 'BluePeak Systems', country: 'EU', contact: 'Emma Rossi', currency: 'EUR', rfqs: 4, quotes: 6, status: 'Review' }
  ];

  const quoteMetrics = {
    listPrice: 950000,
    quantity: 50,
    discount: 10,
    discountValue: 475000,
    net: 475000,
    cogs: 350000,
    marginValue: 125000,
    marginPct: 22.2,
    requiredFloor: 15,
    quote: 475000,
    currency: 'INR'
  };

  const authAccounts = [
    { email: 'adarsh@quotepilot.ai', password: 'demo123', name: 'Adarsh Krishnan', role: 'Commercial Manager' },
    { email: 'priya@quotepilot.ai', password: 'demo123', name: 'Priya Sharma', role: 'Technical Approver' },
    { email: 'vikram@quotepilot.ai', password: 'demo123', name: 'Vikram Singh', role: 'Commercial Manager' },
    { email: 'anita@quotepilot.ai', password: 'demo123', name: 'Anita Desai', role: 'Finance Reviewer' }
  ];

  const termTemplates = {
    INR: {
      label: 'India export terms',
      payment: 'Net 15',
      incoterms: 'DAP',
      taxes: 'GST 18%',
      legal: 'Governing law: India • Delivery: DAP to site'
    },
    USD: {
      label: 'North America commercial terms',
      payment: 'Net 30',
      incoterms: 'FCA',
      taxes: 'Sales tax varies by state + nexus',
      legal: 'Governing law: Delaware • Certificate of origin required'
    },
    EUR: {
      label: 'EU commercial terms',
      payment: 'Net 30',
      incoterms: 'DDP',
      taxes: 'VAT depends on destination and B2B status',
      legal: 'Governing law: EU • CE/UKCA declarations required'
    }
  };

  function getSelectedCustomer() {
    return appState.customers.find(customer => customer.company === appState.selectedCustomer) || appState.customers[0];
  }

  function getTermsForCurrency(currency = appState.rfq.currency || 'INR') {
    return termTemplates[currency] || termTemplates.INR;
  }

  function refreshCustomerTerms() {
    const selectedCustomer = getSelectedCustomer();
    appState.rfq.customer = selectedCustomer.company;
    appState.rfq.currency = selectedCustomer.currency;
    appState.rfq.terms = getTermsForCurrency(selectedCustomer.currency);
    appState.scenario = selectedCustomer.country === 'India' ? 'India' : selectedCustomer.country === 'USA' ? 'USA' : 'EU';
  }

  function formatCurrency(value, currency = appState.scenario === 'India' ? 'INR' : appState.scenario === 'USA' ? 'USD' : 'EUR') {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', SGD: 'S$', AUD: 'A$', CAD: 'C$', JPY: '¥', CHF: 'CHF' };
    const symbol = symbols[currency] || currency;
    const rounded = Math.round(value);
    return `${symbol}${rounded.toLocaleString('en-IN')}`;
  }

  function getSelectedProduct() {
    return products.find(p => p.id === appState.selectedProductId) || products[0];
  }

  function scenarioConfig() {
    return SCENARIOS[appState.scenario];
  }

  function buildBreadcrumb(pageTitle) {
    const crumb = document.getElementById('crumb');
    if (!crumb) return;
    if (pageTitle === 'Dashboard') {
      crumb.innerHTML = 'Workspace / <strong>Dashboard</strong>';
      return;
    }
    crumb.innerHTML = `Workspace / <strong>${pageTitle}</strong>`;
  }

  function setView(content, title = 'Dashboard', kicker = 'QuotePilot AI') {
    const viewEl = document.getElementById('view');
    if (!viewEl) return;
    viewEl.innerHTML = `
      <section class="view">
        <div class="view-head">
          <div>
            <p class="eyebrow">${kicker}</p>
            <h1>${title}</h1>
          </div>
        </div>
        ${content}
      </section>
    `;
    buildBreadcrumb(title);
  }

  function renderWorkflowStages(activeName = 'Clarify') {
    const stages = [
      { name: 'Intake', status: 'done' },
      { name: 'Verify', status: 'done' },
      { name: 'Clarify', status: 'blocked' },
      { name: 'Match', status: 'current' },
      { name: 'Approve', status: 'pending' },
      { name: 'Quote', status: 'pending' }
    ];

    return `<div class="workflow-stages">${stages.map(stage => {
      let classes = 'workflow-stage';
      if (stage.name === activeName) classes += ' active';
      if (stage.status === 'done') classes += ' complete';
      if (stage.status === 'blocked') classes += ' blocked';
      return `<div class="${classes}" data-action="route" data-path="/rfqs/RFQ-2026-0042">${stage.name}</div>`;
    }).join('')}</div>`;
  }

  function renderDashboard() {
    const cards = [
      { label: 'Total RFQs', value: 128, sub: '+12 this month', link: '/rfqs' },
      { label: 'Pending Approvals', value: 8, sub: 'Needs attention', link: '/approvals' },
      { label: 'Active Quotes', value: 24, sub: 'Across 6 customers', link: '/quotes' },
      { label: 'Margin Exceptions', value: 3, sub: 'Review required', link: '/pricing' }
    ];

    const workflow = [
      { phase: 'RFQ', count: 24 },
      { phase: 'Verification', count: 18 },
      { phase: 'Clarification', count: 5 },
      { phase: 'Matching', count: 13 },
      { phase: 'Approval', count: 8 },
      { phase: 'Quoted', count: 11 }
    ];

    const content = `
      <div class="metrics">
        ${cards.map(card => `
          <div class="metric" data-action="route" data-path="${card.link}">
            <div class="metric-top"><span>${card.label}</span><b class="metric-icon">▣</b></div>
            <div class="metric-value">${card.value}</div>
            <div class="metric-foot">${card.sub}</div>
          </div>
        `).join('')}
      </div>

      <div class="dashboard-grid">
        <div class="panel">
          <div class="section-head">
            <h2>Workflow summary</h2>
            <span class="hint">AI-governed pipeline</span>
          </div>
          <div class="workflow-stages">
            ${workflow.map((step, index) => `
              <div class="workflow-stage ${index === 2 ? 'blocked' : ''}" data-action="route" data-path="/rfqs/RFQ-2026-0042">
                <strong>${step.phase}</strong><br>
                <span>${step.count}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="section-head">
            <h2>Current RFQ</h2>
            <span class="status-badge orange">Blocked</span>
          </div>
          <div class="notice-card blocked">
            <h3>RFQ-2026-0042</h3>
            <p>Process connection size is missing, which blocks technical validation and the quote release path.</p>
            <div class="inline-actions" style="margin-top: 14px;">
              <button class="primary-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Open RFQ</button>
              <button class="secondary-btn" data-action="open-clarification">Generate clarification</button>
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" style="margin-top: 18px;">
        <div class="panel">
          <div class="section-head">
            <h2>AI activity today</h2>
            <span class="hint">24 activities</span>
          </div>
          <div class="activity-list">
            ${[
              ['✦', 'Requirement Agent', 'Processed customer requirement and normalized values', 'green'],
              ['▣', 'Product Matching', 'Selected PT-100 with 96% technical fit', 'green'],
              ['◈', 'Pricing Intelligence', 'Calculated commercial review and margin check', 'blue'],
              ['⚠', 'Validation Agent', 'Flagged missing process connection for clarification', 'orange']
            ].map(([icon, name, detail, mode]) => `
              <div class="activity">
                <span class="activity-icon">${icon}</span>
                <div>
                  <strong>${name}</strong>
                  <small>${detail}</small>
                  <span class="pill ${mode}">${mode === 'green' ? 'Completed' : mode === 'orange' ? 'Attention' : 'Review'}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="panel">
          <div class="section-head">
            <h2>Recent approvals</h2>
            <span class="hint">Live</span>
          </div>
          <div class="timeline">
            ${appState.approvals.slice(0, 3).map(row => `
              <div class="timeline-card ${row.status === 'Pending' ? 'pending' : ''}">
                <div class="timeline-dot">✓</div>
                <div>
                  <h4>${row.name}</h4>
                  <small>${row.owner}</small>
                </div>
                <div><span class="status-badge ${row.status === 'Pending' ? 'orange' : 'green'}">${row.status}</span></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setView(content, 'Dashboard', 'MONDAY, 06 SEPTEMBER 2026');
  }

  function renderRfqs() {
    const rows = [
      { id: 'RFQ-2026-0042', customer: 'ABC Industrial Solutions', received: '25 Sep 2026', status: 'CLARIFICATION_REQUIRED', priority: 'High', currency: 'INR', value: '₹5.2L', owner: 'Adarsh', action: 'Continue' },
      { id: 'RFQ-2026-0045', customer: 'Nova Technologies', received: '24 Sep 2026', status: 'READY_FOR_QUOTE', priority: 'Medium', currency: 'USD', value: '$42K', owner: 'Priya', action: 'View' },
      { id: 'RFQ-2026-0048', customer: 'BluePeak Systems', received: '21 Sep 2026', status: 'NEW', priority: 'Low', currency: 'EUR', value: '€38K', owner: 'Asha', action: 'View' }
    ];

    const content = `
      <div class="panel">
        <div class="filter-row">
          <input class="search-box" id="rfq-search" placeholder="Search RFQs, customer, owner..." />
          <select class="filter-input" id="rfq-status-filter">
            <option value="ALL">All statuses</option>
            <option value="NEW">NEW</option>
            <option value="CLARIFICATION_REQUIRED">CLARIFICATION_REQUIRED</option>
            <option value="READY_FOR_QUOTE">READY_FOR_QUOTE</option>
            <option value="QUOTED">QUOTED</option>
          </select>
          <button class="primary-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Open demo RFQ</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>RFQ</th><th>Customer</th><th>Received</th><th>Status</th><th>Priority</th><th>Currency</th><th>Value</th><th>Owner</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td><strong>${row.id}</strong></td>
                  <td>${row.customer}</td>
                  <td>${row.received}</td>
                  <td><span class="status-badge ${row.status === 'CLARIFICATION_REQUIRED' ? 'orange' : row.status === 'READY_FOR_QUOTE' ? 'green' : 'blue'}">${row.status}</span></td>
                  <td>${row.priority}</td>
                  <td>${row.currency}</td>
                  <td>${row.value}</td>
                  <td>${row.owner}</td>
                  <td><button class="ghost-btn" data-action="route" data-path="/rfqs/${row.id}">${row.action}</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    setView(content, 'RFQs', 'REQUESTS FOR QUOTATION');
    const searchEl = document.getElementById('rfq-search');
    if (searchEl) searchEl.addEventListener('input', () => {
      const val = searchEl.value.toLowerCase();
      document.querySelectorAll('.data-table tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    });
  }

  function renderRfqsDetail(id) {
    const selectedProduct = getSelectedProduct();
    const quoteTotal = selectedProduct.price * 50 * 0.9;
    const content = `
      <div class="notice-card blocked">
        <h3>⚠ Quotation blocked</h3>
        <p>Mandatory information is missing. <strong>Process connection size</strong> is required for technical compatibility validation.</p>
        <div class="inline-actions" style="margin-top: 14px;">
          <button class="primary-btn" data-action="open-clarification">Generate clarification</button>
          <button class="secondary-btn" data-action="open-override">Request technical override</button>
        </div>
      </div>

      <div class="rfq-layout" style="margin-top: 18px;">
        <div class="left-stack">
          <div class="panel">
            <div class="section-head">
              <h2>${id}</h2>
              <span class="status-badge orange">CLARIFICATION_REQUIRED</span>
            </div>
            <div class="quote-details">
              <div><strong>Customer</strong><br>ABC Industrial Solutions</div>
              <div><strong>Owner</strong><br>Adarsh Krishnan</div>
              <div><strong>Received</strong><br>25 Sep 2026</div>
              <div><strong>Currency</strong><br>INR</div>
            </div>
            <div class="tabs" style="margin-top: 18px;">
              ${['overview','requirements','clarifications','products','commercial','approvals','quote'].map(tab => `
                <button class="tab-btn ${appState.rfqTab === tab ? 'active' : ''}" data-action="rfq-tab" data-tab="${tab}">${tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              `).join('')}
            </div>
            ${renderRfqTabContent()}
          </div>
        </div>

        <div class="right-stack">
          <div class="panel">
            <div class="section-head">
              <h3>Workflow</h3>
            </div>
            ${renderWorkflowStages('Clarify')}
          </div>

          <div class="panel">
            <div class="section-head">
              <h3>Commercial snapshot</h3>
            </div>
            <div class="metric-strip">
              <div class="mini"><span>List</span><strong>${formatCurrency(selectedProduct.price * 50, 'INR')}</strong></div>
              <div class="mini"><span>Discount</span><strong>10%</strong></div>
              <div class="mini"><span>Net</span><strong>${formatCurrency(quoteTotal, 'INR')}</strong></div>
              <div class="mini"><span>Margin</span><strong>22.2%</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
    setView(content, 'RFQ Details', 'RFQ WORKFLOW');
  }

  function renderRfqTabContent() {
    if (appState.rfqTab === 'overview') {
      return `
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Field</th><th>Customer</th><th>Normalized</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Pressure range</td><td>0–10 bar</td><td>0–10 bar</td><td><span class="status-badge green">Verified</span></td></tr>
              <tr><td>Output</td><td>4–20 mA</td><td>4–20 mA</td><td><span class="status-badge green">Verified</span></td></tr>
              <tr><td>Protection</td><td>IP67</td><td>IP67</td><td><span class="status-badge green">Verified</span></td></tr>
              <tr><td>Process connection</td><td>Missing</td><td>—</td><td><span class="status-badge orange">Missing</span></td></tr>
            </tbody>
          </table>
        </div>
      `;
    }

    if (appState.rfqTab === 'products') {
      const items = products.map(product => `
        <div class="product-card ${appState.selectedProductId === product.id ? 'active-card' : ''}" data-action="select-product" data-product-id="${product.id}">
          <div class="product-header">
            <div class="product-title">${product.name}</div>
            <span class="score-pill">${product.fit}% fit</span>
          </div>
          <div class="product-meta">
            <div><span>Technical fit</span><strong>${product.fit}%</strong></div>
            <div><span>Confidence</span><strong>High</strong></div>
            <div><span>Stock</span><strong>${product.stock} units</strong></div>
            <div><span>Lead time</span><strong>${product.leadTime}</strong></div>
          </div>
          <div class="check-list">
            ${product.features.map(item => `<div class="item"><span class="dot">✓</span>${item}</div>`).join('')}
          </div>
          <div class="inline-actions">
            <button class="secondary-btn" data-action="route" data-path="/catalog">View product</button>
            <button class="primary-btn" data-action="select-product" data-product-id="${product.id}">${appState.selectedProductId === product.id ? 'Selected' : 'Select'}</button>
          </div>
        </div>
      `);

      return `<div class="match-grid">${items.join('')}</div>`;
    }

    if (appState.rfqTab === 'commercial') {
      const selected = getSelectedProduct();
      const selectedCustomer = getSelectedCustomer();
      const currency = appState.rfq.currency || selectedCustomer.currency;
      const terms = getTermsForCurrency(currency);
      const net = selected.price * 50 * 0.9;
      const cogs = selected.cogs * 50;
      const margin = net - cogs;
      const marginPct = (margin / net) * 100;
      const roleChoices = ['Commercial Manager', 'Finance Reviewer', 'Sales Manager'];
      return `
        <div class="rfq-action-bar">
          <button class="ghost-btn" data-action="route" data-path="/rfqs">Back to RFQs</button>
          <button class="secondary-btn" data-action="route" data-path="/approvals">Continue to approval</button>
        </div>
        <div class="summary-grid" style="margin-top: 18px;">
          <div class="panel">
            <div class="section-head">
              <h3>Commercial review</h3>
              <span class="status-badge green">Above floor</span>
            </div>
            <div class="customer-picker">
              <div class="field-group compact">
                <label>Customer</label>
                <select data-role="customer-picker" class="compact-select">
                  ${appState.customers.map(customer => `<option value="${customer.company}" ${customer.company === selectedCustomer.company ? 'selected' : ''}>${customer.company}</option>`).join('')}
                  <option value="__new__">+ New customer</option>
                </select>
              </div>
              <button class="secondary-btn" data-action="add-customer" type="button">Add customer</button>
            </div>
            <div class="field-row">
              <div class="field-group compact">
                <label>Currency</label>
                <select data-role="currency-picker" class="compact-select">
                  ${['INR', 'USD', 'EUR'].map(option => `<option value="${option}" ${option === currency ? 'selected' : ''}>${option}</option>`).join('')}
                </select>
              </div>
              <div class="field-group compact">
                <label>Terms & conditions</label>
                <div class="terms-pill">${terms.label}</div>
              </div>
            </div>
            <div class="role-segmented">
              ${roleChoices.map(role => `<button type="button" class="role-option ${appState.currentUserRole === role ? 'active' : ''}" data-action="set-user-role" data-role-name="${role}">${role}</button>`).join('')}
            </div>
            <div class="total-line">
              <div class="row"><span>List price</span><strong>${formatCurrency(selected.price * 50, currency)}</strong></div>
              <div class="row"><span>Discount</span><strong>10%</strong></div>
              <div class="row"><span>Net price</span><strong>${formatCurrency(net, currency)}</strong></div>
              <div class="row"><span>COGS</span><strong>${formatCurrency(cogs, currency)}</strong></div>
              <div class="row"><span>Margin</span><strong>${formatCurrency(margin, currency)}</strong></div>
              <div class="row total"><span>Margin %</span><strong>${marginPct.toFixed(1)}%</strong></div>
              <div class="row"><span>Required floor</span><strong>15%</strong></div>
            </div>
          </div>
          <div class="panel">
            <div class="section-head"><h3>Commercial terms</h3></div>
            <div class="terms-card">
              <div class="terms-line"><span>Payment</span><strong>${terms.payment}</strong></div>
              <div class="terms-line"><span>Incoterms</span><strong>${terms.incoterms}</strong></div>
              <div class="terms-line"><span>Tax</span><strong>${terms.taxes}</strong></div>
              <div class="terms-line"><span>Legal</span><strong>${terms.legal}</strong></div>
            </div>
            <div class="mini-panel" style="margin-top: 16px;">
              <div class="row"><span>Base Currency</span><strong>${currency}</strong></div>
              <div class="row"><span>Destination</span><strong>${appState.scenario}</strong></div>
              <div class="row"><span>Exchange rate</span><strong>${currency === 'INR' ? '1 = ₹1' : currency === 'USD' ? '1 USD = ₹83.25' : '1 EUR = ₹90.50'}</strong></div>
              <div class="row"><span>FX source</span><strong>Demo treasury</strong></div>
            </div>
          </div>
        </div>
      `;
    }

    if (appState.rfqTab === 'approvals') {
      const role = appState.currentUserRole;
      return `
        <div class="rfq-action-bar">
          <button class="ghost-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Back to RFQ</button>
          <button class="secondary-btn" data-action="route" data-path="/commercial">Commercial review</button>
        </div>
        <div class="timeline" style="margin-top: 18px;">
          ${appState.approvals.map(item => `
            <div class="timeline-card ${item.status === 'Pending' ? 'pending' : item.status === 'Blocked' ? 'blocked' : ''}">
              <div class="timeline-dot">${item.status === 'Approved' ? '✓' : item.status === 'Pending' ? '•' : '🔒'}</div>
              <div>
                <h4>${item.name}</h4>
                <small>${item.owner}</small>
              </div>
              <div><span class="status-badge ${item.status === 'Approved' ? 'green' : item.status === 'Pending' ? 'orange' : 'red'}">${item.status}</span></div>
            </div>
          `).join('')}
        </div>
        <div class="panel" style="margin-top: 18px;">
          <div class="section-head">
            <h3>Approver controls</h3>
            <span class="hint">${role}</span>
          </div>
          <div class="inline-actions">
            <button class="primary-btn" data-action="approve-flow">Approve as ${role}</button>
            <button class="secondary-btn" data-action="reject-flow">Request changes</button>
            <button class="ghost-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Review details</button>
          </div>
        </div>
      `;
    }

    if (appState.rfqTab === 'quote') {
      const selected = getSelectedProduct();
      const total = selected.price * 50 * 0.9;
      return `
        <div class="quote-box">
          <div class="quote-head">
            <div>
              <div class="quote-company">QuotePilot AI</div>
              <div class="fineprint">Quotation draft · Version 2</div>
            </div>
            <span class="status-badge blue">Demo</span>
          </div>
          <div class="quote-details">
            <div><strong>Quote</strong><br>QT-2026-1042</div>
            <div><strong>Customer</strong><br>ABC Industrial Solutions</div>
            <div><strong>Version</strong><br>2</div>
            <div><strong>Currency</strong><br>INR</div>
          </div>
          <table class="line-items">
            <thead>
              <tr><th>SKU</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>${selected.id}</td>
                <td>${selected.name}</td>
                <td>50</td>
                <td>${formatCurrency(selected.price, 'INR')}</td>
                <td>${formatCurrency(total, 'INR')}</td>
              </tr>
            </tbody>
          </table>
          <div class="total-line">
            <div class="row"><span>Discount</span><strong>10%</strong></div>
            <div class="row total"><span>Total</span><strong>${formatCurrency(total, 'INR')}</strong></div>
          </div>
        </div>
      `;
    }

    return `
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Field</th><th>Customer</th><th>Normalized</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Pressure Range</td><td>0–10 bar</td><td>0–10 bar</td><td><span class="status-badge green">Verified</span></td></tr>
            <tr><td>Output</td><td>4–20 mA</td><td>4–20 mA</td><td><span class="status-badge green">Verified</span></td></tr>
            <tr><td>Connection</td><td>Missing</td><td>—</td><td><span class="status-badge orange">Missing</span></td></tr>
          </tbody>
        </table>
      </div>
    `;
  }

  function renderCatalogue() {
    const content = `
      <div class="panel">
        <div class="filter-row">
          <input class="search-box" placeholder="Search catalog..." />
          <select class="filter-input"><option>All categories</option><option>Pressure transmitters</option></select>
          <button class="primary-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Use demo RFQ</button>
        </div>
        <div class="catalog-grid">
          ${products.map(product => `
            <div class="product-card">
              <div class="product-header">
                <div class="product-title">${product.id}</div>
                <span class="score-pill">${product.fit}% fit</span>
              </div>
              <div class="fineprint">${product.name}</div>
              <div class="product-meta">
                <div><span>Category</span><strong>${product.category}</strong></div>
                <div><span>Stock</span><strong>${product.stock}</strong></div>
                <div><span>Lead time</span><strong>${product.leadTime}</strong></div>
                <div><span>Price</span><strong>${formatCurrency(product.price, 'INR')}</strong></div>
              </div>
              <div class="inline-actions">
                <button class="secondary-btn" data-action="select-product" data-product-id="${product.id}">Select</button>
                <button class="ghost-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Match</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    setView(content, 'Catalogue', 'PRODUCT MATCHING');
  }

  function renderCustomers() {
    const content = `
      <div class="customer-grid">
        ${customerCards.map(customer => `
          <div class="panel">
            <div class="section-head">
              <h3>${customer.company}</h3>
              <span class="status-badge ${customer.status === 'Active' ? 'green' : 'orange'}">${customer.status}</span>
            </div>
            <div class="product-meta">
              <div><span>Country</span><strong>${customer.country}</strong></div>
              <div><span>Contact</span><strong>${customer.contact}</strong></div>
              <div><span>Currency</span><strong>${customer.currency}</strong></div>
              <div><span>RFQs</span><strong>${customer.rfqs}</strong></div>
              <div><span>Quotes</span><strong>${customer.quotes}</strong></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    setView(content, 'Customers', 'CUSTOMER PORTFOLIO');
  }

  function renderQuotes() {
    const rows = [
      { quote: 'QT-2026-1042', customer: 'ABC Industrial Solutions', version: 'V2', status: 'PENDING_APPROVAL', value: '₹47.5K', date: '25 Sep 2026' },
      { quote: 'QT-2026-1041', customer: 'Nova Technologies', version: 'V1', status: 'APPROVED', value: '$42K', date: '24 Sep 2026' },
      { quote: 'QT-2026-1040', customer: 'BluePeak Systems', version: 'V1', status: 'DRAFT', value: '€31K', date: '21 Sep 2026' }
    ];

    const content = `
      <div class="panel">
        <div class="filter-row">
          <input class="search-box" placeholder="Search quotes..." />
          <button class="primary-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Create from demo RFQ</button>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Quote</th><th>Customer</th><th>Version</th><th>Status</th><th>Value</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  <td><strong>${row.quote}</strong></td>
                  <td>${row.customer}</td>
                  <td>${row.version}</td>
                  <td><span class="status-badge ${row.status === 'APPROVED' ? 'green' : row.status === 'DRAFT' ? 'orange' : 'blue'}">${row.status}</span></td>
                  <td>${row.value}</td>
                  <td>${row.date}</td>
                  <td><button class="ghost-btn" data-action="route" data-path="/quotes/${row.quote}">Open</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    setView(content, 'Quotes', 'COMMERCIALS');
  }

  function renderApprovals() {
    const content = `
      <div class="approvals-grid">
        <div class="panel">
          <div class="section-head"><h2>Approval timeline</h2><span class="status-badge orange">Finance pending</span></div>
          <div class="timeline">
            ${appState.approvals.map((item, index) => `
              <div class="timeline-card ${item.status === 'Pending' ? 'pending' : item.status === 'Blocked' ? 'blocked' : ''}">
                <div class="timeline-dot">${item.status === 'Approved' ? '✓' : item.status === 'Pending' ? '•' : '🔒'}</div>
                <div>
                  <h4>${item.name}</h4>
                  <small>${item.owner}</small>
                  <div class="fineprint">${item.status === 'Pending' ? 'Pending approval' : item.status === 'Blocked' ? 'Release blocked' : item.status}</div>
                </div>
                <div>${item.time || 'Pending'}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="panel">
          <div class="section-head"><h2>Actions</h2></div>
          <div class="inline-actions" style="flex-direction: column; align-items: stretch;">
            <button class="primary-btn" data-action="approve-flow">Approve</button>
            <button class="secondary-btn" data-action="reject-flow">Reject</button>
            <button class="ghost-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Review RFQ</button>
          </div>
        </div>
      </div>
    `;
    setView(content, 'Approvals', 'GOVERNED REVIEW');
  }

  function renderPricing() {
    const selected = getSelectedProduct();
    const net = selected.price * 50 * 0.9;
    const margin = net - selected.cogs * 50;
    const marginPct = (margin / net) * 100;
    const content = `
      <div class="summary-grid">
        <div class="panel">
          <div class="section-head"><h2>Commercial review</h2><span class="status-badge ${marginPct >= 15 ? 'green' : 'orange'}">${marginPct >= 15 ? 'Above floor' : 'Below floor'}</span></div>
          <div class="total-line">
            <div class="row"><span>List price</span><strong>${formatCurrency(selected.price * 50, 'INR')}</strong></div>
            <div class="row"><span>Discount</span><strong>10%</strong></div>
            <div class="row"><span>Net price</span><strong>${formatCurrency(net, 'INR')}</strong></div>
            <div class="row"><span>COGS</span><strong>${formatCurrency(selected.cogs * 50, 'INR')}</strong></div>
            <div class="row"><span>Margin</span><strong>${formatCurrency(margin, 'INR')}</strong></div>
            <div class="row total"><span>Margin %</span><strong>${marginPct.toFixed(1)}%</strong></div>
            <div class="row"><span>Minimum floor</span><strong>15%</strong></div>
          </div>
        </div>
        <div class="panel">
          <div class="section-head"><h2>Protected rules</h2></div>
          <div class="mini-panel">
            <div class="row"><span>Base Currency</span><strong>INR</strong></div>
            <div class="row"><span>Quote Currency</span><strong>USD</strong></div>
            <div class="row"><span>Exchange rate</span><strong>1 USD = ₹83.25</strong></div>
            <div class="row"><span>FX timestamp</span><strong>2026-09-25 10:44</strong></div>
          </div>
        </div>
      </div>
    `;
    setView(content, 'Pricing', 'COMMERCIAL / FX');
  }

  function renderNotifications() {
    const content = `
      <div class="panel">
        <div class="section-head">
          <h2>Notification center</h2>
          <span class="hint">${appState.notifications.filter(n => n.unread).length} unread</span>
        </div>
        <div class="activity-list">
          ${appState.notifications.map(item => `
            <div class="notification-item" data-action="route" data-path="${item.page}" style="padding: 14px; cursor: pointer;">
              <div class="activity-icon">${item.type === 'warning' ? '⚠' : item.type === 'success' ? '✓' : item.type === 'money' ? '₹' : 'ℹ'}</div>
              <div>
                <strong>${item.title}</strong>
                <small>${item.detail}</small>
              </div>
              ${item.unread ? '<span class="pill orange">New</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
    setView(content, 'Notifications', 'ALERTS');
  }

  function renderAskQuotePilot() {
    const content = `
      <div class="panel">
        <div class="section-head"><h2>Ask QuotePilot</h2><span class="fineprint">Context: RFQ-2026-0042</span></div>
        <div class="quote-box">
          <div class="fineprint">You: Why is this quote blocked?</div>
          <div style="margin-top: 14px; padding: 14px; background: #f8fafc; border: 1px solid var(--line); border-radius: 12px;">
            QuotePilot: The quote is blocked because the required process connection size is missing. We need this value before technical compatibility can be validated and the governed release can proceed.
          </div>
          <div class="inline-actions" style="margin-top: 16px;">
            <button class="ghost-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Review requirement</button>
            <button class="primary-btn" data-action="open-clarification">Ask customer</button>
          </div>
        </div>
      </div>
    `;
    setView(content, 'Ask QuotePilot', 'AI ASSISTANT');
  }

  function renderLogin() {
    const content = `
      <div class="panel" style="max-width: 520px; margin: 24px auto 0; padding: 24px;">
        <div class="section-head" style="margin-bottom: 20px;">
          <div>
            <p class="eyebrow">SECURE ACCESS</p>
            <h2 style="margin-top: 6px;">Welcome back</h2>
          </div>
          <span class="status-badge blue">Demo tenant</span>
        </div>
        <form id="login-form" class="auth-form">
          <div class="field-group" style="margin-bottom: 14px;">
            <label>Email</label>
            <input type="email" id="login-email" value="adarsh@quotepilot.ai" placeholder="name@company.com" required />
          </div>
          <div class="field-group" style="margin-bottom: 18px;">
            <label>Password</label>
            <input type="password" id="login-password" value="demo123" placeholder="Enter password" required />
          </div>
          <div class="inline-actions" style="justify-content: space-between; margin-bottom: 18px;">
            <label class="fineprint"><input type="checkbox" checked /> Remember me</label>
            <button class="ghost-btn" type="button" data-action="route" data-path="/landing">Back to landing</button>
          </div>
          <div class="inline-actions" style="flex-direction: column; align-items: stretch;">
            <button class="primary-btn" type="submit">Sign in to QuotePilot</button>
            <button class="secondary-btn" type="button" data-action="demo-login">Use demo login</button>
          </div>
        </form>
        <div class="fineprint" style="margin-top: 16px; color: var(--text-soft);">
          Demo credentials: adarsh@quotepilot.ai / demo123
        </div>
      </div>
    `;
    setView(content, 'Login', 'SECURE ACCESS');
    document.getElementById('login-form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value.trim();
      const account = authAccounts.find(user => user.email.toLowerCase() === (email || '').toLowerCase() && user.password === password);
      if (!account) {
        showToast('Invalid credentials. Use the demo login shown below.', 'warning');
        return;
      }
      appState.isAuthenticated = true;
      appState.currentUser = account.name;
      appState.currentUserRole = account.role;
      showToast(`Welcome ${account.name}`, 'success');
      go('/dashboard');
    });
  }

  function renderSettings() {
    const content = `
      <div class="two-col">
        <div class="panel">
          <div class="section-head"><h2>Organization settings</h2></div>
          <div class="product-meta">
            <div><span>Tenant</span><strong>Apex Flow Control</strong></div>
            <div><span>Region</span><strong>Houston Hub</strong></div>
            <div><span>Currency</span><strong>INR</strong></div>
            <div><span>Approvals</span><strong>3 active</strong></div>
          </div>
        </div>
        <div class="panel">
          <div class="section-head"><h2>Demo scenario</h2></div>
          <div class="segmented">
            ${['India', 'USA', 'EU'].map(option => `
              <button class="${appState.scenario === option ? 'active' : ''}" data-action="set-scenario" data-scenario="${option}">${option}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    setView(content, 'Settings', 'SYSTEM');
  }

  function render404() {
    setView(`
      <div class="empty-panel">
        <div class="empty-icon">⚠</div>
        <h3>Page not found</h3>
        <p class="fineprint">The requested QuotePilot route is unavailable in this demo.</p>
        <button class="primary-btn" data-action="route" data-path="/dashboard">Back to dashboard</button>
      </div>
    `, '404', 'DEMOSTRATOR');
  }

  function syncLandingState(isAppVisible) {
    const landing = document.querySelector('.landing');
    const appShell = document.querySelector('.app-shell');
    const assistantLauncher = document.querySelector('.assistant-launcher');
    if (landing) landing.hidden = isAppVisible;
    if (appShell) appShell.style.display = isAppVisible ? 'flex' : 'none';
    if (assistantLauncher) assistantLauncher.style.display = isAppVisible ? 'flex' : 'none';
  }

  function routeFromHash() {
    const hash = window.location.hash || '';
    const path = hash.startsWith('#') ? hash.slice(1) : hash;
    const normalized = path || '/landing';

    if (normalized === '/landing' || normalized === '/' || normalized === '') {
      syncLandingState(false);
      return;
    }

    if (normalized === '/login' || normalized === '/signin') {
      syncLandingState(true);
      renderLogin();
      return;
    }

    if (!appState.isAuthenticated && normalized !== '/landing' && normalized !== '/login' && normalized !== '/signin') {
      syncLandingState(true);
      renderLogin();
      return;
    }

    syncLandingState(true);

    if (normalized === '/dashboard') {
      renderDashboard();
      return;
    }
    if (normalized === '/rfqs') {
      renderRfqs();
      return;
    }
    if (normalized === '/catalogue' || normalized === '/catalog') {
      renderCatalogue();
      return;
    }
    if (normalized === '/customers') {
      renderCustomers();
      return;
    }
    if (normalized === '/quotes') {
      renderQuotes();
      return;
    }
    if (normalized === '/approvals') {
      renderApprovals();
      return;
    }
    if (normalized === '/pricing') {
      renderPricing();
      return;
    }
    if (normalized === '/notifications') {
      renderNotifications();
      return;
    }
    if (normalized === '/ask-quotepilot') {
      renderAskQuotePilot();
      return;
    }
    if (normalized === '/settings') {
      renderSettings();
      return;
    }

    const rfqMatch = /^\/rfqs\/(.+)$/.exec(normalized);
    if (rfqMatch) {
      appState.rfqTab = 'overview';
      renderRfqsDetail(rfqMatch[1]);
      return;
    }

    const quoteMatch = /^\/quotes\/(.+)$/.exec(normalized);
    if (quoteMatch) {
      setView(`
        <div class="quote-box">
          <div class="quote-head">
            <div><div class="quote-company">QT-2026-1042</div><div class="fineprint">Version 2 · Quote preview</div></div>
            <span class="status-badge green">Approved</span>
          </div>
          <div class="quote-details">
            <div><strong>Customer</strong><br>ABC Industrial Solutions</div>
            <div><strong>Destination</strong><br>India</div>
            <div><strong>Validity</strong><br>30 days</div>
            <div><strong>Currency</strong><br>INR</div>
          </div>
          <table class="line-items">
            <thead><tr><th>SKU</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td>PT-100</td><td>PT-100 Pressure Transmitter</td><td>50</td><td>₹95,000</td><td>10%</td><td>₹4,75,000</td></tr>
            </tbody>
          </table>
          <div class="inline-actions" style="margin-top: 14px;">
            <button class="primary-btn" data-action="route" data-path="/rfqs/RFQ-2026-0042">Back to RFQ</button>
            <button class="secondary-btn" data-action="download-audit">Download audit JSON</button>
          </div>
        </div>
      `, 'Quote Preview', 'COMMERCIALS');
      return;
    }

    render404();
  }

  function go(path) {
    if (!path.startsWith('/')) path = `/${path}`;
    window.location.hash = path;
    routeFromHash();
  }

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.className = 'toast', 2600);
  }

  function openModal(title, body, buttons = '') {
    const modalRoot = document.getElementById('global-modal');
    if (!modalRoot) return;
    modalRoot.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" data-action="close-modal">×</button>
        </div>
        <div class="modal-body">${body}</div>
        ${buttons ? `<div class="modal-footer">${buttons}</div>` : ''}
      </div>
    `;
    modalRoot.classList.add('show');
  }

  function closeModal() {
    const modalRoot = document.getElementById('global-modal');
    if (modalRoot) modalRoot.classList.remove('show');
  }

  function attachGlobalHandlers() {
    document.body.addEventListener('change', (event) => {
      const target = event.target;
      if (!target) return;

      if (target.matches('[data-role="customer-picker"]')) {
        const nextValue = target.value;
        if (nextValue === '__new__') {
          target.value = appState.selectedCustomer;
          openModal('New customer', `
            <div class="field-group">
              <label>Customer name</label>
              <input id="customer-name" placeholder="e.g. Northwind Components" />
            </div>
            <div class="field-group">
              <label>Country</label>
              <select id="customer-country">
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="EU">EU</option>
              </select>
            </div>
            <div class="field-group">
              <label>Primary currency</label>
              <select id="customer-currency">
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div class="field-group">
              <label>Primary contact</label>
              <input id="customer-contact" placeholder="Contact name" />
            </div>
          `, `<button class="secondary-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-customer">Save customer</button>`);
          return;
        }

        appState.selectedCustomer = nextValue;
        refreshCustomerTerms();
        renderRfqsDetail('RFQ-2026-0042');
        showToast(`${appState.selectedCustomer} selected`, 'success');
      }

      if (target.matches('[data-role="currency-picker"]')) {
        const nextCurrency = target.value;
        appState.rfq.currency = nextCurrency;
        appState.rfq.terms = getTermsForCurrency(nextCurrency);
        appState.scenario = nextCurrency === 'INR' ? 'India' : nextCurrency === 'USD' ? 'USA' : 'EU';
        renderRfqsDetail('RFQ-2026-0042');
        showToast(`Currency updated to ${nextCurrency}`, 'success');
      }
    });

    document.body.addEventListener('click', (event) => {
      const element = event.target.closest('[data-action]');
      if (!element) return;
      const action = element.dataset.action;
      const path = element.dataset.path;
      const tab = element.dataset.tab;
      const scenario = element.dataset.scenario;
      const productId = element.dataset.productId;
      const roleName = element.dataset.roleName;

      if (action === 'route') {
        go(path || '/dashboard');
        return;
      }

      if (action === 'set-scenario') {
        appState.scenario = scenario;
        renderSettings();
        showToast(`Demo scenario switched to ${scenario}`, 'success');
        return;
      }

      if (action === 'set-user-role') {
        appState.currentUserRole = roleName || 'Commercial Manager';
        renderRfqsDetail('RFQ-2026-0042');
        showToast(`User role set to ${appState.currentUserRole}`, 'success');
        return;
      }

      if (action === 'rfq-tab') {
        appState.rfqTab = tab;
        renderRfqsDetail('RFQ-2026-0042');
        return;
      }

      if (action === 'select-product') {
        appState.selectedProductId = productId || 'PT-100';
        renderRfqsDetail('RFQ-2026-0042');
        showToast(`${appState.selectedProductId} selected`, 'success');
        return;
      }

      if (action === 'add-customer') {
        openModal('New customer', `
          <div class="field-group">
            <label>Customer name</label>
            <input id="customer-name" placeholder="e.g. Northwind Components" />
          </div>
          <div class="field-group">
            <label>Country</label>
            <select id="customer-country">
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="EU">EU</option>
            </select>
          </div>
          <div class="field-group">
            <label>Primary currency</label>
            <select id="customer-currency">
              <option value="INR">INR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div class="field-group">
            <label>Primary contact</label>
            <input id="customer-contact" placeholder="Contact name" />
          </div>
        `, `<button class="secondary-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="save-customer">Save customer</button>`);
        return;
      }

      if (action === 'save-customer') {
        const customerName = document.getElementById('customer-name')?.value?.trim();
        const country = document.getElementById('customer-country')?.value || 'India';
        const currency = document.getElementById('customer-currency')?.value || 'INR';
        const contact = document.getElementById('customer-contact')?.value?.trim() || 'New contact';

        if (!customerName) {
          showToast('Please enter a customer name.', 'warning');
          return;
        }

        const newCustomer = {
          company: customerName,
          country,
          contact,
          currency,
          rfqs: 1,
          quotes: 0,
          status: 'New'
        };

        appState.customers.unshift(newCustomer);
        appState.selectedCustomer = customerName;
        appState.rfq.customer = customerName;
        appState.rfq.currency = currency;
        appState.rfq.terms = getTermsForCurrency(currency);
        appState.scenario = country === 'India' ? 'India' : country === 'USA' ? 'USA' : 'EU';
        closeModal();
        renderRfqsDetail('RFQ-2026-0042');
        showToast(`${customerName} added and selected`, 'success');
        return;
      }

      if (action === 'open-clarification') {
        openModal('Clarification request', `
          <div class="field-group">
            <label>Customer</label>
            <input value="ABC Industrial Solutions" />
          </div>
          <div class="field-group">
            <label>RFQ</label>
            <input value="RFQ-2026-0042" />
          </div>
          <div class="field-group">
            <label>Missing field</label>
            <input value="Process connection size" />
          </div>
          <div class="field-group">
            <label>Suggested question</label>
            <textarea>Please confirm the required process connection size for the requested pressure transmitter.</textarea>
          </div>
        `, `<button class="secondary-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="copy-question">Copy</button><button class="primary-btn" data-action="resolve-clarification">Generate</button>`);
        return;
      }

      if (action === 'open-override') {
        openModal('Technical Override', `
          <div class="field-group">
            <label>Field</label>
            <input value="Process Connection" />
          </div>
          <div class="field-group">
            <label>Current</label>
            <input value="Missing" />
          </div>
          <div class="field-group">
            <label>Override</label>
            <input value="Approved based on customer confirmation" />
          </div>
          <div class="field-group">
            <label>Reason</label>
            <textarea id="override-reason" placeholder="Provide reason required for approval"></textarea>
          </div>
        `, `<button class="secondary-btn" data-action="close-modal">Cancel</button><button class="primary-btn" data-action="approve-override">Approve Override</button>`);
        return;
      }

      if (action === 'approve-override') {
        const field = document.getElementById('override-reason');
        if (!field || !field.value.trim()) {
          showToast('A reason is required before approving override.', 'warning');
          return;
        }
        appState.rfq.status = 'READY_FOR_QUOTE';
        closeModal();
        showToast('Technical override approved.', 'success');
        renderRfqsDetail('RFQ-2026-0042');
        return;
      }

      if (action === 'resolve-clarification') {
        showToast('Clarification generated and sent to customer.', 'success');
        closeModal();
        renderRfqsDetail('RFQ-2026-0042');
        return;
      }

      if (action === 'copy-question') {
        showToast('Clarification text copied.', 'success');
        return;
      }

      if (action === 'close-modal') {
        closeModal();
        return;
      }

      if (action === 'demo-login') {
        appState.isAuthenticated = true;
        appState.currentUser = 'Adarsh Krishnan';
        appState.currentUserRole = 'Commercial Manager';
        go('/dashboard');
        showToast('Demo login successful', 'success');
        return;
      }

      if (action === 'download-audit') {
        const blob = new Blob([JSON.stringify(appState.auditLog, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotepilot-audit.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Audit JSON downloaded', 'success');
        return;
      }

      if (action === 'approve-flow') {
        showToast('Approval completed and quote is ready for release.', 'success');
        renderApprovals();
        return;
      }

      if (action === 'reject-flow') {
        showToast('Approval rejected and action requested from user.', 'warning');
        return;
      }
    });

    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('open');
    });

    document.getElementById('search-trigger')?.addEventListener('click', () => {
      showToast('Global search is available for RFQs, quotes and customers.', 'info');
    });

    document.getElementById('bell-trigger')?.addEventListener('click', () => {
      go('/notifications');
    });

    document.getElementById('account-menu')?.addEventListener('click', () => {
      showToast('Signed in as Adarsh Krishnan', 'success');
    });

    document.getElementById('account')?.addEventListener('click', () => {
      if (appState.isAuthenticated) {
        showToast(`Signed in as ${appState.currentUser}`, 'success');
        return;
      }
      go('/login');
    });
  }

  function initializeShell() {
    const body = document.body;
    body.insertAdjacentHTML('beforeend', '<div id="global-modal" class="modal-root"></div><div id="toast" class="toast"></div>');
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !document.getElementById('sidebar-toggle')) {
      const toggle = document.createElement('button');
      toggle.id = 'sidebar-toggle';
      toggle.className = 'ghost-btn';
      toggle.textContent = '☰';
      toggle.style.position = 'absolute';
      toggle.style.left = '16px';
      toggle.style.top = '16px';
      toggle.style.display = 'none';
      document.querySelector('.main').prepend(toggle);
    }
    const mobileToggle = document.getElementById('sidebar-toggle');
    if (mobileToggle) {
      mobileToggle.style.display = 'none';
      if (window.innerWidth <= 560) mobileToggle.style.display = 'inline-flex';
    }
    window.addEventListener('resize', () => {
      const toggle = document.getElementById('sidebar-toggle');
      if (toggle) toggle.style.display = window.innerWidth <= 560 ? 'inline-flex' : 'none';
    });

    document.querySelectorAll('[data-view]').forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        const map = {
          dashboard: '/dashboard',
          rfqs: '/rfqs',
          catalogue: '/catalogue',
          customers: '/customers',
          quotes: '/quotes',
          approvals: '/approvals',
          pricing: '/pricing',
          currencies: '/pricing',
          audit: '/rfqs/RFQ-2026-0042',
          notifications: '/notifications',
          askquotepilot: '/ask-quotepilot',
          settings: '/settings'
        };
        go(map[view] || '/dashboard');
      });
    });

    document.querySelectorAll('[data-action="enterApp"]').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelector('.landing').hidden = true;
        document.querySelector('.app-shell').style.display = 'flex';
        if (appState.isAuthenticated) {
          go('/dashboard');
          return;
        }
        go('/login');
      });
    });

    document.querySelectorAll('[data-action="demo"]').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelector('.landing').hidden = true;
        document.querySelector('.app-shell').style.display = 'flex';
        appState.isAuthenticated = true;
        appState.currentUser = 'Adarsh Krishnan';
        appState.currentUserRole = 'Commercial Manager';
        go('/rfqs/RFQ-2026-0042');
        showToast('Governed demo workflow open', 'success');
      });
    });
  }

  function bootstrap() {
    initializeShell();
    attachGlobalHandlers();
    window.addEventListener('hashchange', routeFromHash);
    if (!window.location.hash) {
      syncLandingState(false);
      return;
    }
    routeFromHash();
  }

  window.QuotePilotApp = {
    go,
    renderDashboard,
    renderRfqs,
    renderRfqsDetail,
    renderCatalogue,
    renderApprovals,
    renderPricing,
    renderNotifications,
    renderAskQuotePilot,
    renderSettings,
    showToast,
    openModal,
    closeModal,
    state: appState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
