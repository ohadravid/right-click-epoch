// Cira. 1992.
const MIN_TIMESTAMP_SEC_TO_CONSIDER_EPOCH = 700000000;

// Try to find something that looks like a date but is not a number,
// and return it as a Date object.
function dateToEpoch(date) {
    let asNumber = Number(date);

    // If it's a number, it's probably an epoch already.
    if (!isNaN(asNumber)) {
        return null;
    }

    let asDate = new Date(date);

    if (!isNaN(asDate)) {
        // Date will accept a lot of random stuff, so try to filter out some of them.
        if (asDate.getTime() > MIN_TIMESTAMP_SEC_TO_CONSIDER_EPOCH * 1000) {
            return asDate;
        }
        return null;
    } else {
        return null;
    }
}

// Try to find something that looks like an epoch timestamp (a number),
// and return it as a Date object.
function epochToDate(epoch) {
    let asNumber = Number(epoch);

    if (isNaN(asNumber) || !isFinite(asNumber)) {
        return null;
    }

    if (Math.abs(asNumber) < MIN_TIMESTAMP_SEC_TO_CONSIDER_EPOCH) {
        return null;
    }

    let asDate = new Date(asNumber);

    // Probably seconds, convert to milliseconds.
    if (asDate.getFullYear() < 2000) {
        return (new Date(asNumber * 1000));
    }

    return asDate;
}

const rtf = new Intl.RelativeTimeFormat('en', { style: 'short' });

function timeSince(date, now) {
    let seconds = Math.floor((now - date) / 1000);

    // We care about minute granularity for the first 3 hours.
    if (Math.abs(seconds / 3600) > 3) {
        return rtf.format(-Math.floor(seconds / 3600), 'hour');
    }

    if (Math.abs(seconds / 60) > 1) {
        return rtf.format(-Math.floor(seconds / 60), 'minute');
    }

    return rtf.format(-Math.floor(seconds), 'second');
}

// Try to find something that looks like a date or epoch timestamp,
// and convert it to the other format.
function formatMaybeEpochOrDate(text, now) {
    let asDate = epochToDate(text);
    let asEpoch = dateToEpoch(text);

    if (asDate) {
        let timeSinceText = timeSince(asDate, now);
        let textToCopy = asDate.toISOString();
        let formattedText = `${textToCopy} (${timeSinceText})`;

        return [formattedText, textToCopy];
    } else if (asEpoch) {
        let asEpochMs = asEpoch.getTime() / 1000;
        let timeSinceText = timeSince(asEpoch, now);

        let textToCopy = asEpochMs.toFixed(3);
        let formattedText = `${textToCopy} (${timeSinceText})`;
        return [formattedText, textToCopy];
    } else {
        return [null, null]
    }
}

function epochClickHandler(word) {
    let selectedText = word.selectionText;

    let [_, textToCopy] = formatMaybeEpochOrDate(selectedText, new Date());

    copyToClipboard(textToCopy);
};

function copyToClipboard(text) {
    // Use the chrome.scripting API to copy text to the clipboard
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: function (text) {
                const input = document.createElement('input');
                document.body.appendChild(input);
                input.value = text;
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
            },
            args: [text],
        });
    });
}

const EPOCH_EXT_CTX_MENU_ID = "epoch-ctx-menu-id";

// Allow testing with node.
if (typeof chrome === 'undefined') {
    exports.dateToEpoch = dateToEpoch;
    exports.epochToDate = epochToDate;
    exports.timeSince = timeSince;
    exports.formatMaybeEpochOrDate = formatMaybeEpochOrDate;
} else {
    chrome.contextMenus.removeAll(function () {
        chrome.contextMenus.create({
            id: EPOCH_EXT_CTX_MENU_ID,
            title: "Epoch!",
            contexts: ["selection"],
        });
    })

    chrome.contextMenus.onClicked.addListener(function (info, tab) {
        if (info.menuItemId === EPOCH_EXT_CTX_MENU_ID) {
            epochClickHandler(info);
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.selectedText) {
            let [formattedText, _] = formatMaybeEpochOrDate(message.selectedText, new Date());

            let visible = formattedText ? true : false;

            chrome.contextMenus.update(EPOCH_EXT_CTX_MENU_ID, {
                title: formattedText,
                visible,
            });
        }
    });
}