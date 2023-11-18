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
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
    },
    price: {
        type: Sequelize.FLOAT(15),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT(100),
        allowNull: true
    },
    quantity: {
        type: Sequelize.INTEGER(9),
        allowNull: false,
        defaultValue: 0
    },
    image_keys: {
        type: Sequelize.STRING,
        allowNull: true,
        get() {
          const value = this.getDataValue('image_keys');
          return value ? value.split(';') : [];
        },
        set(value) {
          // Certifique-se de que value é um array antes de chamar join
          this.setDataValue('image_keys', Array.isArray(value) ? value.join(';') : value);
        },
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