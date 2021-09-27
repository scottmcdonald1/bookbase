function getThumbnail(jsonItem) {
    let basePath = /*[[@{}]]*/'';
    let fileName = '/images/not-found.png';
    let filePath = basePath + fileName;

    let thumbnail = "";

    if(jsonItem.volumeInfo.imageLinks === undefined) {
        thumbnail = filePath;
    } else {
        thumbnail = jsonItem.volumeInfo.imageLinks.thumbnail;
    }

    return thumbnail;
}

function getHighResThumb(jsonItem) {
    return 'https://www.syndetics.com/index.aspx?isbn='+getIsbn(jsonItem)+'/LC.JPG';
}

function getAllCategories(jsonItem) {
    let categories = jsonItem.volumeInfo.categories;
    let categoriesArray = [];

    if (categories === undefined || categories === null || categories === 'undefined') {
        categoriesArray.push('None listed')
    } else {
        if(Array.isArray(categories)) {

            for (let i = 0; i < categories.length; i++) {
                if (categories[i].includes("/")) {
                    let subCategories = categories[i].split("/");
                    for (let j = 0; j < subCategories.length; j++) {
                        categoriesArray.push(subCategories[j].trim());
                    }
                } else {
                    categoriesArray.push(categories[i].trim());
                }
            }
        } else {
            if (categories.includes("/")) {
                let subCategories = categories.split("/");
                for (let i = 0; i < subCategories.length; i++) {
                    categoriesArray.push(subCategories[i].trim())
                }
            } else {
                categoriesArray.push(categories);
            }
        }
    }

    return categoriesArray;

}

function getIsbn(jsonItem) {
    let isbn = '';
    if (jsonItem.volumeInfo.industryIdentifiers === undefined) {
        isbn = 'not found';
    } else if(Array.isArray(jsonItem.volumeInfo.industryIdentifiers) && jsonItem.volumeInfo.industryIdentifiers.length > 1) {
        isbn = jsonItem.volumeInfo.industryIdentifiers[1].identifier;
    } else {
        isbn = jsonItem.volumeInfo.industryIdentifiers[0].identifier;
    }
    return isbn;
}

// EXPORT FUNCTION
function returnBookObjectFromJson(jsonItem) {

    let tags = getAllCategories(jsonItem);

    let bookObject = {
        googleId: jsonItem.id,
        title: jsonItem.volumeInfo.title,
        author: jsonItem.volumeInfo.authors,
        description: jsonItem.volumeInfo.description,
        thumbnail: getThumbnail(jsonItem),
        thumbnail2: 'https://www.syndetics.com/index.aspx?isbn='+getIsbn(jsonItem)+'/LC.JPG',
        genre: tags[0],
        tags: tags,
        pageCount: jsonItem.volumeInfo.pageCount,
        publishedDate: jsonItem.volumeInfo.publishedDate,
        industryIdentifiers: getIsbn(jsonItem),
        averageRating: jsonItem.volumeInfo.averageRating,
        ratingsCount: jsonItem.volumeInfo.ratingsCount,
        isEmbeddable: jsonItem.accessInfo.embeddable,
        webReaderLink: jsonItem.accessInfo.webReaderLink
    }
    return bookObject;
}


// EXPORT FUNCTION
function returnObjectFieldsAsHtml(object) {
    let baseLink = /*[[@{}]]*/'';
    let linkName = `view/${object.googleId}`;
    let viewLink = baseLink + linkName;
    return `
        <div class="card-img-top book-cover">
            <div class="cover-image">
                <a href="${viewLink}" class="view-link">
                    <img
                        class="img-fluid book"
                        src="${object.thumbnail2}"
                        alt="cover for ${object.title}"
                        onerror='this.onerror = null; this.src="${object.thumbnail}"'
                        onmouseover="this.style.opacity='50%'"
                        onmouseout="this.style.opacity='100%'"
                    >
                </a>
            </div>
        </div>
        <div class="card-body book-info">
            <p class="fs-5 title">${object.title}</p>
            <p class="fs-6 author">${object.author}</p>
            <a href="${viewLink}" class="btn btn-primary view-book-button">View Book</a>
        </div>

    `;
}

// EXPORT FUNCTION
function renderAddBookButton(alreadyInBookshelf, bookShelfId) {
    const addButton = document.getElementById('add-button');
    let addBookForm = document.getElementById('add-book-form-container');

    if(alreadyInBookshelf === true) {
        addButton.innerHTML = `
            <a href="/user/view/${bookShelfId}">
                <button class="btn btn-primary mb-5" style="width:170px">view on shelf</button>
            </a>
        `;
    } else {
        addButton.innerHTML = `<button class="btn btn-primary mb-5" style="width:170px">add book</button>`
        addButton.addEventListener('click', (event) => {
            event.preventDefault();
            addBookForm.classList.add('active')
        })

        addBookForm.addEventListener('click', e => {
            if (e.target !== e.currentTarget) return
            addBookForm.classList.remove('active')
        })
    }
}

