// 統計情報を読み込んで表示
chrome.storage.local.get(['breakStats'], (data) => {
    const stats = data.breakStats || { count: 0, totalMinutes: 0 };

    document.getElementById('break-count').textContent = stats.count;
    document.getElementById('total-time').textContent = stats.totalMinutes;
});

// 休憩回数を記録
chrome.storage.local.get(['breakStats'], (data) => {
    const stats = data.breakStats || { count: 0, totalMinutes: 0 };

    chrome.storage.sync.get('settings', (settingsData) => {
        const settings = settingsData.settings || { breakDuration: 10 };

        stats.count += 1;
        stats.totalMinutes += settings.breakDuration;

        chrome.storage.local.set({ breakStats: stats });

        // 表示を更新
        document.getElementById('break-count').textContent = stats.count;
        document.getElementById('total-time').textContent = stats.totalMinutes;
    });
});
