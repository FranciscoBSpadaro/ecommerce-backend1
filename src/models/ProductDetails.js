const Sequelize = require('sequelize');
const db = require('../config/database');
const Product = require('../models/Product');

const ProductDetails = db.define('productDetails', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'productId'
        }
    },
    technicalDetails: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

ProductDetails.belongsTo(Product, { foreignKey: 'productId' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Detalhes do Produto criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de detalhes do produto:', error);
    });

module.exports = ProductDetails;