const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Address = db.define('addresses', {
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
  street: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  zipCode: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

Address.belongsTo(User, { foreignKey: 'userId' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Endereços Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Endereços:', error);
    });

module.exports = Address;
