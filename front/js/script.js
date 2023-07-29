console.log("hi mom");

const articlesFound = [];

// TODO use fetch api to get the products json

fetch('http://localhost:3000/api/products')
.then(data => {
    return data.json();
})
.then(articles => {
    insertArticles(articles);
});

const articleHolder = document.getElementById('articles');



function insertArticles(articles) {
    for (let i = 0; i < article.length; i++) {

    }
}