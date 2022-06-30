chrome.action.setBadgeBackgroundColor(
  { color: 'green' },
);

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'clearBadge') {
    await setBadge('');
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const html = getHTMLForClipboard(tab);
  await saveHTMLToClipboard(tab, html);
  await setBadge('👍');
  chrome.alarms.create('clearBadge', { when: Date.now() + 3000 });
});

function getHTMLForClipboard(tab) {
  return `<a href="${tab.url}">${tab.title}</a>`;
}

async function saveHTMLToClipboard(tab, html) {
  return chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (html) => {
      const type = 'text/html';
      const blob = new Blob([html], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      return navigator.clipboard.write(data);
    },
    args: [html],
  });
}

async function setBadge(text) {
  return chrome.action.setBadgeText(
    { text },
  );
}