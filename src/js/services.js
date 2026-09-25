/**
 * QuotePilot AI - Centralized Mock Services
 * Single source of truth for all demo data and state
 */

// ============================================
// DEMO DATA STORE
// ============================================

const demoStore = {
  currentUser: null,
  currentRole: 'COMMERCIAL_MANAGER',
  currentTenant: 'Apex Flow Control',
  
  rfqs: [],
  customers: [],
  products: [],
  quotes: [],
  approvals: [],
  auditEvents: [],
  notifications: [],
  
  exchangeRates: {
    INR: { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, AED: 0.044, SGD: 0.016, AUD: 0.018, CAD: 0.016, JPY: 1.78, CHF: 0.011 },
    USD: { INR: 83.25, USD: 1, EUR: 0.92, GBP: 0.79, AED: 3.67, SGD: 1.35, AUD: 1.52, CAD: 1.36, JPY: 148.5, CHF: 0.90 },
    EUR: { INR: 90.50, USD: 1.09, EUR: 1, GBP: 0.86, AED: 4.00, SGD: 1.47, AUD: 1.65, CAD: 1.48, JPY: 161.5, CHF: 0.98 },
    GBP: { INR: 105.20, USD: 1.27, EUR: 1.16, GBP: 1, AED: 4.65, SGD: 1.71, AUD: 1.92, CAD: 1.72, JPY: 188.0, CHF: 1.14 }
  },
  
  currencies: [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
    { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
    { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
    { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' }
  ],
  
  taxScenarios: {
    IN: { label: 'India', currency: 'INR', tax: 'Illustrative GST 18% — intra-state: CGST 9% + SGST 9%; inter-state: IGST 18%. Export/SEZ may be zero-rated subject to evidence.', payments: 'UPI, NEFT, RTGS, bank transfer, card or letter of credit', gstRates: { standard: 18, services: 18, export: 0, sez: 0 }, incoterms: ['DAP', 'DDP', 'EXW', 'FCA', 'CIF'] },
    US: { label: 'United States', currency: 'USD', tax: 'Sales tax depends on destination, seller nexus, local jurisdiction and exemption status. No universal rate is assumed.', payments: 'ACH, domestic wire, card, check or letter of credit', gstRates: { standard: 0, services: 0, export: 0, sez: 0 }, incoterms: ['FCA', 'FOB', 'CIF', 'DAP', 'DDP', 'EXW'] },
    EU: { label: 'European Union', currency: 'EUR', tax: 'VAT depends on destination and customer status: domestic VAT, intra-EU B2B reverse charge with valid VAT IDs, or export treatment.', payments: 'SEPA transfer, international wire, card or letter of credit', gstRates: { standard: 19, services: 19, export: 0, sez: 0 }, incoterms: ['FCA', 'DAP', 'DDP', 'EXW', 'CIF'] }
  },
  
  pricingRules: {
    discountTiers: [
      { min: 0, max: 10, label: 'Up to 10% · Standard volume discount', approval: 'AUTO_APPROVED' },
      { min: 10, max: 20, label: '10% to 20% · Strategic account', approval: 'MANAGER_APPROVAL' },
      { min: 20, max: 100, label: 'Above 20% · Exceptional discount', approval: 'DIRECTOR_APPROVAL' }
    ],
    marginFloor: 15,
    defaultCurrency: 'INR',
    defaultPaymentTerms: 'Net 15',
    defaultIncoterms: 'DAP'
  },
  
  users: [],
  roles: [],
  allPermissions: []
};
﻿
// Initialize demo data
function initDemoData() {
  demoStore.rfqs = [
    {
      id: 'RFQ-2026-0042',
      rfqNumber: 'RFQ-2026-0042',
      customerId: 'CUST-001',
      customerName: 'Apex Process Industries',
      status: 'CLARIFICATION_REQUIRED',
      stage: 3,
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-03T14:30:00Z',
      destination: 'IN',
      currency: 'INR',
      requestedDelivery: '2026-10-01',
      requirements: [
        { id: 'req-1', field: 'Product Type', customerValue: 'Pressure Transmitter', normalizedValue: 'Pressure Transmitter', status: 'VERIFIED', confidence: 100, source: 'RFQ Page 1', evidence: 'Section 2.1' },
        { id: 'req-2', field: 'Quantity', customerValue: '50 units', normalizedValue: '50', status: 'VERIFIED', confidence: 100, source: 'RFQ Page 1', evidence: 'Section 1.2' },
        { id: 'req-3', field: 'Pressure Range', customerValue: '0-10 bar', normalizedValue: '0-10 bar', status: 'VERIFIED', confidence: 98, source: 'RFQ Page 2', evidence: 'Table 3' },
        { id: 'req-4', field: 'Output Signal', customerValue: '4-20 mA', normalizedValue: '4-20 mA', status: 'VERIFIED', confidence: 100, source: 'RFQ Page 2', evidence: 'Section 2.3' },
        { id: 'req-5', field: 'Protection Class', customerValue: 'IP67', normalizedValue: 'IP67', status: 'VERIFIED', confidence: 100, source: 'RFQ Page 2', evidence: 'Section 2.4' },
        { id: 'req-6', field: 'Process Connection', customerValue: 'Not specified', normalizedValue: null, status: 'MISSING', confidence: 0, source: 'RFQ Page 2', evidence: 'Section 2.5 - NOT FOUND' },
        { id: 'req-7', field: 'Material', customerValue: '316L Stainless Steel', normalizedValue: '316L SS', status: 'NORMALIZED', confidence: 95, source: 'RFQ Page 2', evidence: 'Section 2.6' },
        { id: 'req-8', field: 'Certification', customerValue: 'ATEX Zone 1', normalizedValue: 'ATEX Zone 1', status: 'VERIFIED', confidence: 90, source: 'RFQ Page 3', evidence: 'Section 3.1' }
      ],
      attachments: ['pressure-transmitter-rfq-demo.pdf'],
      clarification: { id: 'CLR-2026-0042-01', rfqId: 'RFQ-2026-0042', status: 'PENDING', requestedFields: ['Process Connection'], sentAt: null, responseReceivedAt: null },
      technicalOverride: null,
      selectedProductId: null,
      commercial: null,
      approvals: [],
      auditEvents: []
    }
  ];
  
  demoStore.customers = [
    { id: 'CUST-001', name: 'Apex Process Industries', country: 'IN', currency: 'INR', contacts: [{ id: 'CON-001', name: 'Rajesh Kumar', email: 'rajesh.kumar@apex-ind.com', phone: '+91-22-4567-8900', role: 'Procurement Manager' }, { id: 'CON-002', name: 'Priya Sharma', email: 'priya.sharma@apex-ind.com', phone: '+91-22-4567-8901', role: 'Technical Lead' }], billingAddress: 'Unit 405, MIDC Industrial Area, Andheri East, Mumbai 400093, Maharashtra, India', shippingAddress: 'Plant 2, GIDC Estate, Vapi 396195, Gujarat, India', paymentTerms: 'Net 15', incoterms: 'DAP', taxId: 'GSTIN: 27AAACA1234B1Z5', status: 'ACTIVE', rfqIds: ['RFQ-2026-0042'], quoteIds: [], createdAt: '2025-01-15T00:00:00Z' },
    { id: 'CUST-002', name: 'Nova Technologies', country: 'US', currency: 'USD', contacts: [{ id: 'CON-003', name: 'James Anderson', email: 'j.anderson@novatech.com', phone: '+1-713-555-0123', role: 'VP Procurement' }], billingAddress: '1200 Smith Street, Suite 1500, Houston, TX 77002, USA', shippingAddress: '2500 Bay Area Blvd, Houston, TX 77058, USA', paymentTerms: 'Net 30', incoterms: 'FCA', taxId: 'EIN: 12-3456789', status: 'ACTIVE', rfqIds: [], quoteIds: ['QT-2026-1042'], createdAt: '2024-06-20T00:00:00Z' }
  ];

demoStore.products = [
    { id: 'PT-100', sku: 'PT-100', name: 'PTX-400 HART 316L', category: 'Pressure Transmitters', description: 'High-accuracy pressure transmitter with HART communication, 316L wetted parts', specifications: { 'Pressure Range': '0-10 bar / 0-150 psi', 'Output': '4-20 mA HART', 'Accuracy': '±0.075% of span', 'Process Connection': '1/2" NPT Male (configurable)', 'Wetted Material': '316L Stainless Steel', 'Protection': 'IP67 / NEMA 4X', 'Certifications': 'ATEX Zone 1, IECEx, SIL 2', 'Temperature Range': '-40 to +85°C', 'Power Supply': '12-42 VDC' }, stock: 75, leadTimeWeeks: 2, listPrice: { INR: 95000, USD: 1140, EUR: 1050 }, cogs: { INR: 66500, USD: 798, EUR: 735 }, supportedMarkets: ['IN', 'US', 'EU'], status: 'ACTIVE', matchReasons: ['Pressure range matches', 'Output matches', 'IP rating matches', 'Material matches', 'Certification matches', 'Stock available', 'Lead time meets requirement'] },
    { id: 'PT-220', sku: 'PT-220', name: 'PTX-220 Standard', category: 'Pressure Transmitters', description: 'Cost-effective pressure transmitter for general industrial applications', specifications: { 'Pressure Range': '0-16 bar / 0-230 psi', 'Output': '4-20 mA', 'Accuracy': '±0.15% of span', 'Process Connection': '1/2" NPT Male', 'Wetted Material': '316L Stainless Steel', 'Protection': 'IP66', 'Certifications': 'CE, UL', 'Temperature Range': '-20 to +80°C', 'Power Supply': '10-30 VDC' }, stock: 20, leadTimeWeeks: 4, listPrice: { INR: 68000, USD: 815, EUR: 750 }, cogs: { INR: 47600, USD: 570, EUR: 525 }, supportedMarkets: ['IN', 'US', 'EU'], status: 'ACTIVE', matchReasons: ['Pressure range exceeds requirement', 'Output matches', 'Material matches', 'Lower IP rating (IP66 vs IP67)', 'No ATEX certification', 'Stock limited', 'Lead time exceeds requirement'] },
    { id: 'PT-310', sku: 'PT-310', name: 'PTX-310 Premium', category: 'Pressure Transmitters', description: 'Premium pressure transmitter with advanced diagnostics and wireless HART', specifications: { 'Pressure Range': '0-10 bar / 0-150 psi', 'Output': '4-20 mA HART 7 / WirelessHART', 'Accuracy': '±0.04% of span', 'Process Connection': '1/2" NPT Male, 1/2" BSP, Tri-clamp (configurable)', 'Wetted Material': '316L Stainless Steel, Hastelloy C276 (optional)', 'Protection': 'IP69K', 'Certifications': 'ATEX Zone 0, IECEx, SIL 3, NAMUR NE107', 'Temperature Range': '-50 to +100°C', 'Power Supply': '10-48 VDC' }, stock: 100, leadTimeWeeks: 1, listPrice: { INR: 145000, USD: 1740, EUR: 1600 }, cogs: { INR: 101500, USD: 1218, EUR: 1120 }, supportedMarkets: ['IN', 'US', 'EU'], status: 'ACTIVE', matchReasons: ['Pressure range matches', 'Output exceeds requirement', 'IP rating exceeds requirement', 'Certification exceeds requirement', 'Excellent stock', 'Best lead time', 'Premium pricing'] }
  ];
  
  demoStore.quotes = [
    { id: 'QT-2026-1042', quoteNumber: 'QT-2026-1042', version: 1, rfqId: 'RFQ-2026-0042', customerId: 'CUST-001', status: 'DRAFT', currency: 'INR', exchangeRate: 1, baseCurrency: 'INR', lineItems: [], subtotal: 0, discount: 0, discountPercent: 0, tax: 0, taxRate: 18, total: 0, margin: 0, marginPercent: 0, marginFloor: 15, marginException: null, paymentTerms: 'Net 15', incoterms: 'DAP', validityDays: 30, assumptions: [], exceptions: [], approvals: [{ role: 'TECHNICAL_APPROVER', status: 'PENDING', approver: null, timestamp: null, comment: null }, { role: 'COMMERCIAL_MANAGER', status: 'PENDING', approver: null, timestamp: null, comment: null }, { role: 'FINANCE_REVIEWER', status: 'PENDING', approver: null, timestamp: null, comment: null }], fxLocked: false, fxLockTimestamp: null, createdAt: '2026-09-03T15:00:00Z', updatedAt: '2026-09-03T15:00:00Z', releasedAt: null, releasedBy: null }
  ];
  
  demoStore.notifications = [
    { id: 'NOTIF-001', type: 'WARNING', title: 'RFQ requires clarification', message: 'RFQ-2026-0042 is missing mandatory process connection specification', relatedEntity: 'RFQ-2026-0042', relatedType: 'rfq', read: false, createdAt: '2026-09-03T14:30:00Z' },
    { id: 'NOTIF-002', type: 'INFO', title: 'Technical override recorded', message: 'Process connection override approved for RFQ-2026-0042', relatedEntity: 'RFQ-2026-0042', relatedType: 'rfq', read: false, createdAt: '2026-09-03T15:00:00Z' },
    { id: 'NOTIF-003', type: 'SUCCESS', title: 'Product matched', message: 'PT-100 selected for RFQ-2026-0042 with 96% fit', relatedEntity: 'RFQ-2026-0042', relatedType: 'rfq', read: true, createdAt: '2026-09-03T15:30:00Z' }
  ];
demoStore.users = [
    { id: 'USR-001', name: 'Adarsh Sharma', email: 'adarsh@quotepilot.ai', role: 'SUPER_ADMIN', status: 'ACTIVE', organization: 'Apex Flow Control', lastActivity: '2026-09-25T10:00:00Z' },
    { id: 'USR-002', name: 'Rajesh Kumar', email: 'rajesh.kumar@apex-ind.com', role: 'SALES_USER', status: 'ACTIVE', organization: 'Apex Flow Control', lastActivity: '2026-09-24T16:30:00Z' },
    { id: 'USR-003', name: 'Priya Sharma', email: 'priya@quotepilot.ai', role: 'TECHNICAL_APPROVER', status: 'ACTIVE', organization: 'Apex Flow Control', lastActivity: '2026-09-25T09:15:00Z' },
    { id: 'USR-004', name: 'Vikram Singh', email: 'vikram@quotepilot.ai', role: 'COMMERCIAL_MANAGER', status: 'ACTIVE', organization: 'Apex Flow Control', lastActivity: '2026-09-25T11:00:00Z' },
    { id: 'USR-005', name: 'Anita Desai', email: 'anita@quotepilot.ai', role: 'FINANCE_REVIEWER', status: 'ACTIVE', organization: 'Apex Flow Control', lastActivity: '2026-09-24T14:20:00Z' }
  ];
  
  demoStore.roles = [
    { id: 'SUPER_ADMIN', name: 'Super Admin', permissions: ['*'] },
    { id: 'ORGANIZATION_ADMIN', name: 'Organization Admin', permissions: ['rfq.*', 'quote.*', 'product.*', 'customer.*', 'pricing.*', 'approval.*', 'audit.*', 'user.view', 'user.edit', 'org.edit', 'settings.*'] },
    { id: 'SALES_MANAGER', name: 'Sales Manager', permissions: ['rfq.*', 'quote.create', 'quote.view', 'quote.edit', 'product.view', 'customer.*', 'pricing.view', 'approval.view', 'audit.view'] },
    { id: 'SALES_USER', name: 'Sales User', permissions: ['rfq.create', 'rfq.view', 'rfq.edit', 'quote.create', 'quote.view', 'product.view', 'customer.view', 'pricing.view'] },
    { id: 'TECHNICAL_APPROVER', name: 'Technical Approver', permissions: ['rfq.view', 'quote.view', 'product.view', 'approval.technical', 'audit.view'] },
    { id: 'COMMERCIAL_MANAGER', name: 'Commercial Manager', permissions: ['rfq.view', 'quote.view', 'quote.edit', 'product.view', 'pricing.*', 'approval.commercial', 'audit.view'] },
    { id: 'FINANCE_REVIEWER', name: 'Finance Reviewer', permissions: ['rfq.view', 'quote.view', 'pricing.view', 'approval.finance', 'audit.view', 'currency.*'] },
    { id: 'VIEWER', name: 'Viewer', permissions: ['rfq.view', 'quote.view', 'product.view', 'customer.view', 'audit.view'] }
  ];
  
  demoStore.allPermissions = ['rfq.create', 'rfq.view', 'rfq.edit', 'rfq.delete', 'quote.create', 'quote.view', 'quote.edit', 'quote.delete', 'quote.approve', 'quote.release', 'product.create', 'product.view', 'product.edit', 'product.delete', 'customer.create', 'customer.view', 'customer.edit', 'customer.delete', 'pricing.view', 'pricing.edit', 'pricing.override', 'approval.technical', 'approval.commercial', 'approval.finance', 'approval.view', 'audit.view', 'audit.export', 'currency.view', 'currency.edit', 'user.create', 'user.view', 'user.edit', 'user.delete', 'user.manage', 'role.create', 'role.view', 'role.edit', 'role.delete', 'org.view', 'org.edit', 'settings.view', 'settings.edit', 'integration.view', 'integration.edit'];
}

initDemoData();
// ============================================
// HELPER FUNCTIONS
// ============================================

function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

function addAuditEvent(entityType, entityId, action, details = {}, userId = 'SYSTEM') {
  demoStore.auditEvents.push({
    id: generateId('AUD'),
    entityType,
    entityId,
    action,
    details,
    userId,
    timestamp: new Date().toISOString()
  });
}

function addNotification(type, title, message, relatedEntity, relatedType) {
  demoStore.notifications.push({
    id: generateId('NOTIF'),
    type,
    title,
    message,
    relatedEntity,
    relatedType,
    read: false,
    createdAt: new Date().toISOString()
  });
}

function getCurrentUser() {
  return demoStore.currentUser;
}

function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user) return false;
  const role = demoStore.roles.find(r => r.id === user.role);
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  return role.permissions.some(p => {
    if (p.endsWith('.*')) {
      return permission.startsWith(p.slice(0, -1));
    }
    return p === permission;
  });
}

// ============================================
// RFQ SERVICE
// ============================================

class RFQService {
  static getAll() {
    return [...demoStore.rfqs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  static getById(id) {
    return demoStore.rfqs.find(r => r.id === id) || null;
  }
  
  static getByCustomer(customerId) {
    return demoStore.rfqs.filter(r => r.customerId === customerId);
  }
  
  static getByStatus(status) {
    return demoStore.rfqs.filter(r => r.status === status);
  }
  
  static create(data) {
    const rfq = {
      id: generateId('RFQ'),
      rfqNumber: `RFQ-${new Date().getFullYear()}-${String(demoStore.rfqs.length + 1).padStart(4, '0')}`,
      ...data,
      stage: 1,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      requirements: data.requirements || [],
      attachments: data.attachments || [],
      clarification: null,
      technicalOverride: null,
      selectedProductId: null,
      commercial: null,
      approvals: [],
      auditEvents: []
    };
    demoStore.rfqs.push(rfq);
    addAuditEvent('rfq', rfq.id, 'CREATED', { rfqNumber: rfq.rfqNumber });
    return rfq;
  }
  
  static update(id, data) {
    const idx = demoStore.rfqs.findIndex(r => r.id === id);
    if (idx === -1) return null;
    demoStore.rfqs[idx] = { ...demoStore.rfqs[idx], ...data, updatedAt: new Date().toISOString() };
    addAuditEvent('rfq', id, 'UPDATED', data);
    return demoStore.rfqs[idx];
  }
  
  static delete(id) {
    const idx = demoStore.rfqs.findIndex(r => r.id === id);
    if (idx === -1) return false;
    demoStore.rfqs.splice(idx, 1);
    addAuditEvent('rfq', id, 'DELETED', {});
    return true;
  }
  
  static updateRequirements(id, requirements) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.requirements = requirements;
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'REQUIREMENTS_UPDATED', { count: requirements.length });
    return rfq;
  }

  static requestClarification(id, fields) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.clarification = {
      id: generateId('CLR'),
      rfqId: id,
      status: 'PENDING',
      requestedFields: fields,
      sentAt: new Date().toISOString(),
      responseReceivedAt: null
    };
    rfq.status = 'CLARIFICATION_REQUIRED';
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'CLARIFICATION_REQUESTED', { fields });
    addNotification('WARNING', 'RFQ requires clarification', `RFQ ${rfq.rfqNumber} is missing mandatory specifications`, id, 'rfq');
    return rfq;
  }
  
  static receiveClarification(id, responses) {
    const rfq = this.getById(id);
    if (!rfq || !rfq.clarification) return null;
    rfq.clarification.status = 'RECEIVED';
    rfq.clarification.responseReceivedAt = new Date().toISOString();
    rfq.clarification.responses = responses;
    rfq.status = 'UNDER_REVIEW';
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'CLARIFICATION_RECEIVED', { fields: Object.keys(responses) });
    return rfq;
  }
  
  static setTechnicalOverride(id, override) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.technicalOverride = {
      ...override,
      id: generateId('TOV'),
      rfqId: id,
      createdAt: new Date().toISOString(),
      createdBy: getCurrentUser()?.id || 'SYSTEM'
    };
    rfq.status = 'TECHNICAL_OVERRIDE';
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'TECHNICAL_OVERRIDE', override);
    addNotification('INFO', 'Technical override recorded', `Override approved for ${rfq.rfqNumber}`, id, 'rfq');
    return rfq;
  }
  
  static selectProduct(id, productId) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.selectedProductId = productId;
    rfq.status = 'PRODUCT_SELECTED';
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'PRODUCT_SELECTED', { productId });
    const product = demoStore.products.find(p => p.id === productId);
    if (product) {
      addNotification('SUCCESS', 'Product matched', `${product.name} selected for ${rfq.rfqNumber} with 96% fit`, id, 'rfq');
    }
    return rfq;
  }
  
  static setCommercial(id, commercial) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.commercial = { ...commercial, createdAt: new Date().toISOString() };
    rfq.status = 'COMMERCIAL_READY';
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'COMMERCIAL_SET', commercial);
    return rfq;
  }
  
  static advanceStage(id) {
    const rfq = this.getById(id);
    if (!rfq) return null;
    rfq.stage = Math.min(rfq.stage + 1, 5);
    rfq.updatedAt = new Date().toISOString();
    addAuditEvent('rfq', id, 'STAGE_ADVANCED', { stage: rfq.stage });
    return rfq;
  }
}

