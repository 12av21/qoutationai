/**
 * Demo View - Minimal implementation
 */

import { registerView } from '../main.js';
import { layout, panel, button } from './ui.js';

function renderDemo() {
  return `
    <div class="panel demo-card" style="text-align: center; padding: 60px 20px;">
      <h2>Governed RFQ-to-Quote Demo</h2>
      <p class="muted">Experience the complete workflow from RFQ intake to audited quotation</p>
      ${button('Start Demo', { action: 'demo-start', variant: 'primary', icon: '▶ ' })}
    </div>
  `;
}

function runDemo() {
  import('../main.js').then(m => { m.toast('Demo workflow - use the landing page demo button for full experience'); m.navigate('/dashboard'); });
}

registerView('/demo', async (routeInfo) => {
  const view = document.getElementById('view');
  view.innerHTML = layout('Demo', 'GOVERNED RFQ DEMO', renderDemo());
  document.querySelector('[data-action="demo-start"]')?.addEventListener('click', runDemo);
});

export { runDemo };