// ==============================
// Blur Mode - script.js (options menu)
// ==============================

// Separate selector group per checkbox, each with its own scope
const SELECTOR_GROUPS = {
  'sel-msg': [
    '[data-testid="msg-container"]',
    '[data-testid="quoted-message"]',
    //'[data-testid="last-msg-status"]'
  ],
  'sel-convheader': [
    '[data-testid="conversation-info-header"]',
    '[data-testid="conversation-header"] img',
    '[data-testid="chat-info-drawer"] img',
    '[data-testid="chat-info-drawer"] image',
    '[data-testid="contact-info-subtitle selectable-text"]',
    '[data-testid="chat-info-drawer"] [dir="auto"]'
  ],
  'sel-grid': [
    '[data-testid="cell-frame-title"]',
    '[data-testid="cell-frame-secondary"]',
    '[data-testid="cell-frame-primary-detail"]',
    '[data-testid="last-msg-status"]',
    '[role="gridcell"] img'
  ],
  'sel-cellframe': [
    '[data-testid="conversation-info-header"]',
    '[data-testid="cell-frame-title"]'
  ],
  'sel-img': [
    'img',
    '[data-testid="media-canvas-img"]'
  ]
};

const DEFAULTS = {
  siteUrl: 'https://web.whatsapp.com/',
  blurAmount: 5,
  autoEnable: true,
  // No longer a flat selector array — now we store which groups are enabled
  enabledGroups: ['sel-msg', 'sel-grid', 'sel-cellframe', 'sel-convheader', 'sel-img']
};

let currentTab = null;

document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];
  const settings = await chrome.storage.sync.get(DEFAULTS);
  document.getElementById('blurAmount').value = settings.blurAmount;
  const autoEl = document.getElementById('autoEnable');
  if (autoEl) autoEl.checked = settings.autoEnable;

  // Each checkbox checks whether its own ID is present in enabledGroups
  // -> no longer gets checked by mistake because of another checkbox's selector
  Object.keys(SELECTOR_GROUPS).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.checked = settings.enabledGroups.includes(id);
    }
  });

  const badge = await chrome.action.getBadgeText({ tabId: currentTab.id });
  updateToggleUI(badge === 'ON');
});

document.getElementById('toggleBtn').addEventListener('click', async () => {
  const badge = await chrome.action.getBadgeText({ tabId: currentTab.id });
  const nextState = badge === 'ON' ? 'OFF' : 'ON';

  const response = await chrome.runtime.sendMessage({
    action: 'toggle',
    tabId: currentTab.id,
    nextState: nextState
  });

  if (response && response.success) {
    updateToggleUI(nextState === 'ON');
  }
});

document.getElementById('save').addEventListener('click', async () => {
  const siteUrl = "https://web.whatsapp.com/";
  const blurAmount = parseInt(document.getElementById('blurAmount').value, 10);
  const autoEnable = document.getElementById('autoEnable').checked;

  // Collect which checkboxes are checked
  const enabledGroups = Object.keys(SELECTOR_GROUPS).filter(
    id => document.getElementById(id)?.checked
  );

  if (enabledGroups.length === 0) {
    showStatus('At least one element must be selected', true);
    return;
  }

  // Derive the final selector list the content script will use from the groups, and dedupe it
  const selectors = [...new Set(
    enabledGroups.flatMap(id => SELECTOR_GROUPS[id])
  )];

  await chrome.storage.sync.set({
    siteUrl,
    blurAmount: isNaN(blurAmount) ? DEFAULTS.blurAmount : blurAmount,
    autoEnable,
    enabledGroups,   // so the popup can correctly reload checkbox states
    selectors         // the selectors the content script will actually apply blur to
  });

  showStatus('SAVED ✓');
});

function updateToggleUI(isOn) {
  document.getElementById('stateLabel').textContent = `Status: ${isOn ? 'ON' : 'OFF'}`;
  document.getElementById('toggleBtn').checked = isOn;
}

function showStatus(message, isError = false) {
  const el = document.getElementById('status');
  el.textContent = message;
  el.style.color = isError ? '#ff5c5c' : '#63cb77';
  setTimeout(() => { el.textContent = ''; }, 2000);
}
