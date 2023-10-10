require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});