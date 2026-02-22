// ポップアップ読み込み時に状態を更新
document.addEventListener('DOMContentLoaded', () => {
    updateTimerStatus();
    loadStats();

    // 停止ボタンのイベントリスナー
    document.getElementById('stop-timer-btn').addEventListener('click', stopTimer);

    // 1秒ごとに状態を更新
    setInterval(updateTimerStatus, 1000);
});

// タイマーの状態を更新
function updateTimerStatus() {
    chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
        if (chrome.runtime.lastError) {
            console.error('エラー:', chrome.runtime.lastError);
            return;
        }

        const statusElement = document.getElementById('timer-status');
        const stopBtn = document.getElementById('stop-timer-btn');

        if (response && response.isActive && response.remainingTime > 0) {
            const minutes = Math.floor(response.remainingTime / 1000 / 60);
            const seconds = Math.floor((response.remainingTime / 1000) % 60);

            statusElement.innerHTML = `<div class="status-value pulse">${formatTime(minutes, seconds)}</div>`;
            stopBtn.style.display = 'block';
        } else {
            statusElement.innerHTML = '<div class="status-inactive">タイマーは停止中です</div>';
            stopBtn.style.display = 'none';
        }
    });
}

// 統計情報を読み込む
function loadStats() {
    chrome.storage.local.get('breakStats', (data) => {
        const stats = data.breakStats || { count: 0, totalMinutes: 0 };

        document.getElementById('today-breaks').textContent = stats.count;
        document.getElementById('total-time').textContent = stats.totalMinutes;
    });
}

// タイマーを停止
function stopTimer() {
    chrome.runtime.sendMessage({ type: 'STOP_TIMER' }, (response) => {
        if (response && response.success) {
            updateTimerStatus();
        }
    });
}

// 時間をフォーマット
function formatTime(minutes, seconds) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
