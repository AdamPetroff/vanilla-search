"use strict";

var apiUrl = 'https://www.googleapis.com/customsearch/v1';

document.getElementById('search-submit').onclick = function (event) {
    event.preventDefault();
    search();
};

function search() {
    var input = document.getElementById('search-input');

    var queryParamsWebResults = {
        key: apiKey,
        cx: cx,
        num: 4,
        q: input.value
    };

    var queryParamsImageResults = {
        key: apiKey,
        cx: cx,
        num: 9,
        q: input.value,
        searchType: 'image'
    };

    searchWebResults(queryParamsWebResults);
    searchImageResults(queryParamsImageResults);
}

function searchWebResults(queryParams) {
    httpGetAsync(apiUrl + '?' + serializeQuery(queryParams), function (response) {
        var webResultsEl = document.getElementById('web-results');

        webResultsEl.innerHTML = '';

        response.items.forEach(function (item) {
            webResultsEl.appendChild(createWebResult(item.title, item.link, item.htmlFormattedUrl, item.snippet));
        });

        var webResultsNavigationEl = document.getElementById('web-results-navigation');

        createNavigation(webResultsNavigationEl, response, queryParams, searchWebResults);
    }, errorHandler);
}

function searchImageResults(queryParams) {
    httpGetAsync(apiUrl + '?' + serializeQuery(queryParams), function (response) {
        var imageResultsEl = document.getElementById('image-results');
        imageResultsEl.innerHTML = '';

        response.items.forEach(function (item) {
            imageResultsEl.appendChild(createImageResult(item.link, item.image.thumbnailLink, item.title));
        });

        var imageResultsNavigationEl = document.getElementById('image-results-navigation');

        createNavigation(imageResultsNavigationEl, response, queryParams, searchImageResults);
    }, errorHandler);
}

function createNavigation(navigationEl, response, queryParams, searchCallback) {
    navigationEl.innerHTML = '';

    if (response.queries.previousPage) {
        var previousPageEl = document.createElement('a');
        previousPageEl.innerHTML = '<';

        var previousPageQueryParams = copyObject(queryParams);
        previousPageQueryParams.start = response.queries.previousPage[0].startIndex;

        previousPageEl.setAttribute('href', apiUrl + '?' + serializeQuery(previousPageQueryParams));
        previousPageEl.setAttribute('class', 'navigation-link');

        previousPageEl.onclick = function (event) {
            event.preventDefault();
            searchCallback(previousPageQueryParams);
        };

        navigationEl.appendChild(previousPageEl);
    }

    if (response.queries.request) {
        var currentPageEl = document.createElement('span');
        currentPageEl.setAttribute('class', 'navigation-current-page');
        currentPageEl.innerHTML = parseInt(response.queries.request[0].startIndex / response.queries.request[0].count) + 1;

        navigationEl.appendChild(currentPageEl);
    }

    // check for number of results because of Google custom search restriction
    if (response.queries.nextPage && response.queries.nextPage[0].startIndex + queryParams.num <= 100) {
        var nextPageEl = document.createElement('a');

        nextPageEl.innerHTML = '>';

        var nextPageQueryParams = copyObject(queryParams);
        nextPageQueryParams.start = response.queries.nextPage[0].startIndex;

        nextPageEl.setAttribute('href', apiUrl + '?' + serializeQuery(nextPageQueryParams));
        nextPageEl.setAttribute('class', 'navigation-link');

        nextPageEl.onclick = function (event) {
            event.preventDefault();
            searchCallback(nextPageQueryParams);
        };

        navigationEl.appendChild(nextPageEl);
    }
}

function errorHandler(xmlHttp) {
    var parsedJsonBody = JSON.parse(xmlHttp.responseText);

    if(!(parsedJsonBody.hasOwnProperty('error') && parsedJsonBody.error.hasOwnProperty('errors'))) {
        alert('Something is broken. Sorry for that.');
        return;
    }

    parsedJsonBody.error.errors.forEach(function (error) {
        if (xmlHttp.status === 403 && error.reason === 'dailyLimitExceeded') {
            alert('Free daily usage limit for Google Custom Search exceeded.');
        } else if (xmlHttp.status === 400) {
            alert('There was a problem with connecting to Google. Please check if the values in the config file are valid.');
        }
    })
}
