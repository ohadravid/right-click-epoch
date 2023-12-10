function getSelectedText() {
    var selectedText = window.getSelection().toString();
    chrome.runtime.sendMessage({ selectedText });
}

document.addEventListener('selectionchange', getSelectedText);