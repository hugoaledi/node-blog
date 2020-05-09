const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    Article.findAll({ include: [{ model: Category }] })
        .then(articles => {
            res.render('admin/articles/index', { articles });
        });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll()
        .then(categories => {
            res.render('admin/articles/new', { categories });
        });
});

router.post('/admin/article/save', (req, res) => {
    const { title, body, category } = req.body;
    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete', (req, res) => {
    const { id } = req.body;
    if (id !== undefined && !isNaN(id)) {
        Article.destroy({ where: { id } })
            .then(() => {
                res.redirect('/admin/articles');
            });
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    const { id } = req.params;
    Article.findByPk(id)
        .then(article => {
            if (article) {
                Category.findAll()
                    .then(categories => {
                        res.render('admin/articles/edit', { article, categories });
                    });
            } else {
                res.redirect('/');
            }
        }).catch(erro => {
            res.redirect('/');
        })
});

router.post('/articles/update', (req, res) => {
    const { id, title, body, category } = req.body;
    Article.update({
        title,
        body,
        categoryId: category,
        slug: slugify(title)
    }, {
        where: { id }
    }).then(() => {
        res.redirect('/admin/articles');
    }).catch(erro => {
        res.redirect('/');
    })
});

module.exports = router;