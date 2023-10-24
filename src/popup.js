const WINDOW_DELAY_MS = 1000;
const BADGE_DELAY_MS = 1000;
const TIMEOUT_DELAY_MS = 500;

import { loadOptions, output } from './common.js';

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

async function saveToClipboardNavigator(html, text) {
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

async function saveToClipboardExecCommand(html, text) {
  const buffer = document.getElementById('clipboardBuffer');
  buffer.innerHTML = html;
  const range = document.createRange();
  range.selectNodeContents(buffer);
  const select = window.getSelection();
  select.removeAllRanges();
  select.addRange(range);
  const result = document.execCommand('cut');
  buffer.blur();
  return Promise.resolve(result);
}

async function run() {
  const options = await loadOptions();
  const tab = await getCurrentTab().catch((error) => output('#output', `Problem getting current tab: ${error}`));
  const html = getHTMLForClipboard(tab);
  const text = getTextForClipboard(tab);
  const url = getUrlForClipboard(tab);
  const saveLink = async () => {
    return await saveToClipboardExecCommand(html, text)
      .then(() => {
        output('#output', 'Copied!', true);
        if (options.autoClose) {
          window.setTimeout(window.close, WINDOW_DELAY_MS);
        } else {
          console.log('DEBUG: Not closing popup since the `autoClose` setting is off.')
        }
      })
      .catch((error) => {
        output('#output', `Problem saving to clipboard: ${error}`);
      });
  }
  addLink(text, url, (evt) => {
    evt.preventDefault();
    saveLink();
  });
  output('#output', 'Copying...');
  const timeout = window.setTimeout(() => {
    output('#output', 'Problem copying automatically... click a link below to try again.', true);
  }, TIMEOUT_DELAY_MS);
  await saveLink();
  window.clearTimeout(timeout);
  await setBadge('✓').catch((error) => output('#output', `Problem setting the badge: ${error}`));;
  chrome.alarms.create('clearBadge', { when: Date.now() + BADGE_DELAY_MS });
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
    output('#output', `Error: ${error}`);
  });