// EXPORT FUNCTION
function renderBuyButton(bookObject) {
    let buttonsContainer = document.getElementById('buttons');
    let previewButton = document.getElementById('previewButton')

    let buyButton = document.createElement('div');
    buyButton.className = 'btn-group';
    buyButton.classList.add('mb-5');
    buyButton.style.width = '170px'

    let searchTitle = bookObject.title.replaceAll(/[\W_]\s+/g, "");

    buyButton.innerHTML = `
        <button type="button" class="btn btn-sm btn-secondary dropdown-toggle fs-6" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-cart4 me-2"></i> Buy
        </button>
        <ul class="dropdown-menu">
            <li class="fs-6"><a href="${'https://www.amazon.com/s?k=' + searchTitle}" target="_blank" class="dropdown-item" value="Amazon">Amazon</a></li>
            <li class="fs-6"><a href="${'https://www.audible.com/search?keywords=' + searchTitle}" target="_blank" class="dropdown-item" value="Audible">Audible</a></li>
            <li class="fs-6"><a href="${'https://www.barnesandnoble.com/s/' + searchTitle}" target="_blank" class="dropdown-item" value="B&N">Barnes & Noble</a></li>
            <li class="fs-6"><a href="${'https://www.abebooks.com/servlet/SearchResults?tn=' + searchTitle}" target="_blank" class="dropdown-item" value="AbeBooks">AbeBooks</a></li>
            <li class="fs-6"><a href="${'https://www.bookdepository.com/search?searchTerm=' + searchTitle + '%20' + bookObject.author}" target="_blank" class="dropdown-item" value="Book Depository">Book Depository</a></li>
            <li><hr/></li>
            <li class="fs-6"><a href="${'https://www.worldcat.org/title/' + searchTitle}" target="_blank" class="dropdown-item" value="Book Depository">Find a Library</a></li>
        </ul>
    `;

    buttonsContainer.insertBefore(buyButton, previewButton);
}

// EXPORT FUNCTION
function fillAddBookForm(bookObject) {
    let descriptionText = "";
    if (bookObject.description != undefined) {
        descriptionText = bookObject.description;
        descriptionText = descriptionText.replaceAll(/<\/?[^>]+(>|$)/g, "");
    }


    let title = document.getElementById('title');
    let author = document.getElementById('author');
    let isbn = document.getElementById('isbn');
    let pages = document.getElementById('pages');
    let genre = document.getElementById('genre');
    let description = document.getElementById('description');
    let thumbnail = document.getElementById('thumbnail');
    let formThumbnail = document.getElementById('form-thumbnail');

    title.value = bookObject.title;
    author.value = bookObject.author;
    isbn.value = bookObject.industryIdentifiers;
    pages.value = bookObject.pageCount;
    genre.value = bookObject.genre;
    description.value = descriptionText;

    thumbnail.value = bookObject.thumbnail2;

    formThumbnail.innerHTML = `
        <img
            id="form-thumbnail"
            class="img-fluid"
            src="${bookObject.thumbnail2}"
            alt="cover for ${bookObject.title}"
            onerror='this.onerror = null; this.src="${bookObject.thumbnail}"; thumbnail.value="${bookObject.thumbnail}"'
        >
    `;
}

function generateTagLinks(categoriesArray) {
    let tags = "";
    if (categoriesArray.length === 1) {
        if(categoriesArray[0] === "None listed") {
            return "None listed";
        } else {
            let category = categoriesArray[0].toLowerCase().replaceAll(" ", "+");
            return `
                <a class="tag" href="/user/search/results/q=${category}&maxResults=10&page=1">${categoriesArray[0]}</a>
            `;
        }
    } else {
        for (let i = 0; i < categoriesArray.length; i++) {
            let category = categoriesArray[i].toLowerCase().replaceAll(" ", "+");
            category = category.replaceAll("&", "");
            category = category.replaceAll(",", "");
            category = category.replaceAll("++", "+");
            tags += `<a class="tag" href="/user/search/results/q=${category}&maxResults=10&page=1">${categoriesArray[i]}</a>`
        }
        return tags;
    }
}

export {
    returnBookObjectFromJson,
    returnObjectFieldsAsHtml,
    renderAddBookButton,
    renderBuyButton,
    fillAddBookForm,
    generateTagLinks
}