// ============================================
// QUOTE SERVICE
// ============================================

class QuoteService {
  static getAll() {
    return [...demoStore.quotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  static getById(id) {
    return demoStore.quotes.find(q => q.id === id) || null;
  }
  
  static getByRfq(rfqId) {
    return demoStore.quotes.filter(q => q.rfqId === rfqId);
  }
  
  static create(data) {
    const quote = {
      id: generateId('QT'),
      quoteNumber: `QT-${new Date().getFullYear()}-${String(demoStore.quotes.length + 1).padStart(4, '0')}`,
      version: 1,
      ...data,
      status: 'DRAFT',
      lineItems: data.lineItems || [],
      subtotal: 0,
      discount: 0,
      discountPercent: 0,
      tax: 0,
      taxRate: data.taxRate || 18,
      total: 0,
      margin: 0,
      marginPercent: 0,
      marginFloor: demoStore.pricingRules.marginFloor,
      marginException: null,
      approvals: [
        { role: 'TECHNICAL_APPROVER', status: 'PENDING', approver: null, timestamp: null, comment: null },
        { role: 'COMMERCIAL_MANAGER', status: 'PENDING', approver: null, timestamp: null, comment: null },
        { role: 'FINANCE_REVIEWER', status: 'PENDING', approver: null, timestamp: null, comment: null }
      ],
      fxLocked: false,
      fxLockTimestamp: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releasedAt: null,
      releasedBy: null
    };
    this.recalculate(quote);
    demoStore.quotes.push(quote);
    addAuditEvent('quote', quote.id, 'CREATED', { quoteNumber: quote.quoteNumber });
    return quote;
  }
static update(id, data) {
    const idx = demoStore.quotes.findIndex(q => q.id === id);
    if (idx === -1) return null;
    demoStore.quotes[idx] = { ...demoStore.quotes[idx], ...data, updatedAt: new Date().toISOString() };
    this.recalculate(demoStore.quotes[idx]);
    addAuditEvent('quote', id, 'UPDATED', data);
    return demoStore.quotes[idx];
  }
  
  static delete(id) {
    const idx = demoStore.quotes.findIndex(q => q.id === id);
    if (idx === -1) return false;
    demoStore.quotes.splice(idx, 1);
    addAuditEvent('quote', id, 'DELETED', {});
    return true;
  }
  
  static recalculate(quote) {
    quote.subtotal = quote.lineItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    quote.discount = quote.subtotal * (quote.discountPercent / 100);
    const taxable = quote.subtotal - quote.discount;
    quote.tax = taxable * (quote.taxRate / 100);
    quote.total = taxable + quote.tax;
    const cogs = quote.lineItems.reduce((sum, item) => sum + ((item.cogs || 0) * item.quantity), 0);
    quote.margin = taxable - cogs;
    quote.marginPercent = taxable > 0 ? ((quote.margin / taxable) * 100) : 0;
  }
  
  static addLineItem(quoteId, item) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    const lineItem = {
      id: generateId('LI'),
      ...item,
      totalPrice: item.unitPrice * item.quantity
    };
    quote.lineItems.push(lineItem);
    this.recalculate(quote);
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'LINE_ITEM_ADDED', { itemId: lineItem.id });
    return quote;
  }

