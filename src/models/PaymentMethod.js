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
      key: 'id'
  }
  },
  cardNumber: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expirationDate: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

PaymentMethod.belongsTo(User, { foreignKey: 'userId' });

module.exports = PaymentMethod;
