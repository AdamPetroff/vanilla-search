"use strict";

function httpGetAsync(url, callback, errorHandler) {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState === 4) {
            var parsedJsonResponse = JSON.parse(xmlHttp.responseText);
            if (xmlHttp.status === 200) {
                callback(parsedJsonResponse);
            } else {
                errorHandler(xmlHttp);
            }
        }
    };

    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

function serializeQuery(object) {
    var str = [];
    for (var property in object)
        if (object.hasOwnProperty(property)) {
            str.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
        }
    return str.join("&");
}

function copyObject(object) {
    return JSON.parse(JSON.stringify(object));
}