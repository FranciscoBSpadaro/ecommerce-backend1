const Sequelize = require('sequelize');
const db = require('../config/database');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const CartProduct = db.define('cart_products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Cart,
      key: 'id'
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Cart.belongsToMany(Product, { through: CartProduct });
Product.belongsToMany(Cart, { through: CartProduct });

db.sync()
  .then(() => {
    console.log('🤖 Tabela de Associação entre Carrinho e Produto criada com sucesso! ✔️');
  })
  .catch((error) => {
    console.error('Erro ao criar tabela de associação:', error);
  });

module.exports = CartProduct;