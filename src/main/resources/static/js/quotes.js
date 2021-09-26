const quotesObject = [
    {
        quote: 'There is some good in this world, and it’s worth fighting for.',
        author: 'J.R.R. Tolkien',
        book: 'The Two Towers',
    },
    {
        quote: 'We accept the love we think we deserve.',
        author: 'Stephen Chbosky',
        book: 'The Perks of Being a Wallflower',
    },
    {
        quote: 'A man, after he has brushed off the dust and chips of his life, will have left only the hard, clean questions: Was it good or was it evil? Have I done well — or ill?',
        author: 'John Steinbeck',
        book: 'East of Eden',
    },
    {
        quote: 'All happy families are alike; each unhappy family is unhappy in its own way.',
        author: 'Leo Tolstoy',
        book: 'Anna Karenina',
    },
    {
        quote: 'Who controls the past controls the future. Who controls the present controls the past.',
        author: 'George Orwell',
        book: '1984',
    },
    {
        quote: 'It does not do to dwell on dreams and forget to live.',
        author: 'J.K. Rowling',
        book: 'Harry Potter and the Sorcerer’s Stone',
    },
    {
        quote: 'So it goes…',
        author: 'Kurt Vonnegut',
        book: 'Slaughterhouse-Five',
    },
    {
        quote: 'It was a pleasure to burn.',
        author: 'Ray Bradbury',
        book: 'Fahrenheit 451',
    },
    {
        quote: 'There are years that ask questions and years that answer.',
        author: 'Zora Neale Hurston',
        book: 'Their Eyes Were Watching God',
    },
    {
        quote: 'It is nothing to die; it is dreadful not to live.',
        author: 'Victor Hugo',
        book: 'Les Misérables',
    },
    {
        quote: 'Memories, even your most precious ones, fade surprisingly quickly. But I don’t go along with that. The memories I value most, I don’t ever see them fading.',
        author: 'Kazuo Ishiguro',
        book: 'Never Let Me Go',
    },
    {
        quote: 'And, when you want something, all the universe conspires in helping you to achieve it.',
        author: 'Paulo Coelho',
        book: 'The Alchemist',
        },
    {
        quote: 'Sometimes I can hear my bones straining under the weight of all the lives I’m not living.',
        author: 'Jonathan Safran Foer',
        book: 'Extremely Loud and Incredibly Close',
    },
    {
        quote: 'It is our choices, Harry, that show what we truly are, far more than our abilities.',
        author: 'J.K. Rowling',
        book: 'Harry Potter and the Chamber of Secrets',
    },
    {
        quote: 'All we can know is that we know nothing. And that’s the height of human wisdom.',
        author: 'Leo Tolstoy',
        book: 'War and Peace',
    },
    {
        quote: 'There is nothing like looking, if you want to find something. You certainly usually find something, if you look, but it is not always quite the something you were after.',
        author: 'J.R.R. Tolkien',
        book: 'The Hobbit',
    },
    {
        quote: 'Enthusiasm makes up for a host of deficiencies.',
        author: 'Barack Obama',
        book: 'A Promised Land',
    },
    {
        quote: 'It’s the possibility of having a dream come true that makes life interesting.',
        author: 'Paul Coelho',
        book: 'The Alchemist',
    },
    {
        quote: 'There is no greater agony than bearing an untold story inside you.',
        author: 'Maya Angelou',
        book: 'I Know Why The Caged Bird Sings',
    },
    {
        quote: 'Open your eyes and see what you can with them before they close forever.',
        author: 'Anthony Doerr',
        book: 'All The Light We Cannot See',
    },
    {
        quote: 'Nothing in life is as important as you think it is, while you are thinking about it.',
        author: 'Daniel Kahnem',
        book: 'Thinking, Fast and Slow',
    },
    {
        quote: 'Those who don’t believe in magic will never find it.',
        author: 'Roald Dahl',
        book: 'The Minpins',
    },
    {
        quote: 'Sometimes weak and wan, sometimes strong and full of light. The moon understands what it means to be human.',
        author: 'Tahereh Mafi',
        book: 'Shatter Me',
    },
    {
        quote: 'It is a curious thought, but it is only when you see people looking ridiculous that you realize just how much you love them.',
        author: 'Agatha Christie',
        book: 'An Autobiography',
    },
    {
        quote: 'A friend may be waiting behind a stranger’s face.',
        author: 'Maya Angelou',
        book: 'Letter to My Daughter',
    },
    {
        quote: 'I am not afraid of storms, for I am learning how to sail my ship.',
        author: 'Louisa May Alcott',
        book: 'Little Women',
    },
    {
        quote: 'Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.',
        author: 'H.Jackson Brown Jr.',
        book: 'P.S. I Love You',
    },
    {
        quote: 'Get busy living, or get busy dying.',
        author: 'Stephen King',
        book: 'Different Seasons',
    },
    {
        quote: 'The goal isn’t to live forever, the goal is to create something that will.',
        author: 'Chuck Palahniuk',
        book: 'Diary',
    },
    {
        quote: 'Travel far enough, you meet yourself.',
        author: 'David Mitchel',
        book: 'Cloud Atlas',
    },
    {
        quote: 'It’s no use going back to yesterday, because I was a different person then.',
        author: 'Lewis Carroll',
        book: 'Alice’s Adventures in Wonderland',
    }
];

function newQuote() {
    let randomNumber = Math.floor(Math.random() * (quotesObject.length));

    let container = document.getElementById("blockquote-container");
    let quote = quotesObject[randomNumber].quote;
    let author = quotesObject[randomNumber].author;
    let book = quotesObject[randomNumber].book;

    container.innerHTML += `
        <div class="row pt-4">
            <div class="col-1">    
                <i class="bi bi-chat-right-quote-fill display-6 me-3" style="color:#6C63FF"></i>
            </div>
            <div class="col-11">
                <p class="col d-inline-block mx-4 lead fs-4 lh-sm" id="quoteDisplay">${quote}</p>
            </div>
        </div>
        <figcaption class="ps-3 pt-4 mt-4 border-top d-flex flex-wrap blockquote-footer">
            <p id="authorDisplay">${author}, </p>
            <cite id="bookDisplay" class="ms-1" style="color:#6C63FF">${book}</cite>
        </figcaption>`;
}

document.addEventListener("DOMContentLoaded", function() {
    newQuote();
});