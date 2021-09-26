let nytFictionRequest = `https://api.nytimes.com/svc/books/v3/lists.json?list-name=combined-print-and-e-book-fiction&api-key=${nytKey}`;
let nytNonfictionRequest = `https://api.nytimes.com/svc/books/v3/lists.json?list-name=combined-print-and-e-book-nonfiction&api-key=${nytKey}`

const printCarousel = async() => {
    try {

        let bestSellerLists = await Promise.all([
        fetch(nytFictionRequest).then(response => response.json()),
        fetch(nytNonfictionRequest).then(response => response.json())
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
            isbn = nytimesBestSellers[j].results[i].book_details[0].primary_isbn10;
            amazonUrl = nytimesBestSellers[j].results[i].amazon_product_url;
            updateCover(j+i*2, isbn, amazonUrl);
        }
    }
}

const createCarouselContent = () => {
    let carousel = document.querySelector('.carousel-inner');

    for (let i = 0; i < 5; i++) {
        carousel.innerHTML += `
        <div class="carousel-item" data-bs-interval="8000">
            <div class="row align-items-center carousel-row" id="carousel-row-${i}">
            </div>
        </div>`;

        document.getElementsByClassName("carousel-item")[0].className += " active";
        let carouselRows = document.getElementsByClassName("carousel-row");

        for (let j = 0; j < 6; j++) {
            carouselRows[i].innerHTML += `<div class="col-md-2 d-flex justify-content-center carousel-book"
            id="carousel-book-${j+i*6}"></div>`;
        }
    }
}

const updateCover = async(id, isbn, url) => {
    try {
        let bookUrl = url;
        let bookId = '';

        let img = `https://www.syndetics.com/index.aspx?isbn=${isbn}/LC.JPG`;
        let carouselBooks = document.getElementsByClassName("carousel-book");
        let currentId = carouselBooks[id].id;

        if (document.getElementById("carousel-user") != null) {

            let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${googleKey}`);

            let data = await response.json();
            bookId = await data.items[0].id;

            bookUrl = `user/search/results/view/${bookId}`;
        }

        document.getElementById(currentId).innerHTML += `<a href="${bookUrl}" target="_blank"><img class="book" src=${img}></img></a>`;
    } catch(err) {
        console.error(err);
    }
}