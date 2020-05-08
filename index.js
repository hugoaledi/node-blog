const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.authenticate()
    .then(() => {
        console.log("Conexão realizada com sucesso!")
    }).catch(error => {
        console.log(error);
    });

app.use('/', categoriesController);
app.use('/', articlesController);

app.get('/', (req, res) => {
    Article.findAll()
        .then(articles => {
            res.render('index', { articles });
        });
});

app.listen(8080, () => {
    console.log('Servidor iniciado com sucesso.');
})