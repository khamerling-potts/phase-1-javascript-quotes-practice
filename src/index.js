//submit event listener for form
//call back function will grab values from input fields
//create an object using those values
//call displayquote using that object

//fetch delete passing in quote's id
//after delete is done, remove the quote card from dom

//event listener for clicking like button
//fetch post using given url, passing in quote to callback function
//when fetch is done, access the span by finding the event target's child
//increment inner text of that span

const quoteList = document.getElementById("quote-list");
const form = document.querySelector("#new-quote-form");
const newQuote = document.querySelector("#new-quote");
const newAuthor = document.querySelector("#author");

fetch("http://localhost:3000/quotes?_embed=likes")
  .then((res) => res.json())
  .then((data) => data.forEach(displayQuote))
  .then((moreData) =>
    form.addEventListener("submit", (event) => createQuote(event))
  );

function displayQuote(quote) {
  const li = document.createElement("li");
  li.className = "quote-card";
  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";
  const p = document.createElement("p");
  p.className = "mb-0";
  p.innerText = quote.quote;
  const footer = document.createElement("footer");
  footer.className = "blockquote-footer";
  footer.innerText = quote.author;
  const br = document.createElement("br");
  const like = document.createElement("button");
  like.className = "btn-success";
  const del = document.createElement("button");
  del.className = "btn-danger";
  del.innerText = "Delete";
  fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
    .then((res) => res.json())
    .then((data) => {
      like.innerHTML = `likes: <span>${data.length}</span>`;
      blockquote.append(p, footer, br, like, del);
      li.append(blockquote);
      quoteList.append(li);
      del.addEventListener("click", (event) => deleteQuote(event, quote, li));
      like.addEventListener("click", (event) => likeQuote(event, quote));
    });
}

function createQuote(event) {
  event.preventDefault();
  const quote = {
    quote: newQuote.value,
    author: newAuthor.value,
  };
  const configObj = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(quote),
  };
  fetch("http://localhost:3000/quotes", configObj)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      displayQuote(data); //MUST use data here and not quote bc we need the id from the fetch's returned quote
    });
}

function deleteQuote(event, quote, li) {
  const configObj = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch(`http://localhost:3000/quotes/${quote.id}`, configObj)
    .then((res) => res.json())
    .then((data) => li.remove());
}

function likeQuote(event, quote) {
  console.log(quote.id);
  const configObj = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quoteId: quote.id,
    }),
  };
  fetch("http://localhost:3000/likes", configObj)
    .then((res) => res.json())
    .then((data) => {
      const span = event.target.querySelector("span");
      span.innerText = ++span.innerText;
      console.log(span);
    });
}
