const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UsersController');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
    secret: 'qualquercoisa',
    cookie: {
        maxAge: 30000000 // milisegundos
    }
}));

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
app.use('/', usersController);

app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll()
            .then(categories => {
                res.render('index', { articles, categories });
            });
    });
});

app.get('/:slug', (req, res) => {
    const slug = req.params.slug;
    Article.findOne({ where: { slug } })
        .then(article => {
            if (article) {
                Category.findAll()
                    .then(categories => {
                        res.render('article', { article, categories });
                    });
            } else {
                res.redirect('/');
            }
        }).catch(erro => {
            res.redirect('/');
        });
});

app.get('/category/:slug', (req, res) => {
    const { slug } = req.params;
    Category.findOne({
        where: { slug },
        include: [{ model: Article }]
    }).then(category => {
        if (category) {
            Category.findAll()
                .then(categories => {
                    res.render('index', { articles: category.articles, categories })
                });
        } else {
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect('/');
    });
})

app.listen(8080, () => {
    console.log('Servidor iniciado com sucesso.');
})