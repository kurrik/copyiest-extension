const STATUS_DELAY_MS = 500;

import { loadOptions, output } from './common.js';

async function saveOptions() {
  const autoClose = document.getElementById('setting-autoClose').checked;
  return chrome.storage.sync.set(
    { autoClose: autoClose },
    () => {
      output('#output', 'Options saved.', true);
      setTimeout(() => {
        output('#output', '', true);
      }, STATUS_DELAY_MS);
    }
  );
};

async function restoreOptions() {
  loadOptions().then((items) => {
    document.getElementById('setting-autoClose').checked = items.autoClose;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);