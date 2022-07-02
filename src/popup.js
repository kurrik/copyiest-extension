const WINDOW_DELAY_MS=1000;
const BADGE_DELAY_MS=1000;

async function setBadge(text) {
  return chrome.action.setBadgeText(
    { text },
  );
}

function delay(t, v) {
  return new Promise(function(resolve) {
      setTimeout(resolve.bind(null, v), t)
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function getHTMLForClipboard(tab) {
  return `<a href="${tab.url}">${tab.title}</a>`;
}

async function saveHTMLToClipboard(html) {
  return delay(10).then(() => {
    const type = 'text/html';
    const blob = new Blob([html], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    return navigator.clipboard.write(data);
  });
}

async function run() {
  const tab = await getCurrentTab().catch((error) => output(`Problem getting current tab: ${error}`));
  const html = getHTMLForClipboard(tab);
  await saveHTMLToClipboard(html).catch((error) => output(`Problem saving to clipboard: ${error}`));
  await setBadge('✓').catch((error) => output(`Problem setting the badge: ${error}`));;
  chrome.alarms.create('clearBadge', { when: Date.now() + BADGE_DELAY_MS });
}

function output(text) {
  const elem = document.getElementById('output');
  elem.innerText += text;
}

run()
  .then(() => {
    output("Copied!");
    window.setTimeout(window.close, WINDOW_DELAY_MS);
  })
  .catch((error) => {
    output(`Error: ${error}`);
  });