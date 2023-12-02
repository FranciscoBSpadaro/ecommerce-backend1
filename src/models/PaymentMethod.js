const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const PaymentMethod = db.define('payment_methods', {
  id: {
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
  cardNumberEncrypted: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cardLastFourDigits: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cardHolderName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cardExpirationDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  type: { // account_money: Money in the Mercado Pago account. bank_transfer: Pix and PSE (Pagos Seguros en Línea). digital_currency: Purchases with Mercado Crédito.
    type: Sequelize.ENUM('debit_card', 'credit_card', 'account_money', 'bank_transfer', 'crypto_transfer', 'digital_currency'),
    allowNull: false,
  },
});

PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

db.sync()
  .then(() => {
    console.log('🤖 Tabela de Pagamentos Criada com sucesso! ✔');
  })
  .catch(error => {
    console.error('Erro ao criar tabela de Pagamentos:', error);
  });

module.exports = PaymentMethod;