  static updateLineItem(quoteId, itemId, data) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    const idx = quote.lineItems.findIndex(i => i.id === itemId);
    if (idx === -1) return null;
    quote.lineItems[idx] = { ...quote.lineItems[idx], ...data, totalPrice: (data.unitPrice || quote.lineItems[idx].unitPrice) * (data.quantity || quote.lineItems[idx].quantity) };
    this.recalculate(quote);
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'LINE_ITEM_UPDATED', { itemId });
    return quote;
  }
  
  static removeLineItem(quoteId, itemId) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    quote.lineItems = quote.lineItems.filter(i => i.id !== itemId);
    this.recalculate(quote);
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'LINE_ITEM_REMOVED', { itemId });
    return quote;
  }
  
  static setDiscount(quoteId, percent) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    quote.discountPercent = percent;
    this.recalculate(quote);
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'DISCOUNT_SET', { percent });
    return quote;
  }
  
  static lockFx(quoteId) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    quote.fxLocked = true;
    quote.fxLockTimestamp = new Date().toISOString();
    quote.exchangeRate = demoStore.exchangeRates[quote.baseCurrency]?.[quote.currency] || 1;
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'FX_LOCKED', { rate: quote.exchangeRate });
    return quote;
  }
  
  static submitForApproval(quoteId) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    quote.status = 'PENDING_APPROVAL';
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'SUBMITTED_FOR_APPROVAL', {});
    addNotification('INFO', 'Quote submitted for approval', `Quote ${quote.quoteNumber} is pending approval`, quoteId, 'quote');
    return quote;
  }
  
  static approve(quoteId, role, approverId, comment) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    const approval = quote.approvals.find(a => a.role === role);
    if (approval) {
      approval.status = 'APPROVED';
      approval.approver = approverId;
      approval.timestamp = new Date().toISOString();
      approval.comment = comment;
    }
    const allApproved = quote.approvals.every(a => a.status === 'APPROVED');
    if (allApproved) {
      quote.status = 'APPROVED';
    }
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'APPROVAL', { role, status: approval?.status });
    return quote;
  }
