// ==============================
// Blur Mode - script.js (options menu)
// ==============================

// Her checkbox için ayrı, kendi kapsamındaki selector grubu
const SELECTOR_GROUPS = {
  'sel-msg': [
    '[data-testid="msg-container"]',
    '[data-testid="quoted-message"]',
    '[data-testid="last-msg-status"]'
  ],
  'sel-convheader': [
    '[data-testid="conversation-info-header"]',
    '[data-testid="conversation-header"] img',
    '[data-testid="chat-info-drawer"] img',
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
  // Artık selector array'i değil, hangi grupların açık olduğunu tutuyoruz
  enabledGroups: ['sel-msg', 'sel-grid', 'sel-cellframe', 'sel-convheader', 'sel-img']
};

let currentTab = null;

document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];

  const settings = await chrome.storage.sync.get(DEFAULTS);

  // Her checkbox kendi ID'sinin enabledGroups içinde olup olmadığına bakıyor
  // -> artık başka bir checkbox'ın selector'ı yüzünden yanlışlıkla işaretlenmiyor
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

  // Hangi checkbox'lar işaretli, onu topla
  const enabledGroups = Object.keys(SELECTOR_GROUPS).filter(
    id => document.getElementById(id)?.checked
  );

  if (enabledGroups.length === 0) {
    showStatus('At least one element must be selected', true);
    return;
  }

  // content script'in kullanacağı nihai selector listesini gruplardan türet ve dedupe et
  const selectors = [...new Set(
    enabledGroups.flatMap(id => SELECTOR_GROUPS[id])
  )];

  await chrome.storage.sync.set({
    siteUrl,
    blurAmount: isNaN(blurAmount) ? DEFAULTS.blurAmount : blurAmount,
    enabledGroups,   // popup'ın checkbox durumlarını doğru yeniden yüklemesi için
    selectors         // content script'in gerçekte blur uygulayacağı selector'lar
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
