// タイマーの状態を管理
let timerState = {
    isActive: false,
    startTime: null,
    duration: 10 * 60 * 1000, // 10分（ミリ秒）
    warningTime: 9 * 60 * 1000, // 9分（ミリ秒）
    tabId: null
};

// デフォルトの設定
const DEFAULT_SETTINGS = {
    breakDuration: 10, // 分
    warningBeforeEnd: 1, // 終了前の警告時間（分）
    redirectUrl: 'https://www.notion.so', // デフォルトのリダイレクト先
    enableNotifications: true
};

// 拡張機能のインストール時
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get('settings', (data) => {
        if (!data.settings) {
            chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
        }
    });
});

// content scriptからのメッセージを受信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_TIMER') {
        startTimer(sender.tab.id);
        sendResponse({ success: true });
    } else if (message.type === 'GET_TIMER_STATE') {
        sendResponse({
            isActive: timerState.isActive,
            remainingTime: getRemainingTime()
        });
    } else if (message.type === 'STOP_TIMER') {
        stopTimer();
        sendResponse({ success: true });
    }
    return true;
});

// タイマーを開始
function startTimer(tabId) {
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || DEFAULT_SETTINGS;

        timerState.isActive = true;
        timerState.startTime = Date.now();
        timerState.duration = settings.breakDuration * 60 * 1000;
        timerState.warningTime = (settings.breakDuration - settings.warningBeforeEnd) * 60 * 1000;
        timerState.tabId = tabId;

        // タイマーの状態を保存
        chrome.storage.local.set({ timerState });

        // アラーム設定（警告用）
        chrome.alarms.create('warningAlarm', {
            delayInMinutes: settings.breakDuration - settings.warningBeforeEnd
        });

        // アラーム設定（終了用）
        chrome.alarms.create('endAlarm', {
            delayInMinutes: settings.breakDuration
        });

        console.log('タイマー開始:', settings.breakDuration, '分');
    });
}

// タイマーを停止
function stopTimer() {
    timerState.isActive = false;
    timerState.startTime = null;
    timerState.tabId = null;

    chrome.alarms.clear('warningAlarm');
    chrome.alarms.clear('endAlarm');

    chrome.storage.local.set({ timerState });
}

// 残り時間を取得
function getRemainingTime() {
    if (!timerState.isActive || !timerState.startTime) {
        return 0;
    }

    const elapsed = Date.now() - timerState.startTime;
    const remaining = timerState.duration - elapsed;

    return Math.max(0, remaining);
}

// アラームの処理
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'warningAlarm') {
        showWarningNotification();
    } else if (alarm.name === 'endAlarm') {
        endBreak();
    }
});

// 警告通知を表示
function showWarningNotification() {
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || DEFAULT_SETTINGS;

        if (settings.enableNotifications) {
            chrome.notifications.create('warning', {
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: '休憩時間終了まであと少し！',
                message: `残り${settings.warningBeforeEnd}分です。そろそろ作業に戻る準備をしましょう。`,
                priority: 2
            });
        }
    });
}

// 休憩終了処理
function endBreak() {
    chrome.storage.sync.get('settings', (data) => {
        const settings = data.settings || DEFAULT_SETTINGS;

        // 通知を表示
        if (settings.enableNotifications) {
            chrome.notifications.create('end', {
                type: 'basic',
                iconUrl: 'icons/icon128.png',
                title: '休憩時間終了！',
                message: '作業に戻りましょう。お疲れ様でした！',
                priority: 2
            });
        }

        // タブをリダイレクト
        if (timerState.tabId) {
            chrome.tabs.get(timerState.tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    // タブが既に閉じられている場合
                    console.log('タブが見つかりません');
                } else {
                    chrome.tabs.update(timerState.tabId, {
                        url: settings.redirectUrl || DEFAULT_SETTINGS.redirectUrl
                    });
                }
            });
        }

        // タイマーを停止
        stopTimer();
    });
}

// 拡張機能起動時に保存されたタイマー状態を復元
chrome.storage.local.get('timerState', (data) => {
    if (data.timerState && data.timerState.isActive) {
        const savedState = data.timerState;
        const elapsed = Date.now() - savedState.startTime;

        if (elapsed < savedState.duration) {
            // まだ時間が残っている場合、タイマーを継続
            timerState = savedState;

            const remainingMinutes = (savedState.duration - elapsed) / 1000 / 60;
            const warningMinutes = (savedState.warningTime - elapsed) / 1000 / 60;

            if (warningMinutes > 0) {
                chrome.alarms.create('warningAlarm', {
                    delayInMinutes: warningMinutes
                });
            }

            if (remainingMinutes > 0) {
                chrome.alarms.create('endAlarm', {
                    delayInMinutes: remainingMinutes
                });
            }
        } else {
            // 時間切れの場合、タイマーを停止
            stopTimer();
        }
    }
});
