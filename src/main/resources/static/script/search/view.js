import {
    returnBookObjectFromJson,
    returnObjectFieldsAsHtml,
    renderAddBookButton,
    renderBuyButton,
    fillAddBookForm,
    generateTagLinks
} from './modules/bookFunctions.js';

const API_ENDPOINT = 'https://www.googleapis.com'

let promise = [];

let bookDetails = document.getElementById('book-details');
let coverAndRating = document.getElementById('cover-and-rating');
let bookDescription = document.getElementById('book-description');

bookIsbns = bookIsbns.replaceAll("[", "").replaceAll("]", "").replaceAll(" ", "");
bookIsbns = bookIsbns.split(",");

bookIds = bookIds.replaceAll("[", "").replaceAll("]", "").replaceAll(" ", "");
bookIds = bookIds.split(",");
let bookShelfId = null;

const go = async () => {
    await printBook(bookId);
}

const printBook = async (bookId) => {
    await retrieveBook(bookId);

    let bookObject = returnBookObjectFromJson(promise[0]);
    let alreadyInBookshelf = await checkBookshelf(bookObject.industryIdentifiers, bookIsbns);

    await renderPage(bookObject);
    await fillAddBookForm(bookObject);
    renderAddBookButton(alreadyInBookshelf, bookShelfId);
    renderBuyButton(bookObject);
}

const retrieveBook = async (bookId) => {
    promise = [];
    let response = await fetch(`${API_ENDPOINT}/books/v1/volumes/${bookId}?key=${API_KEY}`);
    promise.push(await response.json());
}

const renderPage = async (bookObject) => {

    let coverImageContainer = document.createElement('div');

    coverImageContainer.innerHTML = `
        <img
            id="cover-image"
            class="img-fluid book mb-5"
            src="${bookObject.thumbnail2}"
            alt="cover for ${bookObject.title}"
            onerror='this.onerror = null; this.src="${bookObject.thumbnail}"'
        >
    `;

    coverAndRating.appendChild(coverImageContainer);

    let rating = document.createElement('div');
    rating.id = 'rating-details';

    if (bookObject.averageRating != undefined) {

    rating.innerHTML = `
        <label class="rating-label">Average rating: ${bookObject.averageRating} <span class="rating-count">(${bookObject.ratingsCount})</span>
          <input
            class="rating"
            max="5"
            readonly
            step="0.01"
            style="--fill:gray;--value:${bookObject.averageRating}"
            type="range"
            value="${bookObject.averageRating}">
        </label>
    `;
    } else {
        rating.innerHTML = `<label class="rating-label">No ratings</label>`
    }
    coverAndRating.appendChild(rating);

    bookDetails.innerHTML = `
         <h1 class="display-6 fw-bold text-dark">${bookObject.title}</h1>
         <h4>by ${bookObject.author}</h4>
         <div class="row" style="margin-top: 2rem;">
            <div class="col">
                 <p>Pages: ${bookObject.pageCount}</p>
                 <p>Genre: ${bookObject.genre}</p>
            </div>
            <div class="col">
                <p>Publication Date: ${bookObject.publishedDate}</p>
                <p>ISBN: ${bookObject.industryIdentifiers}</p>
            </div>
         </div>
         <p class="book-detail" style="margin-top: 1rem;">Tags: ${generateTagLinks(bookObject.tags)}</p>
    `;

    let descriptionHeading = document.createElement('h4');
    descriptionHeading.id = 'description-heading';
    descriptionHeading.innerHTML = 'Description';

    let description = document.createElement('p');
    description.id = 'description-text';
    if(bookObject.description != undefined) {
        description.innerHTML = `${bookObject.description}`;
    } else {
        description.innerHTML = 'No description available';
    }

    bookDescription.appendChild(descriptionHeading);
    bookDescription.appendChild(description);

}

// function to determine whether to display "add book" or "view in bookshelf" button
const checkBookshelf = async (isbn, shelfIsbns) => {
    if (shelfIsbns.includes(isbn)) {
        bookShelfId = bookIds[shelfIsbns.indexOf(isbn)];
        return true;
    }
    return false;
}

window.addEventListener('load', go);
