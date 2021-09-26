const books = document.querySelectorAll("img");
const deleteButton = document.querySelector("#deleteButton");
deleteButton.disabled = true;

let selected = [];

for(let i=0; i < books.length; i++) {

    books[i].addEventListener('click', function (e) {

    if(books[i].style.opacity === "0.5") {
        books[i].style.opacity = "100%";
        books[i].style.height = "200px";
        books[i].style.width = "133px"
        books[i].style.marginTop = "0rem";
        selected.splice(books[i],1);
    } else {
        books[i].style.opacity = "50%";
        books[i].style.height = "180px";
        books[i].style.width = "120px";
        books[i].style.alignItems = "center";
        books[i].style.marginTop = ".3rem";
        selected.push(books[i]);
        deleteButton.disabled = false;
    }

    if (selected.length === 0) {
        deleteButton.disabled = true;
    }

    });

}

const deleteBooks = () => {
    document.getElementById('deleteForm').submit();
}


