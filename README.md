## ⚠️ Legal Disclaimer

Blur Mode is an independent, open-source browser extension and is **not affiliated with, endorsed by, or sponsored by WhatsApp or Meta**. "WhatsApp" is a trademark of its respective owner.

The extension only changes how WhatsApp Web **looks in your own browser** by applying a local CSS blur. It does not send messages, automate actions, read or collect your conversations, or transmit any data. The only data it stores is your own settings (blur intensity, selected elements, auto-enable), kept in `chrome.storage.sync`.

Because WhatsApp Web's interface can change at any time, parts of the extension may stop working without notice. The software is provided "as is", without warranty of any kind (see the [MIT License](#license)). Use it at your own discretion.

# Blur Mode 🫥

A Chrome extension (Manifest V3) that blurs messages, the chat list, and media content on WhatsApp Web, keeping your screen private from prying eyes.

## Features

- 🔒 Blurs message bubbles, the chat list, contact names, and media images on WhatsApp Web
- 🎚️ Adjustable blur intensity (0–30px)
- ✅ Choose which elements to blur from the popup (messages, contact names, chat list, images, etc.)
- 🚀 **Auto-enable option** – choose whether blur turns on automatically when WhatsApp Web loads; if disabled, turn it on manually via the popup toggle or `Ctrl+B`
- 🖱️ **Right-click context menu** – right-click any chat, message, or element to blur/unblur it individually on the spot, without opening the popup (manual blur uses a fixed 8px intensity)
- ⌨️ Keyboard shortcut to toggle on/off (`Ctrl+B` / `Cmd+B` on macOS)
- 🟢 Per-tab state tracking (ON/OFF indicator via badge)
- 💾 Settings are synced and stored using `chrome.storage.sync`

## Installation (Developer Mode)

1. Clone this repository:

```
git clone https://github.com/ibrahimakcayy/blur-mode-for-whatsapp-web.git
```

2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked**.
5. Select the `blur-mode-for-whatsapp-web` folder you cloned.
6. Click the extension icon to open the popup and configure your settings.

## Usage

- Click the extension icon and use the **Status** toggle in the popup to turn blurring on or off.
- Use the **Blur intensity** field to adjust the amount of blur (in px).
- Select which elements to blur using the checkboxes, then click **Save**.
- Use the **Auto-enable on WhatsApp Web** checkbox to control whether blur starts automatically when you open or refresh WhatsApp Web, then click **Save**. The `Ctrl+B` shortcut and the popup toggle work regardless of this setting.
- Use `Ctrl+B` (macOS: `Cmd+B`) to quickly toggle blurring on the active tab.
- **Right-click** on a chat item, message, or other supported element to open the custom context menu and blur/unblur that specific element instantly.

## Project Structure

```
blur-mode-for-whatsapp-web/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker: CSS injection, tab/badge state, commands, auto-enable logic
├── content.js         # Content script: custom right-click context menu (blur/unblur/lock)
├── options.html       # Popup UI
├── script.js          # Popup logic (read/write settings, toggle)
├── style.css          # Popup styles
├── blur-mode.css      # Reference/example static CSS (not used by the extension)
└── bos.png            # Extension icon
```

## How It Works

1. When a tab finishes loading, `background.js` reads settings from `chrome.storage.sync`. If the tab is WhatsApp Web and **Auto-enable** is on, blur is turned on; otherwise it stays off.
2. It builds a dynamic CSS string based on the selected selectors (`filter: blur(Npx);`).
3. It injects this CSS into the tab using `chrome.scripting.insertCSS`, and removes it with `removeCSS` when turned off.
4. The injected CSS is tracked per tab in `chrome.storage.session`, so the extension knows which CSS is active on which tab. This record is reset on every page load, since the browser discards injected CSS when a page reloads.
5. A content script (`content.js`) watches WhatsApp Web's DOM with a `MutationObserver` and clones (`cloneNode`) custom items into the native right-click context menu, letting you blur, unblur, or lock the element you right-clicked without going through the popup.

## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT
