# Permission Justifications for Break Loop Timer

## Quick Reference (For Chrome Web Store Form)

Copy and paste these into the permission justification fields:

**activeTab:**
```
Required to display the timer banner on the current tab when user clicks the extension icon. This is the core UI of the extension.
```

**scripting:**
```
Required to dynamically inject the timer banner UI (JavaScript and CSS) into the active tab. Works with activeTab for on-demand injection only.
```

**notifications:**
```
Required to send desktop notifications warning users when their break is ending and when it has ended, preventing time loss.
```

**storage:**
```
Required to save user settings (break duration, preferences), usage statistics, and favorite sites list. All data stored locally.
```

**tabs:**
```
Required to automatically close the tab when break time ends (core feature) and to create tabs for favorite site shortcuts.
```

**alarms:**
```
Required for accurate background timer management. Ensures timer continues and notifications fire correctly even when service worker is inactive.
```

---

## Detailed Explanation

### 1. **activeTab**
**Purpose:** Display the timer banner on the currently active tab when user clicks the extension icon.

**Usage:** When a user clicks the extension icon, we need temporary access to the active tab to inject the timer banner interface. This is the core functionality of the extension - showing a visual timer on the website where the user is taking a break.

**Code Reference:** `background.js` - `chrome.action.onClicked` listener injects content script into the active tab.

---

### 2. **scripting**
**Purpose:** Dynamically inject the timer banner UI (JavaScript and CSS) into web pages.

**Usage:** After user clicks the extension icon, we inject `content.js` and `content.css` to display the break timer banner. This permission works together with `activeTab` for on-demand script injection only when explicitly requested by the user.

**Code Reference:** `background.js` - `chrome.scripting.executeScript()` and `chrome.scripting.insertCSS()` calls.

---

### 3. **notifications**
**Purpose:** Send desktop notifications to alert users when their break is ending or has ended.

**Usage:** The extension sends two types of notifications:
- Warning notification 1 minute before break ends
- Final notification when break time is up

This is essential for the core functionality - preventing users from losing track of time during breaks.

**Code Reference:** `background.js` - `chrome.notifications.create()` in timer countdown logic.

---

### 4. **storage**
**Purpose:** Save user preferences, break statistics, and favorite sites list.

**Usage:** 
- **chrome.storage.sync**: User settings (break duration, notification preferences, favorite sites list)
- **chrome.storage.local**: Usage statistics (total breaks, total time) and active timer state

All data is stored locally on the user's device. No external servers or data transmission.

**Code Reference:** 
- `background.js`, `options.js`, `content.js` - Multiple `chrome.storage.sync.get()` and `chrome.storage.local.set()` calls.

---

### 5. **tabs**
**Purpose:** Manage tabs when break timer ends and track which tab the timer is running on.

**Usage:**
- Close the tab automatically when break time expires (core feature to prevent endless scrolling)
- Track the tab ID where timer is active
- Create new tabs when clicking favorite site shortcuts

**Code Reference:** 
- `background.js` - `chrome.tabs.remove()` to close tabs when timer ends
- `options.js` - `chrome.tabs.create()` for favorite site shortcuts

---

### 6. **alarms**
**Purpose:** Maintain accurate timer countdown in the background, even when service worker is inactive.

**Usage:** Chrome's service workers can be terminated at any time to save resources. The `alarms` API ensures the timer continues running accurately and notifications are sent at the correct time, regardless of service worker state.

**Code Reference:** `background.js` - `chrome.alarms.create()` and `chrome.alarms.onAlarm` listener for timer management.

---

## Summary

All six permissions are essential for the core single purpose of this extension: **managing break time with a visible timer, notifications, and automatic tab closing**. No permission is used for any purpose beyond this stated functionality.

## Privacy Statement

- **No data collection**: All data stays on the user's device
- **No external requests**: Extension does not communicate with any external servers
- **No tracking**: No analytics, no user behavior tracking
- **User control**: All features can be configured or disabled in settings
