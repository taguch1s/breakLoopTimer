# Break Loop Timer ???

[???????? English](README.md) | [???????? ?????????](README.ja.md)

A Chrome extension that helps you manage break time and return to your tasks on schedule.

## ???? Features

- **Visual Timer Banner**: Click the extension icon on any website to start a break timer with a countdown display
- **Desktop Notifications**: Get notified before your break ends so you can wrap up
- **Auto Tab Closing**: Tabs automatically close when break time expires to prevent endless scrolling
- **Customizable Duration**: Set your preferred break length (1-60 minutes, default: 10 minutes)
- **Favorite Sites**: Quick access shortcuts to your most-used break websites
- **Usage Statistics**: Track your break count and total break time

## ???? Why Break Loop Timer?

Ever lost track of time scrolling through social media during your break?

You planned a quick 10-minute break, but suddenly an hour has passed. Break Loop Timer helps you stay on track and return to your tasks on time.

**Perfect for:**
- Students managing study breaks
- Remote workers maintaining productivity
- Anyone who wants to enjoy breaks guilt-free without losing track of time

## ???? Installation

### Option 1: Chrome Web Store (Recommended)

*Coming soon - Under review*

### Option 2: Manual Installation (Developer Mode)

1. Clone or download this repository

```bash
git clone <repository-url>
cd breakLoopTimer
```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" in the top-right corner

4. Click "Load unpacked"

5. Select the `breakLoopTimer` folder

6. The extension is now ready to use!

## ???? How to Use

### Basic Usage

1. **Open any website**: Navigate to YouTube, Twitter, or any site where you want to take a break

2. **Click the extension icon**: Click the timer icon (???) in your browser toolbar

3. **Start your break**: A banner appears at the top of the page. Click "Start" to begin the timer

4. **During break**: The countdown timer shows your remaining time. You can click "Stop" to end early

5. **Get notified**: Desktop notification appears when your break is about to end

6. **Auto close**: The tab automatically closes when time's up

### Customizing Settings

Right-click the extension icon and select "Options" to customize:

- **Break Duration**: Set from 1 to 60 minutes (default: 10 minutes)
- **Warning Time**: Choose when to receive the end-of-break notification (default: 1 minute before)
- **Favorite Sites**: Add shortcuts to your frequently visited break sites
- **Notifications**: Enable or disable desktop notifications

### Managing Favorite Sites

Your favorite sites are automatically added when you start a break:
1. The extension remembers your most recent break sites (up to 10)
2. Access them from the Options page as quick shortcuts
3. You can also manually add or remove sites

## ???? Project Structure

```
breakLoopTimer/
????????? manifest.json          # Extension configuration
????????? background.js          # Background service worker (timer logic)
????????? content.js            # Content script (banner UI)
????????? content.css           # Banner styling
????????? options.html          # Settings page
????????? options.js            # Settings page logic
????????? popup.html            # Popup UI
????????? popup.js              # Popup logic
????????? icons/                # Extension icons
???   ????????? icon16.png
???   ????????? icon48.png
???   ????????? icon128.png
????????? docs/                 # Documentation
???   ????????? ChromeWebStore.md
???   ????????? PERMISSIONS.md
???   ????????? PRIVACY_POLICY.md
????????? README.md             # This file
```

## ?????? Technical Details

- **Manifest Version**: 3
- **Supported Sites**: Works on any website (user-triggered via icon click)
- **Permissions**:
  - `activeTab`: Display banner on current tab when icon is clicked
  - `scripting`: Dynamically inject scripts and styles
  - `notifications`: Send desktop notifications
  - `storage`: Save settings and statistics locally
  - `tabs`: Manage tab closing and favorite shortcuts
  - `alarms`: Maintain accurate timer in background

For detailed permission justifications, see [PERMISSIONS.md](docs/PERMISSIONS.md).

## ???? Privacy

This extension is privacy-first:
- ??? No personal data collection
- ??? No external server communication
- ??? No browsing history tracking
- ??? No analytics or tracking

All data (settings, statistics) is stored locally on your device. See [PRIVACY_POLICY.md](docs/PRIVACY_POLICY.md) for details.

## ???? Development

### Requirements

- Google Chrome or Chromium-based browser
- Text editor

### Debugging

1. Go to `chrome://extensions/` and enable Developer mode
2. Click "Details" on the extension ??? "Inspect views: service worker" to open DevTools
3. Check console logs for debugging information

### Applying Changes

After modifying files:
1. Go to `chrome://extensions/`
2. Click the reload icon (????) for this extension
3. Refresh the page to see changes

### Building Release

Create a zip file for Chrome Web Store submission:

```bash
./create-release-zip.sh
```

This creates a zip file with only the necessary extension files.

## ???? Future Improvements

- [ ] Pomodoro technique integration
- [ ] Break time presets (quick 5/10/15 minute breaks)
- [ ] Statistics graphs and charts
- [ ] Custom notification sounds
- [ ] Break reminder scheduling
- [ ] Dark mode for banner
- [ ] Multiple language support (UI localization)

## ???? License

MIT License

## ???? Contributing

Pull requests are welcome! For bug reports or feature suggestions, please open an issue.

## ???? Acknowledgments

Created to help people maintain productivity while enjoying guilt-free breaks.

---

**Note**: This extension is designed to support productivity, but remember that regular breaks are important for your health and focus. Use it responsibly!
