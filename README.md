# Copyiest

Clicking the extension icon copies the current tab's title and URL as a rich text formatted link onto the clipboard for pasting into other places.  That's it!

![Screenshot](/assets/screenshot.png "Copiest extension screenshot")

[Chrome web store link](https://chrome.google.com/webstore/detail/copiest/cmepeblnfcigdpefcnijpcjndkafjkpp)

## Release history

 * 1.0.0 — Initial release.
 * 1.0.1 — Updated icons.
 * 1.1.0 — Removed `scripting` permission, using an extension popup to write values to the clipboard instead.
 * 1.1.1 — Copies both `text/html` and `text/plain` versions to clipboard (makes pasting into Slack work).
 * 1.2.0 — OSX Ventura seems to have broken the ability to automatically copy a link.  Added UI to fall back to until automatic copying can be fixed.
