

epoch = function (word) {
    // TODO: add clipboard
    var selectedText = word.selectionText;
    console.log(selectedText);
};

chrome.contextMenus.removeAll(function () {
    chrome.contextMenus.create({
        id: "1",
        title: "Epoch!",
        contexts: ["selection"],
    });
})

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "1") {
        epoch(info);
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.selectedText) {
        // TODO: Format to epoch
        chrome.contextMenus.update("1", {
            title: `Epoch! ${message.selectedText}`,
        });
    }
});