// バナーが既に表示されているかチェック
let bannerShown = false;
let timerInterval = null;

// ページ読み込み時にバナーを表示
function init() {
    // 既にタイマーが動いているかチェック
    if (!chrome.runtime?.id) {
        console.log('Extension context invalidated');
        return;
    }

    // 現在のサイトが対象サイトリストに含まれているかチェック
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || { targetSites: [] };
        const currentHostname = window.location.hostname;

        // targetSitesのいずれかが現在のホスト名に含まれているかチェック
        const isTargetSite = settings.targetSites.some(site =>
            currentHostname === site || currentHostname.endsWith('.' + site)
        );

        if (!isTargetSite) {
            return;
        }

        initBanner();
    });
}

// バナーの初期化処理
function initBanner() {

    chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Error getting timer state:', chrome.runtime.lastError.message);
            return;
        }

        if (response && response.isActive) {
            // 既にタイマーが動いている場合は、タイマー表示バナーを表示
            showTimerBanner(response.remainingTime);
        } else if (!bannerShown) {
            // タイマーが動いていない場合は、開始確認バナーを表示
            showPromptBanner();
        }
    });
}

// 休憩開始確認バナーを表示
function showPromptBanner() {
    if (bannerShown) return;

    // 設定を読み込んでバナーを表示
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || { breakDuration: 10 };
        const duration = settings.breakDuration;

        const banner = document.createElement('div');
        banner.id = 'break-loop-timer-banner';
        banner.className = 'break-loop-timer-prompt';

        banner.innerHTML = `
    <div class="banner-content">
      <span class="banner-icon">⏰</span>
      <span class="banner-text">Take a ${duration}-minute break?</span>
      <button class="banner-btn banner-btn-ok" id="break-start-btn">Start</button>
      <button class="banner-btn banner-btn-close" id="break-close-btn">✕</button>
    </div>
  `;

        document.body.appendChild(banner);
        bannerShown = true;

        // イベントリスナーを追加
        document.getElementById('break-start-btn').addEventListener('click', startBreak);
        document.getElementById('break-close-btn').addEventListener('click', closeBanner);

        // 3秒後に自動的にフェードイン
        setTimeout(() => {
            banner.classList.add('show');
        }, 500);
    });
}

// タイマー表示バナーを表示
function showTimerBanner(remainingTime) {
    // 既存のバナーを削除
    const existingBanner = document.getElementById('break-loop-timer-banner');
    if (existingBanner) {
        existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.id = 'break-loop-timer-banner';
    banner.className = 'break-loop-timer-active';

    const minutes = Math.floor(remainingTime / 1000 / 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    banner.innerHTML = `
    <div class="banner-content">
      <span class="banner-icon">⏱️</span>
      <span class="banner-text">Break time: <span id="timer-display">${formatTime(minutes, seconds)}</span></span>
      <button class="banner-btn banner-btn-stop" id="break-stop-btn">Stop</button>
    </div>
  `;

    document.body.appendChild(banner);
    bannerShown = true;

    setTimeout(() => {
        banner.classList.add('show');
    }, 100);

    // 中止ボタンのイベントリスナー
    document.getElementById('break-stop-btn').addEventListener('click', stopBreak);

    // タイマーの更新を開始
    updateTimer(remainingTime);
}

// 時間をフォーマット
function formatTime(minutes, seconds) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// タイマーを更新
function updateTimer(initialRemaining) {
    let remaining = initialRemaining;

    timerInterval = setInterval(() => {
        remaining -= 1000;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            return;
        }

        const minutes = Math.floor(remaining / 1000 / 60);
        const seconds = Math.floor((remaining / 1000) % 60);

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) {
            timerDisplay.textContent = formatTime(minutes, seconds);

            // 残り1分を切ったら色を変更
            if (remaining < 60 * 1000) {
                timerDisplay.style.color = '#ff4444';
                timerDisplay.style.fontWeight = 'bold';
            }
        }
    }, 1000);
}

// 休憩を開始
function startBreak() {
    if (!chrome.runtime?.id) {
        console.log('Extension context invalidated');
        return;
    }

    chrome.runtime.sendMessage({ type: 'START_TIMER' }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Error starting timer:', chrome.runtime.lastError.message);
            return;
        }

        if (response && response.success) {
            // バナーをタイマー表示に切り替え
            chrome.storage.sync.get('settings', (data) => {
                const settings = data.settings || { breakDuration: 10 };
                const remainingTime = settings.breakDuration * 60 * 1000;
                showTimerBanner(remainingTime);
            });
        }
    });
}

// 休憩を中止
function stopBreak() {
    if (!chrome.runtime?.id) {
        console.log('Extension context invalidated');
        closeBanner();
        return;
    }

    chrome.runtime.sendMessage({ type: 'STOP_TIMER' }, (response) => {
        if (chrome.runtime.lastError) {
            console.log('Error stopping timer:', chrome.runtime.lastError.message);
        }

        if (response && response.success) {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
            closeBanner();
        }
    });
}

// バナーを閉じる
function closeBanner() {
    const banner = document.getElementById('break-loop-timer-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
            bannerShown = false;
        }, 300);
    }

    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

// ページ読み込み完了後に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// タブが再度フォーカスされた時にタイマー状態を確認
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        if (!chrome.runtime?.id) {
            console.log('Extension context invalidated');
            return;
        }

        chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('Error getting timer state:', chrome.runtime.lastError.message);
                return;
            }

            if (response && response.isActive && !document.getElementById('break-loop-timer-banner')) {
                showTimerBanner(response.remainingTime);
            }
        });
    }
});
