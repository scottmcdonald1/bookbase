import {
    returnBookObjectFromJson,
    returnObjectFieldsAsHtml
} from './modules/bookFunctions.js';

let promises = [];
let totalResults = 0;

const API_ENDPOINT = "https://www.googleapis.com";

let results = document.getElementById('results');
let pageNumbersContainer = document.getElementById('page-numbers-container');
let pageNumbers = document.querySelectorAll('page-number');

const go = async () => {
    await printBooks(query, startIndex, maxResults);
}

const printBooks = async (query, startIndex, maxResults) => {

    results.innerHTML = '';

    await retrieveBooks(query, startIndex, maxResults);

    let books = promises[0].items;
    let totalResultsReturned = document.getElementById('totalResultsReturned');
    totalResultsReturned.innerHTML = totalResults;

    books.forEach(book => {
        book = returnBookObjectFromJson(book);
        let result = document.createElement('div');
        result.classList.add('card');
        result.classList.add('result');
        result.classList.add('bg-light');
        result.innerHTML = returnObjectFieldsAsHtml(book);
        results.appendChild(result);
    })

    const pages = ((totalResults - (totalResults % maxResults)) / maxResults) + 1;
    await renderPageNumbers(pages, currentPage);

}

const retrieveBooks = async (query, startIndex, maxResults) => {
    promises = [];
    let response = await fetch(`${API_ENDPOINT}/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&orderBy=relevance&key=${API_KEY}`);
    promises.push(await response.json());

    await Promise.all(promises).then(data => {
        totalResults = data[0].totalItems;
    })
}

const renderPageNumbers = async (pages, currentPage) => {

    pageNumbersContainer.innerHTML = '';

    let previousPageButton = document.createElement('a');
    previousPageButton.id = 'previous-page';
    previousPageButton.innerHTML = '<span class="page-arrow">⇦</span> previous';
    previousPageButton.classList.add('page-number');
    if(Number(currentPage) === 1) {
        previousPageButton.classList.add('disabled');
    } else {
        previousPageButton.href = `q=${query}&maxResults=${maxResults}&page=${Number(currentPage) - 1}`;
    }

    pageNumbersContainer.appendChild(previousPageButton);

    let startPage = 1;
    let endPage = pages;

    if(Number(currentPage) > 6) {
        let pageOne = document.createElement('a');
        pageOne.id = 1;
        pageOne.classList.add('page-number');
        pageOne.href = `q=${query}&maxResults=${maxResults}&page=1`;
        pageOne.innerHTML = '1';
        pageNumbersContainer.appendChild(pageOne);

        let pageNumberBreak = document.createElement('a');
        pageNumberBreak.classList.add('page-number');
        pageNumberBreak.classList.add('disabled');
        pageNumberBreak.innerHTML = '. . .';
        pageNumbersContainer.appendChild(pageNumberBreak);

        startPage = Number(currentPage) - 3;
        endPage = Number(currentPage) + 3;
        if (endPage > pages) {
            startPage = Number(currentPage) - (6 - (3 - (endPage - pages)));
            endPage = pages;
        }
    } else {
        startPage = 1;
        if (pages > 9) {
            endPage = 9;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        let pageNumber = document.createElement('a');
        pageNumber.id = i;
        pageNumber.classList.add('page-number');
        if (pageNumber.id === currentPage) {
            pageNumber.classList.add('active');
        }
        pageNumber.href = `q=${query}&maxResults=${maxResults}&page=${i}`;
        pageNumber.innerHTML = i.toString();
        pageNumbersContainer.appendChild(pageNumber);
    }

    let nextPageButton = document.createElement('a');
    nextPageButton.id = 'next-page';
    nextPageButton.innerHTML = 'next <span class="page-arrow">⇨</span>';
    nextPageButton.classList.add('page-number');
    if(Number(currentPage) === pages) {
        nextPageButton.classList.add('disabled');
    } else {
        nextPageButton.href = `q=${query}&maxResults=${maxResults}&page=${Number(currentPage) + 1}`;
    }
    pageNumbersContainer.appendChild(nextPageButton)

}

window.addEventListener('load', go);