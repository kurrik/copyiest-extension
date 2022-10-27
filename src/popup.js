const WINDOW_DELAY_MS = 1000;
const BADGE_DELAY_MS = 1000;
const TIMEOUT_DELAY_MS = 500;

async function setBadge(text) {
  return chrome.action.setBadgeText(
    { text },
  );
}

function delay(t, v) {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t)
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function getHTMLForClipboard(tab) {
  return `<meta charset="utf-8"><span><a href="${tab.url}">${tab.title}</a></span>`;
}

function getTextForClipboard(tab) {
  return tab.title;
}

function getUrlForClipboard(tab) {
  return tab.url;
}

async function saveToClipboard(html, text) {
  return await delay(20).then(async () => {
    const types = [
      { type: 'text/html', value: html },
      { type: 'text/plain', value: text },
    ];
    const clipboardItemData = {};
    for ({ type, value } of types) {
      const blob = new Blob([value], { type });
      clipboardItemData[type] = blob;
    }
    const clipboardItem = [new ClipboardItem(clipboardItemData)];
    return navigator.clipboard.write(clipboardItem);
  });
}

async function run() {
  const tab = await getCurrentTab().catch((error) => output(`Problem getting current tab: ${error}`));
  const html = getHTMLForClipboard(tab);
  const text = getTextForClipboard(tab);
  const url = getUrlForClipboard(tab);
  const saveLink = async () => {
    return await saveToClipboard(html, text)
      .then(() => {
        output('Copied!', true)
        window.setTimeout(window.close, WINDOW_DELAY_MS);
      })
      .catch((error) => {
        output(`Problem saving to clipboard: ${error}`)
      });
  }
  addLink(text, url, (evt) => {
    evt.preventDefault();
    saveLink();
  });
  output('Copying...');
  const timeout = window.setTimeout(() => {
    output('Problem copying automatically... click a link below to try again.', true);
  }, TIMEOUT_DELAY_MS);
  await saveLink();
  window.clearTimeout(timeout);
  await setBadge('✓').catch((error) => output(`Problem setting the badge: ${error}`));;
  chrome.alarms.create('clearBadge', { when: Date.now() + BADGE_DELAY_MS });
}

function output(text, clear) {
  const elem = document.getElementById('output');
  if (clear === true) {
    elem.innerText = '';
  }
  elem.innerText += text;
}

function addLink(text, url, onClick) {
  const elem = document.getElementById('links');
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.innerText = text;
  if (onClick) {
    anchor.addEventListener('click', onClick);
  }
  elem.appendChild(anchor);
}

run()
  .catch((error) => {
    output(`Error: ${error}`);
  });