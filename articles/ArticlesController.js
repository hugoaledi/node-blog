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

module.exports = router;