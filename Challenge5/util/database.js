// this to connect our app in mySQL
const Sequelize = require('sequelize');
const sequelize = new Sequelize('monitor','root','',
//dialact mean type of database
{dialect:'mysql',
host:'Localhost'
});
module.exports =sequelize
