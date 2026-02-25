// デフォルト設定
const DEFAULT_SETTINGS = {
    breakDuration: 10,
    warningBeforeEnd: 1,
    enableNotifications: true,
    favoriteSites: [] // よく使う休憩サイト（最大10個）
};

// ページ読み込み時に設定を読み込む
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStats();

    // サイト追加ボタンのイベントリスナー
    document.getElementById('add-site-btn').addEventListener('click', addSite);

    // Enterキーでサイト追加
    document.getElementById('new-site').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSite();
        }
    });
});

// 設定を読み込む
function loadSettings() {
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || DEFAULT_SETTINGS;

        document.getElementById('break-duration').value = settings.breakDuration;
        document.getElementById('warning-time').value = settings.warningBeforeEnd;
        document.getElementById('enable-notifications').checked = settings.enableNotifications;

        // サイトリストを表示
        renderSitesList(settings.favoriteSites || DEFAULT_SETTINGS.favoriteSites);
    });
}

// サイトリストを表示
function renderSitesList(sites) {
    const listContainer = document.getElementById('sites-list');
    listContainer.innerHTML = '';

    if (sites.length === 0) {
        listContainer.innerHTML = '<div style="color: #718096; font-size: 14px;">No favorite sites yet. Start a break to add sites automatically!</div>';
        return;
    }

    sites.forEach((site, index) => {
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        siteItem.innerHTML = `
            <a href="#" class="site-link" data-site="${site}" title="Open ${site} and start break">🔗 ${site}</a>
            <button type="button" class="remove-site-btn" data-index="${index}">Remove</button>
        `;
        listContainer.appendChild(siteItem);

        // リンククリックのイベントリスナー
        siteItem.querySelector('.site-link').addEventListener('click', (e) => {
            e.preventDefault();
            openSiteWithAutoBreak(site);
        });

        // 削除ボタンのイベントリスナー
        siteItem.querySelector('.remove-site-btn').addEventListener('click', () => {
            removeSite(index);
        });
    });
}

// サイトを開いて自動的にバナーを表示
function openSiteWithAutoBreak(site) {
    // タブを開く前にフラグを設定
    chrome.storage.local.set({ autoBreakNextTab: true }, () => {
        // 新しいタブでサイトを開く
        chrome.tabs.create({ url: `https://${site}` });
    });
}

// サイトを追加
function addSite() {
    const input = document.getElementById('new-site');
    const newSite = input.value.trim().toLowerCase();

    if (!newSite) {
        alert('Please enter a website domain');
        return;
    }

    // ドメイン名の簡単なバリデーション
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(newSite)) {
        alert('Please enter a valid domain (e.g., example.com)');
        return;
    }

    chrome.storage.sync.get('settings', (data) => {
        const currentSettings = data.settings || DEFAULT_SETTINGS;
        const currentSites = currentSettings.favoriteSites || [];

        // 既に存在するかチェック
        if (currentSites.includes(newSite)) {
            alert('This site is already in the list');
            return;
        }

        // 最大10個の制限
        if (currentSites.length >= 10) {
            alert('Maximum 10 favorite sites allowed. Please remove one first.');
            return;
        }

        // 新しい配列を作成（先頭に追加）
        const newSites = [newSite, ...currentSites];

        // 新しい設定オブジェクトを作成
        const newSettings = {
            ...currentSettings,
            favoriteSites: newSites
        };

        chrome.storage.sync.set({ settings: newSettings }, () => {
            renderSitesList(newSites);
            input.value = '';
            showSuccessMessage();
        });
    });
}

// サイトを削除
function removeSite(index) {
    chrome.storage.sync.get('settings', (data) => {
        const currentSettings = data.settings || DEFAULT_SETTINGS;
        const currentSites = currentSettings.favoriteSites || [];

        // 新しい配列を作成（元の配列を変更しない）
        const newSites = currentSites.filter((_, i) => i !== index);

        // 新しい設定オブジェクトを作成
        const newSettings = {
            ...currentSettings,
            favoriteSites: newSites
        };

        chrome.storage.sync.set({ settings: newSettings }, () => {
            renderSitesList(newSites);
            showSuccessMessage();
        });
    });
}

// 統計情報を読み込む
function loadStats() {
    chrome.storage.local.get('breakStats', (data) => {
        const stats = data.breakStats || { count: 0, totalMinutes: 0 };

        document.getElementById('total-breaks').textContent = stats.count;
        document.getElementById('total-minutes').textContent = stats.totalMinutes;
    });
}

// フォーム送信時の処理
document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();

    chrome.storage.sync.get('settings', (data) => {
        const currentSettings = data.settings || DEFAULT_SETTINGS;

        const settings = {
            breakDuration: parseInt(document.getElementById('break-duration').value),
            warningBeforeEnd: parseInt(document.getElementById('warning-time').value),
            enableNotifications: document.getElementById('enable-notifications').checked,
            favoriteSites: currentSettings.favoriteSites || DEFAULT_SETTINGS.favoriteSites
        };

        // Validation
        if (settings.warningBeforeEnd >= settings.breakDuration) {
            alert('Warning time must be shorter than break duration');
            return;
        }

        // 設定を保存
        chrome.storage.sync.set({ settings }, () => {
            showSuccessMessage();
        });
    });
});

// デフォルトに戻すボタンの処理
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all settings to default?')) {
        chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
            loadSettings();
            renderSitesList(DEFAULT_SETTINGS.favoriteSites);
            showSuccessMessage();
        });
    }
});

// 成功メッセージを表示
function showSuccessMessage() {
    const message = document.getElementById('success-message');
    message.classList.add('show');

    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}
