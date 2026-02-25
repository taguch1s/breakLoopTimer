# Chrome Web Store ポリシー準拠 - 改善推奨事項

## 現在の状況

### ✅ 準拠している点
- Manifest V3使用
- コードの透明性（難読化なし）
- 外部通信なし
- 個人情報収集なし
- トラッキングなし

### ⚠️ 要改善事項

## 1. 広範なホスト権限の問題 【最優先】

### 現在の実装
```json
"host_permissions": ["*://*/*"]
"content_scripts": [{"matches": ["*://*/*"]}]
```

### 問題点
- すべてのWebサイトへのアクセス権限を要求
- Chrome Web Storeレビューで追加審査の対象になる
- ユーザーに不安を与える可能性が高い

### 推奨される改善策

#### オプション A: `activeTab` 権限に変更（最も推奨）

**変更内容:**
```json
{
  "permissions": [
    "activeTab",  // 追加
    "notifications",
    "storage",
    "tabs",
    "alarms"
  ],
  "host_permissions": []  // 削除
}
```

**content_scripts を削除し、動的インジェクションに変更:**
```javascript
// background.js に追加
chrome.action.onClicked.addListener((tab) => {
  // ユーザーが拡張機能アイコンをクリックした時のみ実行
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content.css']
    });
  }
});
```

**メリット:**
- ユーザーが明示的にアクションを起こした時のみ動作
- 不要な権限を要求しない
- レビューを通過しやすい

**デメリット:**
- 自動でバナーが表示されない（ユーザーがクリックする必要がある）

---

#### オプション B: デフォルトサイトリストを使用（妥協案）

**変更内容:**
```json
{
  "host_permissions": [
    "*://twitter.com/*",
    "*://x.com/*",
    "*://youtube.com/*",
    "*://facebook.com/*",
    "*://instagram.com/*",
    "*://reddit.com/*",
    "*://tiktok.com/*"
  ],
  "content_scripts": [{
    "matches": [
      "*://twitter.com/*",
      "*://x.com/*",
      "*://youtube.com/*",
      "*://facebook.com/*",
      "*://instagram.com/*",
      "*://reddit.com/*",
      "*://tiktok.com/*"
    ],
    "js": ["content.js"],
    "css": ["content.css"]
  }],
  "optional_host_permissions": [
    "*://*/*"
  ]
}
```

**追加実装:**
```javascript
// options.js でサイト追加時に権限をリクエスト
function addSite() {
  const newSite = input.value.trim().toLowerCase();

  // 権限をリクエスト
  chrome.permissions.request({
    origins: [`*://${newSite}/*`]
  }, (granted) => {
    if (granted) {
      // サイトを追加
      // ...
    } else {
      alert('Permission denied. Please allow access to add this site.');
    }
  });
}
```

**メリット:**
- よく使われるSNSサイトはデフォルトで動作
- ユーザーが追加サイトを選択できる
- 不要なサイトへのアクセスなし

**デメリット:**
- manifestにサイトリストを含める必要がある
- ユーザーがカスタムサイトを追加する際に追加の許可が必要

---

#### オプション C: Optional Permissions（推奨度：中）

**変更内容:**
```json
{
  "permissions": [
    "notifications",
    "storage",
    "tabs",
    "alarms"
  ],
  "optional_host_permissions": [
    "*://*/*"
  ]
}
```

**初回起動時にユーザーに説明:**
```javascript
// 初回起動時
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({
    url: 'onboarding.html'  // 権限の必要性を説明するページ
  });
});
```

**メリット:**
- ユーザーが理解した上で許可できる
- 必要性を明確に説明できる

**デメリット:**
- 追加の実装が必要
- ユーザーが拒否した場合の対応が必要

---

## 2. プライバシーポリシーの欠如

### 問題点
- Chrome Web Storeで公開する際、プライバシーポリシーが必要
- 特に広範な権限を要求する場合は必須

### 推奨される対応

`PRIVACY_POLICY.md` を作成し、以下の内容を含める：

```markdown
# Privacy Policy for Break Loop Timer

## Data Collection
This extension does NOT collect, transmit, or share any personal data.

## Data Storage
All data is stored locally on your device using Chrome's storage API:
- Settings (break duration, notification preferences, target websites)
- Statistics (number of breaks taken, total break time)

## Permissions
- **notifications**: To remind you when break time ends
- **storage**: To save your settings and statistics locally
- **tabs**: To close break-related tabs when timer ends
- **alarms**: To trigger break reminders
- **host_permissions**: To display break timer banner on websites you specify

## Third-Party Services
This extension does NOT use any third-party services or analytics.

## Changes
Any changes to this policy will be updated here.

Last updated: 2026-02-24
```

---

## 3. manifest.json の説明文を詳細化

### 現在
```json
"description": "Manages your break time on SNS and helps you get back to work"
```

### 推奨
```json
"description": "Timer to manage break time on websites you choose. Shows banner on target sites, sends notifications when break ends, and automatically closes tabs. No data collection."
```

---

## 4. README.md に権限の説明を追加

ユーザーが安心できるように、なぜ各権限が必要かを明記：

```markdown
## Permissions Explained

This extension requires the following permissions:
- **notifications**: To notify you when break time is ending or has ended
- **storage**: To save your settings (break duration, target websites) locally
- **tabs**: To close the break tab when timer ends
- **alarms**: To schedule break end notifications
- **host_permissions**: To display the break timer banner on websites you add to your list

**Privacy:** This extension does NOT collect, transmit, or share any data. All information stays on your device.
```

---

## 優先順位

### 高優先度（公開前に必須）
1. ✅ 広範なホスト権限の見直し（オプションA, B, Cから選択）
2. ✅ プライバシーポリシーの作成

### 中優先度（推奨）
3. manifest.json の説明文改善
4. README への権限説明追加

### 低優先度
5. アイコンの作成（現在プレースホルダー）

---

## 実装の推奨順序

1. **オプションBを選択**（デフォルトサイトリスト + optional_host_permissions）
   - 既存の機能を維持しつつ、ポリシーリスクを軽減
   - ユーザーエクスペリエンスへの影響が最小

2. **PRIVACY_POLICY.md を作成**
   - Chrome Web Store公開時に必須

3. **README と manifest の説明を改善**
   - ユーザーの信頼を得る

4. **テストと動作確認**

---

## 参考リンク

- [Chrome Web Store Developer Program Policies](https://developer.chrome.com/docs/webstore/program-policies)
- [Declare Permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions)
- [Optional Permissions](https://developer.chrome.com/docs/extensions/reference/permissions/)
