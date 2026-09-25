/**
 * AI Agents View - Command center
 */

import { registerView } from '../main.js';
import { layout, panel } from './ui.js';

const agents = [
  { id: 'requirement', icon: '✦', name: 'Requirement Agent', status: 'active', desc: 'Extracts intent, quantities, services, and delivery terms from customer RFQs', lastRun: '2 min ago', processed: 24 },
  { id: 'matching', icon: '⌁', name: 'Product Matching Agent', status: 'active', desc: 'Finds best-fit products from catalog with confidence scoring', lastRun: '5 min ago', processed: 18 },
  { id: 'pricing', icon: '◈', name: 'Pricing Intelligence', status: 'active', desc: 'Applies discounts, tax rules, and margin calculations', lastRun: '1 min ago', processed: 42 },
  { id: 'validation', icon: '✓', name: 'Validation Agent', status: 'warning', desc: 'Reconciles every calculation, flags anomalies', lastRun: '3 min ago', processed: 8 }
];

function renderAgents() {
  return agents.map(a => `
    <div class="agent-card ${a.status}">
      <div class="agent-header"><span class="agent-icon">${a.icon}</span><div><strong>${a.name}</strong><small>${a.desc}</small></div><span class="pill ${a.status}">● ${a.status}</span></div>
      <div class="agent-stats"><div><span>${a.processed}</span><small>processed today</small></div><div><span>${a.lastRun}</span><small>last run</small></div></div>
      <div class="agent-actions"><button class="secondary" data-action="view-agent" data-id="${a.id}">Details</button><button class="primary" data-action="run-agent" data-id="${a.id}">Run Now</button></div>
    </div>
  `).join('');
}

registerView('/agents', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('AI Agents', 'COMMAND CENTER', `
    <div class="agents-grid">${renderAgents()}</div>
  `);
});

registerView('/agents/:id', async (routeInfo) => {
  const view = document.getElementById('view');
  const agent = agents.find(a => a.id === routeInfo.params.id);
  if (!agent) { view.innerHTML = layout('Not Found', 'NOT FOUND', '<div class="empty">Agent not found</div>'); return; }
  view.innerHTML = layout('Agent', agent.name, `<div class="panel"><p>${agent.desc}</p><p>Status: ${agent.status}</p><p>Processed: ${agent.processed}</p></div>`);
});