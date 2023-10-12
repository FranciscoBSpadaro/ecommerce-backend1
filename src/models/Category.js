const Sequelize = require('sequelize');
const db = require('../config/database');

const Category = db.define('Category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    CategoryName: {
        type: Sequelize.STRING(25),
        allowNull: false,
        primaryKey: true,
        unique: true,
        validate: {
            len: [1, 25]
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },

});

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Categorias Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Categorias:', error);
    });

module.exports = Category;