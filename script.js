// ==============================
// Blur Mode - script.js-options menu
// ==============================
//set defaults for the extension settings and selectors to blur
const DEFAULTS = {
  siteUrl: 'https://web.whatsapp.com/',
  blurAmount: 5,
  selectors: [
    '[data-testid="msg-container"]',
    '[data-testid="quoted-message"]',
    '[data-testid="last-msg-status"]',
    '[data-testid="cell-frame-title"]',
    '[data-testid="conversation-info-header"]',
    '[data-testid="contact-info-subtitle selectable-text"]',
    '[data-testid="chat-info-drawer"] [dir="auto"]',
    '[data-testid="media-canvas-img"]',
    'img'
  ]
};

const CHECKBOX_IDS = ['sel-msg', 'sel-cellframe', 'sel-convheader', 'sel-img'];

let currentTab = null;

//get the active tab and initialize the UI
document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tabs[0];
  //sync stroge settings
  const settings = await chrome.storage.sync.get(DEFAULTS);
  //if checkboxes checked add the selectors to the settings.selectors array
  if (document.getElementById('sel-msg')) {
    document.getElementById('sel-msg').checked = [
      '[data-testid="msg-container"]',
      '[data-testid="quoted-message"]',
      '[data-testid="last-msg-status"]'
    ].some(sel => settings.selectors.includes(sel));
  }

  if (document.getElementById('sel-convheader')) {
    document.getElementById('sel-convheader').checked = [
      '[data-testid="conversation-info-header"]',
      '[data-testid="contact-info-subtitle selectable-text"]',
      '[data-testid="chat-info-drawer"] [dir="auto"]',
    ].some(sel => settings.selectors.includes(sel));
  }
  
  if (document.getElementById('sel-cellframe')) {
    document.getElementById('sel-cellframe').checked = settings.selectors.includes('[data-testid="cell-frame-title"]');
  }

  if (document.getElementById('sel-img')) {
    document.getElementById('sel-img').checked = [
      'img',
      '[data-testid="media-canvas-img"]',
    ].some(sel => settings.selectors.includes(sel));
  }
  //if tab is whatsapp and bagde is on show the badge
  const badge = await chrome.action.getBadgeText({ tabId: currentTab.id });
  updateToggleUI(badge === 'ON');
});

//toggle the extension on/off when the toggle button is clicked
document.getElementById('toggleBtn').addEventListener('click', async () => {
  const badge = await chrome.action.getBadgeText({ tabId: currentTab.id });
  const nextState = badge === 'ON' ? 'OFF' : 'ON';

  const response = await chrome.runtime.sendMessage({
    action: 'toggle',
    tabId: currentTab.id,
    nextState: nextState
  });
  //check if the response is successful
  if (response && response.success) {
    updateToggleUI(nextState === 'ON');
  }
});

//save the settings to the storage when the save button is clicked
document.getElementById('save').addEventListener('click', async () => {
  //set the siteUrl to the default value and get the blurAmount from the input field
  const siteUrl = "https://web.whatsapp.com/";
  const blurAmount = parseInt(document.getElementById('blurAmount').value, 10);
  let selectors = [];
  //check if the checkboxes are checked and add the selectors to the selectors array
  if (document.getElementById('sel-msg')?.checked) {
    selectors = [...selectors, '[data-testid="msg-container"]', 
      '[data-testid="quoted-message"]',
      '[data-testid="last-msg-status"]'];
  }

  if (document.getElementById('sel-convheader')?.checked) {
    selectors = [...selectors,
      '[data-testid="conversation-info-header"]',
      '[data-testid="contact-info-subtitle selectable-text"]',
      '[data-testid="chat-info-drawer"] [dir="auto"]'
    ];
  }

  if (document.getElementById('sel-cellframe')?.checked) {
    selectors = [...selectors, '[data-testid="cell-frame-title"]'];
  }

  if (document.getElementById('sel-gridcell')?.checked) {
    selectors = [...selectors, '[role="gridcell"]'];
  }

  if (document.getElementById('sel-img')?.checked) {
    selectors = [...selectors, 'img', '[data-testid="media-canvas-img"]'];
  }

  if (selectors.length === 0) {
    showStatus('At least one element must be selected', true);
    return;
  }
  //save the settings to the storage
  await chrome.storage.sync.set({
    siteUrl: siteUrl,
    blurAmount: isNaN(blurAmount) ? DEFAULTS.blurAmount : blurAmount,
    selectors: selectors
  });

  showStatus('SAVED ✓');
});

//set label text and toggle button
function updateToggleUI(isOn) {
  const label = document.getElementById('stateLabel');
  label.textContent = `Status: ${isOn ? 'ON' : 'OFF'}`;
  
  if (isOn == true) {
    document.getElementById('toggleBtn').checked = true;
  }
}

//show status message for 2 seconds
function showStatus(message, isError = false) {
  const el = document.getElementById('status');
  el.textContent = message;
  el.style.color = isError ? '#ff5c5c' : '#63cb77';
  setTimeout(() => { el.textContent = ''; }, 2000);
}
