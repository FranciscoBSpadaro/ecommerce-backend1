const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');
const PaymentMethod = require('./PaymentMethod');

const Transaction = db.define('Transaction', {
  transactionId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  paymentMethodId: { // visa , mastercard ,  etc
    type: Sequelize.STRING,
    allowNull: false,
  },
  paymentResponseId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  }
});

Transaction.belongsTo(User, { foreignKey: 'userId' });

Transaction.createForOrder = function(order, paymentMethodId, paymentResponseId) {
  return this.create({
    userId: order.userId,
    amount: order.total_value,
    description: `Pagamento do pedido ${order.orderId}`,
    paymentResponseId: paymentResponseId,
    paymentMethodId: paymentMethodId
  });
};

db.sync()
  .then(() => {
    console.log('🤖 Tabela de Transações Criada com sucesso! ✔');
  })
  .catch(error => {
    console.error('Erro ao criar tabela de Transações:', error);
  });

module.exports = Transaction;