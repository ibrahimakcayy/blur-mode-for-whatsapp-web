// ==============================
// Blur Mode - background.js
// ==============================

//set default badge text to OFF when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: 'OFF' });
  //set default settings in the storage
  const defaults = {
    siteUrl: 'https://web.whatsapp.com/',
    blurAmount: 5,
    selectors: [
      '[data-testid="msg-container"]',
      '[data-testid="quoted-message"]',
      '[data-testid="last-msg-status"]',
      '[data-testid="cell-frame-title"]',
      '[data-testid="cell-frame-primary-detail"]',
      '[data-testid="cell-frame-secondary"]',
      '[role="gridcell"] img',
      '[data-testid="conversation-info-header"]',
      '[data-testid="conversation-header"] img',
      '[data-testid="chat-info-drawer"] img',
      '[data-testid="contact-info-subtitle selectable-text"]',
      '[data-testid="chat-info-drawer"] [dir="auto"]',
      '[data-testid="media-canvas-img"]',
      'img'
    ]
  };
  //get settings from storage and set them to the defaults
  chrome.storage.sync.get(defaults, (settings) => {
    chrome.storage.sync.set(settings);
  });
});

//this url is not injectable
function isInjectableUrl(url) {
  if (!url) return false;
  return !url.startsWith('chrome://') &&
         !url.startsWith('chrome-extension://') &&
         !url.startsWith('edge://') &&
         !url.startsWith('about:');
}

//get the settings 
async function getSettings() {
  return await chrome.storage.sync.get({
    siteUrl: 'https://web.whatsapp.com/',
    blurAmount: 5,
    selectors: [
      '[data-testid="msg-container"]',
      '[data-testid="quoted-message"]',
      '[data-testid="last-msg-status"]',
      '[data-testid="cell-frame-title"]',
      '[data-testid="cell-frame-primary-detail"]',
      '[data-testid="cell-frame-secondary"]',
      '[role="gridcell"] img',
      '[data-testid="conversation-info-header"]',
      '[data-testid="conversation-header"] img',
      '[data-testid="chat-info-drawer"] img',
      '[data-testid="contact-info-subtitle selectable-text"]',
      '[data-testid="chat-info-drawer"] [dir="auto"]',
      '[data-testid="media-canvas-img"]',
      'img'
    ]
  });
}

//build the css string to be injected based on the blur amount and selectors
function buildCss(blurAmount, selectors) {
  if (!selectors || selectors.length === 0) return '';
  return `
${selectors.join(',\n')} {

  filter: blur(${blurAmount}px);
}`;
}

//get the injected css for the tab from the session storage
async function getInjectedCss(tabId) {
  const result = await chrome.storage.session.get('injectedCssByTab');
  const map = result.injectedCssByTab || {};
  return map[tabId] || null;
}

//set the injected css for the tab in the session storage
async function setInjectedCss(tabId, cssStringOrNull) {
  const result = await chrome.storage.session.get('injectedCssByTab');
  const map = result.injectedCssByTab || {};

  if (cssStringOrNull) {
    map[tabId] = cssStringOrNull;
  } else {
    delete map[tabId];
  }
  await chrome.storage.session.set({ injectedCssByTab: map });
}

//apply the state (ON/OFF) to the tab by injecting or removing the css
async function applyState(tabId, nextState) {
  await chrome.action.setBadgeText({ tabId, text: nextState });

  const existingCss = await getInjectedCss(tabId);

  if (nextState === 'ON') {
    if (existingCss) return;
    const { blurAmount, selectors } = await getSettings();
    const cssString = buildCss(blurAmount, selectors);
    if (!cssString) return;
    try {
      await chrome.scripting.insertCSS({ css: cssString, target: { tabId } });
      await setInjectedCss(tabId, cssString)
      console.log('[applyState] insertCSS SUCCESS:', tabId);
    } catch (err) {
      console.error('[applyState] insertCSS FAILED:', err.message);
    }
  } else {
    if (!existingCss) return;
    try {
      await chrome.scripting.removeCSS({ css: existingCss, target: { tabId } });
      await setInjectedCss(tabId, null);
      console.log('[applyState] removeCSS SUCCESS:', tabId);
    } catch (err) {
      console.error('[applyState] removeCSS FAILED:', err.message);
    }
  }
}

chrome.tabs.onRemoved.addListener(async (tabId) => {
  await setInjectedCss(tabId, null);
});

//if the tab is updated and the url is whatsapp, apply the state based on the settings
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !isInjectableUrl(tab.url)) return;

  const { siteUrl } = await getSettings();
  const isMatch = tab.url.startsWith(siteUrl);

  await applyState(tabId, isMatch ? 'ON' : 'OFF');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggle') {
    applyState(message.tabId, message.nextState).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }
});

//for keyboard shortcut toggle
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-focus') return;

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!activeTab || !isInjectableUrl(activeTab.url)) return;

  const { siteUrl } = await getSettings();
  if (!activeTab.url.startsWith(siteUrl)) return;

  const badge = await chrome.action.getBadgeText({ tabId: activeTab.id });
  const nextState = badge === 'ON' ? 'OFF' : 'ON';

  await applyState(activeTab.id, nextState);
});
