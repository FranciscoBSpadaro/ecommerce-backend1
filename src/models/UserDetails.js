const Sequelize = require('sequelize');
const db = require('../config/database');

const UserDetails = db.define('userDetails', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'users', // 'users' refers to table name
      key: 'id', // 'id' refers to column name in users table
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isMod: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isEmailValidated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  verificationCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  isCodeValid: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

db.sync()
  .then(() => {
    console.log('Tabela UserDetails criada com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao criar tabela UserDetails:', error);
  });

module.exports = UserDetails;