function getSelectedText() {
    var selectedText = window.getSelection().toString();

    try {
        chrome.runtime.sendMessage({ selectedText });
    } catch (error) {
        // Ignored.
    }
}

document.addEventListener('selectionchange', getSelectedText);
