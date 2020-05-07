const Sequelize = require('sequelize');
const connection = new Sequelize('nodeblog', 'hugoaledi', '**Russim007**', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;