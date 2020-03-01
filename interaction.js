chrome.storage.sync.get("active", function(value) {
    if (value.active === "true") {
        document.getElementById("activate").style.background = "#FF0000";
    } else {
        document.getElementById("pause").style.background = "#00FF7F";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("activate").addEventListener("click", function() {
        chrome.storage.sync.set({"active": "true"});
        document.getElementById("activate").style.background = "#FF0000";
        document.getElementById("pause").style.background = "";
    });

    document.getElementById("pause").addEventListener("click", function() {
        chrome.storage.sync.set({"active": "false"});
        document.getElementById("activate").style.background = "";
        document.getElementById("pause").style.background = "#00FF7F";
    });

    var checkAdd = document.getElementById("add");
    if (checkAdd) {
        checkAdd.addEventListener("click", function() {
            var url = document.getElementById("newURL").value;
            var textField = document.getElementById("newURL");

            if (url === "") {
                textField.value = "You did not enter any URL";
            } else {
                var redURLs = [];
                chrome.storage.sync.get("urls", function(value) {
                    if (typeof value.urls === "undefined") {
                        value.urls = [];
                    }
                    for (var i = 0; i < value.urls.length; i++) {
                        redURLs.push(value.urls[i]);
                    }
                    if (!redURLs.includes(url)) {
                        redURLs.push(url);
                        textField.value = "Added successfully";
                        setTimeout(function() {
                            textField.value = "";
                        }, 2000);
                    } else {
                        textField.value = "URL already in list";
                        setTimeout(function() {
                            textField.value = "";
                        }, 2500);
                    }
                    chrome.storage.sync.set({"urls": redURLs});

                });

                var checkEx = document.getElementById("displayUrls");
                if (checkEx) {
                    hide();
                }
            }
        });
    }

    var checkRemove = document.getElementById("remove");
    if (checkRemove) {
        checkRemove.addEventListener("click", function() {
            var url = document.getElementById("newURL").value;
            var textField = document.getElementById("newURL");

            if (url === "") {
                textField.value = "You did not enter any URL";
                setTimeout(function() {
                    textField.value = "";
                }, 2500);
            } else {
                chrome.storage.sync.get("urls", function(value) {
                    if (value.urls) {
                        var index = value.urls.indexOf(url);
                        if (index > -1) {
                            value.urls.splice(index, 1);
                            textField.value = "Removed successfully"
                            setTimeout(function() {
                                textField.value = "";
                            }, 2000);
                        } else if (value.urls.length > 0) {
                            textField.value = "This URL is not in your list";
                            setTimeout(function() {
                                textField.value = "";
                            }, 2500);
                        }
                        chrome.storage.sync.set({"urls": value.urls});
                    } else {
                        textField.value = "You have not added any URLs yet";
                        setTimeout(function() {
                            textField.value = "";
                        }, 2500);
                    }
                });

                var checkEx = document.getElementById("displayUrls");
                if (checkEx) {
                    hide();
                }
            }
        });
    }

    document.getElementById("show").addEventListener("click", function() {
        chrome.storage.sync.get("urls", function(value) {
            if (typeof value.urls !== "undefined" && value.urls.length > 0) {
                var allURLs = [];
                for (var i = 0; i < value.urls.length; i++) {
                    allURLs.push(value.urls[i]);
                }
                var checkEx = document.getElementById("displayUrls");
                if (checkEx === null) {
                    display(allURLs);
                }
            } else {
                var textField = document.getElementById("newURL");
                textField.value = ("You have not added any URLs yet");
                setTimeout(function() {
                    textField.value = "";
                }, 2500);
            }
        });
    });

    document.getElementById("clear").addEventListener("click", function() {
        var textField = document.getElementById("newURL");

        chrome.storage.sync.get("urls", function(value) {
            var textField = document.getElementById("newURL");

            if (typeof value.urls !== "undefined" && value.urls.length > 0) {
                chrome.storage.sync.remove("urls");
                var checkEx = document.getElementById("displayUrls");
                if (checkEx) {
                    hide();
                }
                textField.value = "Removed successfully";
                setTimeout(function() {
                    textField.value = "";
                }, 2000);
            } else {
                textField.value = "You have not added any URLs yet";
                setTimeout(function() {
                    textField.value = "";
                }, 2500);
            }
        });
    });
});

function display(allURLs) {
    //urls
    var div = document.createElement("div");
    div.id = "displayUrls";
    var linebreak = document.createElement("br");
    for (var i = 0; i < allURLs.length; i++) {
        var paragraph = document.createElement("p");
        paragraph.textContent = allURLs[i];
        div.appendChild(paragraph);
        div.appendChild(linebreak);
    }
    document.body.appendChild(div);

    //hide button
    var hideBtn = document.createElement("BUTTON");
    hideBtn.id = "hideUrls";
    hideBtn.textContent = "Hide URLs";
    document.body.appendChild(hideBtn);
    hideBtn.addEventListener("click", function() {
        hide();
    });
}

function hide() {
    var div = document.getElementById("displayUrls");
    var hideBtn = document.getElementById("hideUrls");
    document.body.removeChild(div);
    document.body.removeChild(hideBtn);
}
