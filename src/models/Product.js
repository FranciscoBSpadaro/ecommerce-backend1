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
        type: Sequelize.DECIMAL(10, 2), // 10 dígitos no total, 2 depois da vírgula
        allowNull: false
    },
    discountPrice: {
        type: Sequelize.DECIMAL(10, 2), // preço de oferta
        allowNull: true
    },
    description: {
        type: Sequelize.STRING(55), 
        allowNull: true
    },
    isOffer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // produdos que irão aparecer na página inicial no primeiro carrossel
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