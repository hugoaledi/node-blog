const Sequelize = require('sequelize');
const connection = new Sequelize('nodeblog', 'hugoaledi', '**Russim007**', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;