static release(quoteId, userId) {
    const quote = this.getById(quoteId);
    if (!quote) return null;
    if (quote.status !== 'APPROVED') return null;
    quote.status = 'RELEASED';
    quote.releasedAt = new Date().toISOString();
    quote.releasedBy = userId;
    quote.updatedAt = new Date().toISOString();
    addAuditEvent('quote', quoteId, 'RELEASED', { releasedBy: userId });
    addNotification('SUCCESS', 'Quote released', `Quote ${quote.quoteNumber} has been released to customer`, quoteId, 'quote');
    return quote;
  }
  
  static createRevision(quoteId) {
    const original = this.getById(quoteId);
    if (!original) return null;
    const revision = {
      ...original,
      id: generateId('QT'),
      quoteNumber: original.quoteNumber,
      version: original.version + 1,
      status: 'DRAFT',
      approvals: [
        { role: 'TECHNICAL_APPROVER', status: 'PENDING', approver: null, timestamp: null, comment: null },
        { role: 'COMMERCIAL_MANAGER', status: 'PENDING', approver: null, timestamp: null, comment: null },
        { role: 'FINANCE_REVIEWER', status: 'PENDING', approver: null, timestamp: null, comment: null }
      ],
      fxLocked: false,
      fxLockTimestamp: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      releasedAt: null,
      releasedBy: null,
      parentQuoteId: original.id
    };
    demoStore.quotes.push(revision);
    addAuditEvent('quote', revision.id, 'REVISION_CREATED', { parentQuoteId: original.id, version: revision.version });
    return revision;
  }
}

