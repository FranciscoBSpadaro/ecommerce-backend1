const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');

const Cart = db.define('carts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true, // Adiciona a restrição unique ao campo userId , com isso cada user pode ter apenas 1 carrinho.
    references: {
      model: User,
      key: 'id'
    }
  }
});

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

db.sync()
  .then(() => {
    console.log('🤖 Tabela de Carrinho Criada com sucesso! ✔');
  })
  .catch((error) => {
    console.error('Erro ao criar tabela de Carrinho:', error);
  });

module.exports = Cart;