"use strict";

function createWebResult(title, url, formattedUrl, snippet) {
    var webResultEl = document.createElement('li');

    var template = '<a class="result-big-link" href="{url}"><b>{title}</b><p class="fake-link">{formattedUrl}</p><p>{snippet}</p></a>';

    webResultEl.innerHTML = template
        .replace('{url}', url)
        .replace('{title}', title)
        .replace('{formattedUrl}', formattedUrl)
        .replace('{snippet}', snippet);

    return webResultEl;
}

function createImageResult(url, thumbnail, title) {
    var imageResultEl = document.createElement('li');

    var template = '<a target="_blank" href="{url}"><img alt="{title}" src="{thumbnail}" /></a>';

    imageResultEl.innerHTML = template
        .replace('{url}', url)
        .replace('{title}', title)
        .replace('{thumbnail}', thumbnail);

    return imageResultEl;
}