// ============================================
// PRODUCT SERVICE
// ============================================

class ProductService {
  static getAll() {
    return [...demoStore.products].filter(p => p.status === 'ACTIVE');
  }
  
  static getById(id) {
    return demoStore.products.find(p => p.id === id) || null;
  }
  
  static getByCategory(category) {
    return demoStore.products.filter(p => p.category === category && p.status === 'ACTIVE');
  }
  
  static matchRequirements(requirements) {
    const activeProducts = this.getAll();
    return activeProducts.map(product => {
      let matchScore = 0;
      let matchedCount = 0;
      const reasons = [];
      
      for (const req of requirements) {
        if (req.status === 'MISSING') continue;
        matchedCount++;
        const specValue = Object.values(product.specifications).find(v => 
          v.toString().toLowerCase().includes(req.normalizedValue?.toLowerCase() || '')
        );
        if (specValue) {
          matchScore += 1;
          reasons.push(`${req.field} matches`);
        }
      }
      
      if (product.stock > 0) {
        matchScore += 0.5;
        reasons.push('Stock available');
      }
      
      if (product.leadTimeWeeks <= 4) {
        matchScore += 0.5;
        reasons.push('Lead time acceptable');
      }
      
      const fitPercent = matchedCount > 0 ? Math.round((matchScore / matchedCount) * 100) : 0;
      
      return {
        product,
        fitPercent: Math.min(fitPercent, 100),
        reasons,
        stock: product.stock,
        leadTimeWeeks: product.leadTimeWeeks
      };
    }).sort((a, b) => b.fitPercent - a.fitPercent);
  }
  
