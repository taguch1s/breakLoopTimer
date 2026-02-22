// デフォルト設定
const DEFAULT_SETTINGS = {
    breakDuration: 10,
    warningBeforeEnd: 1,
    redirectUrl: 'https://www.notion.so',
    enableNotifications: true
};

// ページ読み込み時に設定を読み込む
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadStats();
});

// 設定を読み込む
function loadSettings() {
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || DEFAULT_SETTINGS;

        document.getElementById('break-duration').value = settings.breakDuration;
        document.getElementById('warning-time').value = settings.warningBeforeEnd;
        document.getElementById('redirect-url').value = settings.redirectUrl;
        document.getElementById('enable-notifications').checked = settings.enableNotifications;
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

    const settings = {
        breakDuration: parseInt(document.getElementById('break-duration').value),
        warningBeforeEnd: parseInt(document.getElementById('warning-time').value),
        redirectUrl: document.getElementById('redirect-url').value,
        enableNotifications: document.getElementById('enable-notifications').checked
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

// デフォルトに戻すボタンの処理
document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Reset all settings to default?')) {
        chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
            loadSettings();
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
