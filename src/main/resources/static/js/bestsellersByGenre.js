const genre = document.getElementsByClassName("bestsellers-list")[0].id;

let nytRequest = `https://api.nytimes.com/svc/books/v3/lists.json?list-name=${genre}&api-key=${nytKey}`;

const printBestSellers = async() => {
    try {
        let bestSellerList = await fetch(nytRequest).then(response => response.json());

        await generateBestSellersList(bestSellerList);
    } catch(err) {
        console.error(err);
    }
}

printBestSellers();

const generateBestSellersList = async(nytBestSellers) => {
    for (const book of nytBestSellers.results) {
        let isbn = book.book_details[0].primary_isbn10;
        let title = book.book_details[0].title;
        let description = book.book_details[0].description;
        let author = book.book_details[0].author;
        let bookRank = book.rank;
        let cover = `https://www.syndetics.com/index.aspx?isbn=${isbn}/LC.JPG`;
        let url = await generateUrl(isbn);

        let listing = `
            <hr class="mb-4">
            <div id="${bookRank}" class="row bestsellerEntry py-3 ps-4 gap-5 gap-md-0">
                <p class="col-3 me-3"><img src="${cover}" class="book" id="cover-${bookRank}">
                <div class="col">
                    <h4>#${bookRank} - <a href="${url}" target="_blank">${title}</a></h4>
                    <h6>By ${author}</h6>
                    <p>${description}</p>
                </div>
            </div>`;

        document.getElementById(genre).innerHTML += listing;
    }
}

const generateUrl = async(isbn) => {
    try {
        let response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${googleKey}`);

        let data = await response.json();

        let id = await data.items[0].id;

        let baseLink = /*[[@{}]]*/'';
        let linkName = `user/search/results/view/${id}`;
        let viewLink = baseLink + linkName;

        return viewLink;
    } catch(err) {
        console.error(err);
    }
}