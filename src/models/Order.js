// Importando o Sequelize para criação do modelo
const Sequelize = require('sequelize');
const db = require('../config/database');
const Cart = require('../models/Cart');

// Definindo o modelo de Order
const Order = db.define('ordens', {
    // Definindo os campos do modelo
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
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
    cartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'userId'
        }
    }
});

Order.belongsTo(Cart, { foreignKey: 'id' });    // Ordens  depende de carrinhos de compra para ser criado.
Order.belongsTo(Cart, { foreignKey: 'userId' });

db.sync()
  .then(async () => {
    console.log('🤖 Tabela de Ordens Criada com Sucesso! ✔');

  })
  .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = Order;