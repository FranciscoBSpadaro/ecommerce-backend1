const Sequelize = require('sequelize');
const db = require('../config/database');
const Cart = require('../models/Cart');

const Order = db.define('orders', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
            key: 'id',
        },
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'userId',
        },
    },
});

Order.belongsTo(Cart, { foreignKey: 'cartId' });
Order.belongsTo(Cart, { foreignKey: 'userId' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Ordens Criada com Sucesso! ✔');
    })
    .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = Order;