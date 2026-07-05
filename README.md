# Blur Mode 🫥

A Chrome extension (Manifest V3) that blurs messages, the chat list, and media content on WhatsApp Web, keeping your screen private from prying eyes.

## Features

- 🔒 Blurs message bubbles, the chat list, contact names, and media images on WhatsApp Web
- 🎚️ Adjustable blur intensity (0–30px)
- ✅ Choose which elements to blur from the popup (messages, contact names, chat list, images, etc.)
- ⌨️ Keyboard shortcut to toggle on/off (`Ctrl+B` / `Cmd+B` on macOS)
- 🟢 Per-tab state tracking (ON/OFF indicator via badge)
- 💾 Settings are synced and stored using `chrome.storage.sync`

## Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/ibrahimakcayy/blur-mode-for-whatsapp-web.git
   ```
2. Go to `chrome://extensions` in Chrome.
3. Enable **Developer mode** in the top right.
4. Click **Load unpacked**.
5. Select the `blur-mode` folder you cloned.
6. Click the extension icon to open the popup and configure your settings.

## Usage

- Click the extension icon and use the **Status** toggle in the popup to turn blurring on or off.
- Use the **Blur intensity** field to adjust the amount of blur (in px).
- Select which elements to blur using the checkboxes, then click **Save**.
- Use `Ctrl+B` (macOS: `Cmd+B`) to quickly toggle blurring on the active tab.

## Project Structure

```
blur-mode/
├── manifest.json      # Extension configuration (Manifest V3)
├── background.js      # Service worker: CSS injection, tab/badge state, commands
├── options.html        # Popup UI
├── script.js           # Popup logic (read/write settings, toggle)
├── style.css           # Popup styles
├── blur-mode.css        # Reference/example static CSS (blur rules)
└── bos.png             # Extension icon
```

## How It Works

1. `background.js` reads settings from `chrome.storage.sync` when a tab navigates to a WhatsApp Web URL.
2. It builds a dynamic CSS string based on the selected selectors (`filter: blur(Npx) !important;`).
3. It injects this CSS into the tab using `chrome.scripting.insertCSS`, and removes it with `removeCSS` when turned off.
4. The injected CSS is tracked per tab in `chrome.storage.session`, so the extension knows which CSS is active on which tab.

## Contributing

Pull requests and issues are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## License

MIT
