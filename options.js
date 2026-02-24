// デフォルト設定
const DEFAULT_SETTINGS = {
    breakDuration: 10,
    warningBeforeEnd: 1,
    enableNotifications: true,
    targetSites: [] // ユーザーが手動で追加
};

console.log('===== options.js loaded =====');
console.log('DEFAULT_SETTINGS:', DEFAULT_SETTINGS);

// ページ読み込み時に設定を読み込む
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOMContentLoaded fired ===');
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

    console.log('Event listeners attached');
});

// 設定を読み込む
function loadSettings() {
    console.log('=== loadSettings called ===');

    chrome.storage.sync.get('settings', (data) => {
        console.log('Loaded settings from storage:', data);

        const settings = data.settings || DEFAULT_SETTINGS;
        console.log('Final settings:', settings);

        document.getElementById('break-duration').value = settings.breakDuration;
        document.getElementById('warning-time').value = settings.warningBeforeEnd;
        document.getElementById('enable-notifications').checked = settings.enableNotifications;

        // サイトリストを表示
        renderSitesList(settings.targetSites || DEFAULT_SETTINGS.targetSites);
    });
}

// サイトリストを表示
function renderSitesList(sites) {
    console.log('=== renderSitesList called ===');
    console.log('Sites to render:', sites);

    const listContainer = document.getElementById('sites-list');
    listContainer.innerHTML = '';

    if (sites.length === 0) {
        listContainer.innerHTML = '<div style="color: #718096; font-size: 14px;">No sites added yet</div>';
        return;
    }

    sites.forEach((site, index) => {
        console.log(`Rendering site[${index}]:`, site);

        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        siteItem.innerHTML = `
            <span class="site-name">${site}</span>
            <button type="button" class="remove-site-btn" data-index="${index}">Remove</button>
        `;
        listContainer.appendChild(siteItem);

        // 削除ボタンのイベントリスナー
        siteItem.querySelector('.remove-site-btn').addEventListener('click', () => {
            console.log(`Remove button clicked for index: ${index}, site: ${site}`);
            removeSite(index);
        });
    });
}

// サイトを追加
function addSite() {
    const input = document.getElementById('new-site');
    const newSite = input.value.trim().toLowerCase();

    console.log('=== addSite called ===');
    console.log('New site to add:', newSite);

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
        console.log('addSite - Storage data:', JSON.stringify(data, null, 2));

        const currentSettings = data.settings || DEFAULT_SETTINGS;
        const currentSites = currentSettings.targetSites || [];

        console.log('addSite - Current sites:', currentSites);

        // 既に存在するかチェック
        if (currentSites.includes(newSite)) {
            alert('This site is already in the list');
            return;
        }

        // 新しい配列を作成（元の配列を変更しない）
        const newSites = [...currentSites, newSite];

        console.log('addSite - New sites to save:', newSites);

        // 新しい設定オブジェクトを作成
        const newSettings = {
            ...currentSettings,
            targetSites: newSites
        };

        console.log('addSite - New settings to save:', JSON.stringify(newSettings, null, 2));

        chrome.storage.sync.set({ settings: newSettings }, () => {
            console.log('addSite - Storage set complete');
            renderSitesList(newSites);
            input.value = '';
            showSuccessMessage();
        });
    });
}

// サイトを削除
function removeSite(index) {
    console.log('=== removeSite called ===');
    console.log('Index to remove:', index);

    chrome.storage.sync.get('settings', (data) => {
        console.log('Storage data:', data);

        const currentSettings = data.settings || DEFAULT_SETTINGS;
        const currentSites = currentSettings.targetSites || [];

        console.log('Current sites:', currentSites);
        console.log('Sites length:', currentSites.length);

        // 新しい配列を作成（元の配列を変更しない）
        const newSites = currentSites.filter((_, i) => i !== index);

        console.log('New sites after filter:', newSites);
        console.log('New sites length:', newSites.length);

        // 新しい設定オブジェクトを作成
        const newSettings = {
            ...currentSettings,
            targetSites: newSites
        };

        console.log('New settings to save:', newSettings);

        chrome.storage.sync.set({ settings: newSettings }, () => {
            console.log('Storage set complete');

            // 保存後に確認
            chrome.storage.sync.get('settings', (verifyData) => {
                console.log('Verify saved data:', JSON.stringify(verifyData, null, 2));
                console.log('Verify targetSites:', verifyData.settings?.targetSites);
            });

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

    console.log('=== Form submitted ===');

    chrome.storage.sync.get('settings', (data) => {
        const currentSettings = data.settings || DEFAULT_SETTINGS;

        console.log('Form submit - Current settings:', JSON.stringify(currentSettings, null, 2));

        const settings = {
            breakDuration: parseInt(document.getElementById('break-duration').value),
            warningBeforeEnd: parseInt(document.getElementById('warning-time').value),
            enableNotifications: document.getElementById('enable-notifications').checked,
            targetSites: currentSettings.targetSites || DEFAULT_SETTINGS.targetSites
        };

        console.log('Form submit - New settings:', JSON.stringify(settings, null, 2));

        // Validation
        if (settings.warningBeforeEnd >= settings.breakDuration) {
            alert('Warning time must be shorter than break duration');
            return;
        }

        // 設定を保存
        chrome.storage.sync.set({ settings }, () => {
            console.log('Form submit - Storage set complete');
            showSuccessMessage();
        });
    });
});

// デフォルトに戻すボタンの処理
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all settings to default?')) {
        chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
            loadSettings();
            renderSitesList(DEFAULT_SETTINGS.targetSites);
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