  static create(data) {
    const product = {
      id: generateId('PT'),
      sku: data.sku || generateId('SKU'),
      ...data,
      specifications: data.specifications || {},
      stock: data.stock || 0,
      leadTimeWeeks: data.leadTimeWeeks || 4,
      listPrice: data.listPrice || {},
      cogs: data.cogs || {},
      supportedMarkets: data.supportedMarkets || ['IN'],
      status: 'ACTIVE',
      matchReasons: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    demoStore.products.push(product);
    addAuditEvent('product', product.id, 'CREATED', { sku: product.sku });
    return product;
  }
  
  static update(id, data) {
    const idx = demoStore.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    demoStore.products[idx] = { ...demoStore.products[idx], ...data, updatedAt: new Date().toISOString() };
    addAuditEvent('product', id, 'UPDATED', data);
    return demoStore.products[idx];
  }
  
  static delete(id) {
    const idx = demoStore.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    demoStore.products.splice(idx, 1);
    addAuditEvent('product', id, 'DELETED', {});
    return true;
  }
  
  static updateStock(id, quantity) {
    const product = this.getById(id);
    if (!product) return null;
    product.stock = Math.max(0, product.stock + quantity);
    product.updatedAt = new Date().toISOString();
    addAuditEvent('product', id, 'STOCK_UPDATED', { newStock: product.stock });
    return product;
  }
}
// ============================================
// CUSTOMER SERVICE
// ============================================

class CustomerService {
  static getAll() {
    return [...demoStore.customers].filter(c => c.status === 'ACTIVE');
  }
  
  static getById(id) {
    return demoStore.customers.find(c => c.id === id) || null;
  }
  
  static getByCountry(country) {
    return demoStore.customers.filter(c => c.country === country && c.status === 'ACTIVE');
  }
  
  static create(data) {
    const customer = {
      id: generateId('CUST'),
      ...data,
      contacts: data.contacts || [],
      rfqIds: [],
      quoteIds: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    demoStore.customers.push(customer);
    addAuditEvent('customer', customer.id, 'CREATED', { name: customer.name });
    return customer;
  }
  
  static update(id, data) {
    const idx = demoStore.customers.findIndex(c => c.id === id);
    if (idx === -1) return null;
    demoStore.customers[idx] = { ...demoStore.customers[idx], ...data, updatedAt: new Date().toISOString() };
    addAuditEvent('customer', id, 'UPDATED', data);
    return demoStore.customers[idx];
  }
  
  static delete(id) {
    const idx = demoStore.customers.findIndex(c => c.id === id);
    if (idx === -1) return false;
    demoStore.customers.splice(idx, 1);
    addAuditEvent('customer', id, 'DELETED', {});
    return true;
  }
  
  static addContact(customerId, contact) {
    const customer = this.getById(customerId);
    if (!customer) return null;
    const newContact = { id: generateId('CON'), ...contact };
    customer.contacts.push(newContact);
    customer.updatedAt = new Date().toISOString();
    addAuditEvent('customer', customerId, 'CONTACT_ADDED', { contactId: newContact.id });
    return customer;
  }
  
  static updateContact(customerId, contactId, data) {
    const customer = this.getById(customerId);
    if (!customer) return null;
    const idx = customer.contacts.findIndex(c => c.id === contactId);
    if (idx === -1) return null;
    customer.contacts[idx] = { ...customer.contacts[idx], ...data };
    customer.updatedAt = new Date().toISOString();
    addAuditEvent('customer', customerId, 'CONTACT_UPDATED', { contactId });
    return customer;
  }
}

// ============================================
// USER SERVICE
// ============================================

class UserService {
  static getAll() {
    return [...demoStore.users];
  }
  
  static getById(id) {
    return demoStore.users.find(u => u.id === id) || null;
  }
  
  static getByRole(role) {
    return demoStore.users.filter(u => u.role === role);
  }
  
