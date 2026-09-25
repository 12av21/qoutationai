/**
 * Analytics View
 */

import { registerView } from '../main.js';
import { layout, panel } from './ui.js';

function renderAnalytics() {
  return `
    <div class="dashboard-grid">
      <div class="panel"><div class="section-head"><h2>Quotation Volume</h2></div><div class="chart-placeholder">Chart: Quotations over time</div></div>
      <div class="panel"><div class="section-head"><h2>Win Rate</h2></div><div class="chart-placeholder">Chart: Win rate by month</div></div>
      <div class="panel"><div class="section-head"><h2>Average Deal Size</h2></div><div class="chart-placeholder">Chart: Avg deal size trend</div></div>
      <div class="panel"><div class="section-head"><h2>Processing Time</h2></div><div class="chart-placeholder">Chart: Time to quote</div></div>
    </div>
  `;
}

registerView('/analytics', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Analytics', 'BUSINESS INTELLIGENCE', renderAnalytics());
});