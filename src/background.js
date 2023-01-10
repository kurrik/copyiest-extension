chrome.action.setBadgeBackgroundColor(
  { color: '#F2C94C' },
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name === 'log') {
    console.log(message.payload);
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'clearBadge') {
    await setBadge('');
  }
});

async function setBadge(text) {
  return chrome.action.setBadgeText(
    { text },
  );
}