  static create(data) {
    const user = {
      id: generateId('USR'),
      ...data,
      status: 'ACTIVE',
      organization: data.organization || demoStore.currentTenant,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    demoStore.users.push(user);
    addAuditEvent('user', user.id, 'CREATED', { name: user.name, role: user.role });
    return user;
  }
  
  static update(id, data) {
    const idx = demoStore.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    demoStore.users[idx] = { ...demoStore.users[idx], ...data, updatedAt: new Date().toISOString() };
    addAuditEvent('user', id, 'UPDATED', data);
    return demoStore.users[idx];
  }
  
  static delete(id) {
    const idx = demoStore.users.findIndex(u => u.id === id);
    if (idx === -1) return false;
    demoStore.users.splice(idx, 1);
    addAuditEvent('user', id, 'DELETED', {});
    return true;
  }
  
  static setActive(id, active) {
    const user = this.getById(id);
    if (!user) return null;
    user.status = active ? 'ACTIVE' : 'INACTIVE';
    user.updatedAt = new Date().toISOString();
    addAuditEvent('user', id, active ? 'ACTIVATED' : 'DEACTIVATED', {});
    return user;
  }
  
  static getRoles() {
    return [...demoStore.roles];
  }
  
  static getPermissions() {
    return [...demoStore.allPermissions];
  }
  
  static checkPermission(userId, permission) {
    const user = this.getById(userId);
    if (!user) return false;
    const role = demoStore.roles.find(r => r.id === user.role);
    if (!role) return false;
    if (role.permissions.includes('*')) return true;
    return role.permissions.some(p => {
      if (p.endsWith('.*')) {
        return permission.startsWith(p.slice(0, -1));
      }
      return p === permission;
    });
  }
}

// ============================================
// NOTIFICATION SERVICE
// ============================================

class NotificationService {
  static getAll(unreadOnly = false) {
    let notifications = [...demoStore.notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }
    return notifications;
  }
  
  static getUnreadCount() {
    return demoStore.notifications.filter(n => !n.read).length;
  }
  
  static markAsRead(id) {
    const notification = demoStore.notifications.find(n => n.id === id);
    if (!notification) return null;
    notification.read = true;
    return notification;
  }
  
  static markAllAsRead() {
    demoStore.notifications.forEach(n => n.read = true);
    return demoStore.notifications.length;
  }
  
  static create(type, title, message, relatedEntity, relatedType) {
    const notification = {
      id: generateId('NOTIF'),
      type,
      title,
      message,
      relatedEntity,
      relatedType,
      read: false,
      createdAt: new Date().toISOString()
    };
    demoStore.notifications.push(notification);
    return notification;
  }
  
  static delete(id) {
    const idx = demoStore.notifications.findIndex(n => n.id === id);
    if (idx === -1) return false;
    demoStore.notifications.splice(idx, 1);
    return true;
  }
}
// ============================================
// AUDIT SERVICE
// ============================================

class AuditService {
  static getAll(filters = {}) {
    let events = [...demoStore.auditEvents].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (filters.entityType) {
      events = events.filter(e => e.entityType === filters.entityType);
    }
    if (filters.entityId) {
      events = events.filter(e => e.entityId === filters.entityId);
    }
    if (filters.action) {
      events = events.filter(e => e.action === filters.action);
    }
    if (filters.userId) {
      events = events.filter(e => e.userId === filters.userId);
    }
    if (filters.startDate) {
      events = events.filter(e => new Date(e.timestamp) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      events = events.filter(e => new Date(e.timestamp) <= new Date(filters.endDate));
    }
    
    return events;
  }
  
  static getByEntity(entityType, entityId) {
    return demoStore.auditEvents
      .filter(e => e.entityType === entityType && e.entityId === entityId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  
  static export(filters = {}) {
    const events = this.getAll(filters);
    const headers = ['Timestamp', 'Entity Type', 'Entity ID', 'Action', 'User', 'Details'];
    const rows = events.map(e => [
      e.timestamp,
      e.entityType,
      e.entityId,
      e.action,
      e.userId,
      JSON.stringify(e.details)
    ]);
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  }
  
  static getStats() {
    const total = demoStore.auditEvents.length;
    const byType = {};
    const byAction = {};
    const byUser = {};
    
    for (const event of demoStore.auditEvents) {
      byType[event.entityType] = (byType[event.entityType] || 0) + 1;
      byAction[event.action] = (byAction[event.action] || 0) + 1;
      byUser[event.userId] = (byUser[event.userId] || 0) + 1;
    }
    
    return { total, byType, byAction, byUser };
  }
}
// ============================================
// AUTH SERVICE
// ============================================

class AuthService {
  static login(email, password) {
    // Demo: accept any password for demo users
    const user = demoStore.users.find(u => u.email === email && u.status === 'ACTIVE');
    if (user) {
      demoStore.currentUser = user;
      user.lastActivity = new Date().toISOString();
      addAuditEvent('auth', user.id, 'LOGIN', { email });
      return { user, token: `demo-token-${user.id}-${Date.now()}` };
    }
    return null;
  }
  
  static logout() {
    if (demoStore.currentUser) {
      addAuditEvent('auth', demoStore.currentUser.id, 'LOGOUT', {});
      demoStore.currentUser = null;
    }
    return true;
  }
  
  static getCurrentUser() {
    return demoStore.currentUser;
  }
  
  static setCurrentUser(userId) {
    const user = demoStore.users.find(u => u.id === userId);
    if (user) {
      demoStore.currentUser = user;
      return user;
    }
    return null;
  }
  
  static setCurrentRole(role) {
    demoStore.currentRole = role;
    return role;
  }
  
  static getCurrentRole() {
    return demoStore.currentRole;
  }
  
  static hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    const role = demoStore.roles.find(r => r.id === user.role);
    if (!role) return false;
    if (role.permissions.includes('*')) return true;
    return role.permissions.some(p => {
      if (p.endsWith('.*')) {
        return permission.startsWith(p.slice(0, -1));
      }
      return p === permission;
    });
  }
  
  static isAuthenticated() {
    return !!demoStore.currentUser;
  }
  
  static getTenant() {
    return demoStore.currentTenant;
  }
}

// ============================================
// CURRENCY SERVICE
// ============================================

class CurrencyService {
  static getCurrencies() {
    return [...demoStore.currencies];
  }
  
  static getCurrency(code) {
    return demoStore.currencies.find(c => c.code === code) || null;
  }
  
  static getExchangeRate(from, to) {
    return demoStore.exchangeRates[from]?.[to] || 1;
  }
  
  static convert(amount, from, to) {
    if (from === to) return amount;
    const rate = this.getExchangeRate(from, to);
    return Math.round(amount * rate * 100) / 100;
  }
  
  static format(amount, currencyCode, locale) {
    const currency = this.getCurrency(currencyCode);
    if (!currency) return `${amount}`;
    try {
      return new Intl.NumberFormat(locale || currency.locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2
      }).format(amount);
    } catch {
      return `${currency.symbol}${amount.toLocaleString()}`;
    }
  }
  
  static getTaxScenario(country) {
    return demoStore.taxScenarios[country] || demoStore.taxScenarios.IN;
  }
  
  static updateExchangeRate(from, to, rate) {
    if (!demoStore.exchangeRates[from]) {
      demoStore.exchangeRates[from] = {};
    }
    demoStore.exchangeRates[from][to] = rate;
    if (!demoStore.exchangeRates[to]) {
      demoStore.exchangeRates[to] = {};
    }
    demoStore.exchangeRates[to][from] = 1 / rate;
    addAuditEvent('currency', `${from}-${to}`, 'RATE_UPDATED', { from, to, rate });
    return this.getExchangeRate(from, to);
  }
}
// ============================================
// APPROVAL SERVICE
// ============================================

class ApprovalService {
  static getPendingApprovals(userId = null) {
    const approvals = [];
    for (const quote of demoStore.quotes) {
      for (const approval of quote.approvals) {
        if (approval.status === 'PENDING') {
          if (!userId || this.canApprove(userId, approval.role)) {
            approvals.push({
              quoteId: quote.id,
              quoteNumber: quote.quoteNumber,
              approvalRole: approval.role,
              createdAt: quote.createdAt
            });
          }
        }
      }
    }
    return approvals;
  }
  
