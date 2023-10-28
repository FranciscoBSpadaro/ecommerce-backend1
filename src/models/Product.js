const Sequelize = require('sequelize');
const db = require('../config/database');
const Category = require('../models/Category');

const Product = db.define('products', {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    productName: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'id'
        }
    }

});

Product.belongsTo(Category, { foreignKey: 'categoryId' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Produtos Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de produtos:', error);
    });

module.exports = Product;