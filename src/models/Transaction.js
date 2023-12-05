const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

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
  issuerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  transactionAmount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  payer: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  paymentMethodId: { // visa , mastercard ,  etc
    type: Sequelize.STRING,
    allowNull: false,
  },
  installments: { // parcelas
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  paymentResponseId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

Transaction.belongsTo(User, { foreignKey: 'userId' });

Transaction.createForOrder = function(order, transaction_amount, payment_method_id, paymentResponseId, installments, payer, issuer_id ) {
  return this.create({
    userId: order.userId,
    transactionAmount: transaction_amount,
    description: `Pagamento do pedido ${order.orderId}`,
    installments : installments,
    paymentMethodId: payment_method_id,
    issuerId : issuer_id,
    payer : payer,
    paymentResponseId: paymentResponseId,
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