  static canApprove(userId, role) {
    const user = demoStore.users.find(u => u.id === userId);
    if (!user) return false;
    const userRole = demoStore.roles.find(r => r.id === user.role);
    if (!userRole) return false;
    return userRole.permissions.some(p => {
      if (p === 'approval.*') return true;
      if (p === `approval.${role.toLowerCase()}`) return true;
      if (p.endsWith('.*') && `approval.${role.toLowerCase()}`.startsWith(p.slice(0, -1))) return true;
      return false;
    });
  }
  
  static approve(quoteId, role, userId, comment) {
    return QuoteService.approve(quoteId, role, userId, comment);
  }
  
  static reject(quoteId, role, userId, comment) {
    const quote = QuoteService.getById(quoteId);
    if (!quote) return null;
    const approval = quote.approvals.find(a => a.role === role);
    if (approval) {
      approval.status = 'REJECTED';
      approval.approver = userId;
      approval.timestamp = new Date().toISOString();
      approval.comment = comment;
      quote.status = 'REJECTED';
      quote.updatedAt = new Date().toISOString();
      addAuditEvent('quote', quoteId, 'REJECTED', { role, comment });
    }
    return quote;
  }
  
  static getApprovalHistory(quoteId) {
    const quote = QuoteService.getById(quoteId);
    if (!quote) return [];
    return quote.approvals.filter(a => a.status !== 'PENDING');
  }
}

// ============================================
// SETTINGS SERVICE
// ============================================

class SettingsService {
  static getPricingRules() {
    return { ...demoStore.pricingRules };
  }
  
  static updatePricingRules(rules) {
    demoStore.pricingRules = { ...demoStore.pricingRules, ...rules };
    addAuditEvent('settings', 'pricingRules', 'UPDATED', rules);
    return demoStore.pricingRules;
  }
  
  static getDiscountTiers() {
    return [...demoStore.pricingRules.discountTiers];
  }
  
  static updateDiscountTiers(tiers) {
    demoStore.pricingRules.discountTiers = tiers;
    addAuditEvent('settings', 'discountTiers', 'UPDATED', { tiers });
    return demoStore.pricingRules.discountTiers;
  }
  
  static getMarginFloor() {
    return demoStore.pricingRules.marginFloor;
  }
  
  static setMarginFloor(floor) {
    demoStore.pricingRules.marginFloor = floor;
    addAuditEvent('settings', 'marginFloor', 'UPDATED', { floor });
    return demoStore.pricingRules.marginFloor;
  }
  
  static getDefaultPaymentTerms() {
    return demoStore.pricingRules.defaultPaymentTerms;
  }
  
  static setDefaultPaymentTerms(terms) {
    demoStore.pricingRules.defaultPaymentTerms = terms;
    addAuditEvent('settings', 'defaultPaymentTerms', 'UPDATED', { terms });
    return demoStore.pricingRules.defaultPaymentTerms;
  }
  
  static getDefaultIncoterms() {
    return demoStore.pricingRules.defaultIncoterms;
  }
  
  static setDefaultIncoterms(incoterms) {
    demoStore.pricingRules.defaultIncoterms = incoterms;
    addAuditEvent('settings', 'defaultIncoterms', 'UPDATED', { incoterms });
    return demoStore.pricingRules.defaultIncoterms;
  }
  
  static getDefaultCurrency() {
    return demoStore.pricingRules.defaultCurrency;
  }
  
  static setDefaultCurrency(currency) {
    demoStore.pricingRules.defaultCurrency = currency;
    addAuditEvent('settings', 'defaultCurrency', 'UPDATED', { currency });
    return demoStore.pricingRules.defaultCurrency;
  }
}

// Export all services and helper functions
export { 
  RFQService, QuoteService, ProductService, CustomerService, 
  UserService, NotificationService, AuditService, AuthService,
  CurrencyService, ApprovalService, SettingsService,
  initDemoData, hasPermission, getCurrentUser, addNotification,
  demoStore
};
