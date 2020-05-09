const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/users', adminAuth, (req, res) => {
    User.findAll()
        .then(users => {
            res.render('admin/users/index', { users });
        });
});

router.get('/admin/users/create', adminAuth, (req, res) => {
    res.render('admin/users/create');
});

router.post('/user/create', adminAuth, (req, res) => {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
        .then(user => {
            if (user === undefined) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);

                User.create({ email, password: hash })
                    .then(() => {
                        res.redirect('/');
                    }).catch(erro => {
                        res.redirect('/');
                    });
            } else {
                res.redirect('/admin/users/create');
            }
        });
});

router.get('/login', (req, res) => {
    if (req.session.user != undefined) {
        res.redirect('/admin/articles');
    } else {
        res.render('admin/users/login');
    }
});

router.post('/authenticate', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
        .then(user => {
            if (user != undefined) {
                const correct = bcrypt.compareSync(password, user.password);
                if (correct) {
                    req.session.user = {
                        id: user.id,
                        email: user.email
                    };
                    res.redirect('/admin/articles');
                } else {
                    res.redirect('/login');
                }
            } else {
                res.redirect('/login');
            }
        });
});

router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;