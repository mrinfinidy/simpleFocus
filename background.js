chrome.tabs.onActivated.addListener(
    function(tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "active_tab_change"});
        });
    }
);

chrome.tabs.onUpdated.addListener(
    function(tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "tab_updated"});
        });
    }
);

var cmItemAdd = {
    "id": "addSite",
    "title": "Add this site",
    contexts: ["page"]
};

chrome.contextMenus.create(cmItemAdd);

chrome.contextMenus.onClicked.addListener(function(clickedItem) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "add_site"});
    });
});
