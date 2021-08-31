const printCarousel = async() => {
    try {
        let bestSellerLists = await Promise.all([
        fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=xUl556gGXqPKARPggVztexuH1B80EvGJ').then(response => response.json()),
        fetch('https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-nonfiction&api-key=xUl556gGXqPKARPggVztexuH1B80EvGJ').then(response => response.json())
        ]);

        updateBestSellers(bestSellerLists);
    } catch(err) {
        console.error(err);
    }
}

printCarousel();

const updateBestSellers = (nytimesBestSellers) => {
    createCarouselContent();

    for (let i = 0; i < 15; i++) {
        let isbn = '';
        let amazonUrl = '';

        for (let j = 0; j < 2; j++) {
            isbn = nytimesBestSellers[j].results[i].isbns[0].isbn10;
            amazonUrl = nytimesBestSellers[j].results[i].amazon_product_url;
            updateCover(j+i*2, isbn, amazonUrl);
        }
    }
}

const createCarouselContent = () => {
    let carousel = document.querySelector('.carousel-inner');

    for (let i = 0; i < 5; i++) {
        carousel.innerHTML += `
        <div class="carousel-item" data-bs-interval="5000">
            <div class="row align-items-center justify-content-evenly carousel-row" id="carousel-row-${i}">
            </div>
        </div>`;

        document.getElementsByClassName("carousel-item")[0].className += " active";
        let carouselRows = document.getElementsByClassName("carousel-row");

        for (let j = 0; j < 6; j++) {
            carouselRows[i].innerHTML += `<div class="col-md-1 carousel-book" id="carousel-book-${j+i*6}"></div>`;
        }
    }
}

const updateCover = async(id, isbn, url) => {
    try {
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDk87M-Tr5KQMeR2ZlCIjQ2nEsqiAo-uMg`);
        let data = await response.json();

        let img = await data.items[0].volumeInfo.imageLinks.thumbnail;
        img = img.replace(/^http:\/\//i, 'https://');   // replaces HTTP links with secure HTTPS versions

        let carouselBooks = document.getElementsByClassName("carousel-book");
        let currentId = carouselBooks[id].id;
        document.getElementById(currentId).innerHTML += `<a href="${url}" target="_blank"><img class="book" src=${img}></img></a>`;
    } catch(err) {
        console.error(err);
    }
}