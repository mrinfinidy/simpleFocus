var activated;
var redURLs = [];

chrome.storage.sync.get("active", function(value) {
    if (value.active === "true") {
        activated = true;
    } else {
        activated = false;
    }
});

chrome.storage.sync.get("urls", function(value) {
    for (var i = 0; i < value.urls.length; i++) {
        redURLs.push(value.urls[i]);
    }
});

chrome.storage.onChanged.addListener(function() {
    chrome.storage.sync.get("urls", function(value) {
        for (var i = 0; i < Math.max(value.urls.length, redURLs.length); i++) {
            if (i < value.urls.length && !redURLs.includes(value.urls[i])) {
                redURLs.push(value.urls[i]);
            }
            if (i < redURLs.length && !value.urls.includes(redURLs[i])) {
                redURLs.splice(i, 1);
            }
        }
    });

    chrome.storage.sync.get("active", function(value) {
        var reload = true;

        if (value.active === "true") {
            activated = true;
        } else {
            if (!activated)
                reload = false;
            activated = false;
        }

        var address = document.URL;
        if (activated) {
            handleNewURL(address);
        } else {
            if (reload && redURLs.includes(address)) {
                window.location = address;
            }
        }
    });
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "active_tab_change") {
            if (activated) {
                handleNewURL(document.URL);
            }
        }

        if (request.message === "tab_updated") {
            if (activated) {
                handleNewURL(document.URL);
            }
        }

        if (request.message === "add_site") {
            addSite();
        }
    }
);


function handleNewURL(address) {
    for (var i = 0; i < redURLs.length; i++) {
        if (address.includes(redURLs[i]) || redURLs[i].includes(address)) {
            if (validURL(redURLs[i])) {
                warnUser();
            }
        }
    }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function warnUser() {
    document.open();
    displayWarning();
}

function displayWarning() {
    var message = "Don't even try ;)";
    message = message.fontcolor("white");
    document.write(message);
    document.body.style.backgroundColor = "red";

    var website = document.getElementsByTagName("*");

    for (var i = 0; i < website.length; i++) {
        website[i].style.font = "italic bold 50px arial,serif";
    }
}

function addSite() {
    var redSites = [];
    var url = document.URL;
    chrome.storage.sync.get("urls", function(value) {
        if (typeof value.urls === "undefined") {
            value.urls = [];
        }
        for (var i = 0; i < value.urls.length; i++) {
            redSites.push(value.urls[i]);
        }
        if (!redSites.includes(url)) {
            redSites.push(url);
        }
        chrome.storage.sync.set({"urls": redSites});
    });
}
