// Loads copyest options from synchronized storage.
// Code which needs to access settings should use this, as it will
// set consistent defaults.
export async function loadOptions() {
  return chrome.storage.sync.get(
    { autoClose: true },
  );
};

// Renders output to the user.
// Args:
//   selector CSS selector identifying element to render to.
//   text     Text to output.
//   clear    Set to true to clear the contents of elem before adding text.
// If the length of the text in elem after the append operation is 0, the
// element will have the `hidden` class applied.
export function output(selector, text, clear) {
  const elem = document.querySelector(selector);
  if (!elem) {
    chrome.runtime.sendMessage({ name: 'log', payload: `Couldn't load selector "${selector}"` });
    return;
  }
  if (clear === true) {
    elem.innerText = '';
  }
  elem.innerText += text;
  if (elem.innerText.length > 0) {
    elem.classList.remove('hidden');
  } else {
    elem.classList.add('hidden');
  }
  chrome.runtime.sendMessage({ name: 'log', payload: text });
}
