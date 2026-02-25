# Privacy Policy for Break Loop Timer

**Last updated: February 25, 2026**

## Overview

Break Loop Timer is a Chrome extension designed to help you manage your break time on websites. This privacy policy explains how we handle your data.

## Data Collection

**We do NOT collect any personal data.**

This extension:
- Does NOT collect browsing history
- Does NOT collect personal information
- Does NOT track user behavior
- Does NOT send any data to external servers
- Does NOT use analytics or tracking services

## Data Storage

All data is stored **locally on your device** using Chrome's storage API:

### Settings (stored in chrome.storage.sync)
- Break duration (in minutes)
- Warning time before break ends
- Notification preferences (enabled/disabled)
- List of target websites you choose to monitor

### Statistics (stored in chrome.storage.local)
- Number of breaks completed
- Total break time (in minutes)
- Timer state (whether a break is currently active)

**Important:** This data is stored locally and synchronized across your Chrome browsers if you're signed in. It is NOT sent to our servers because we don't have any servers.

## Permissions Explanation

This extension requires the following permissions:

- **activeTab**: To inject the break timer banner into the current tab when you click the extension icon
- **scripting**: To dynamically inject scripts and styles into web pages
- **notifications**: To send you notifications when your break time is ending or has ended
- **storage**: To save your settings and statistics locally on your device
- **tabs**: To close the break tab automatically when the timer ends
- **alarms**: To schedule break end notifications accurately

## Third-Party Services

This extension does NOT use any third-party services, including:
- No analytics (e.g., Google Analytics)
- No crash reporting services
- No advertising networks
- No external APIs

## Data Sharing

We do NOT share any data with third parties because we don't collect or access any data to begin with.

## User Control

You have complete control over your data:
- All settings can be modified in the extension's options page
- Statistics can be reset at any time
- You can uninstall the extension at any time, which will remove all stored data

## Changes to This Policy

If we make any changes to this privacy policy, we will update the "Last updated" date at the top of this document. Changes will be reflected in future updates of the extension.

## Contact

If you have any questions about this privacy policy, please create an issue on our GitHub repository.

## Open Source

This extension is open source. You can review the complete source code to verify that we do not collect any data.
