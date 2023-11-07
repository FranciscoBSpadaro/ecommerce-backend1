const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(20), // limite de 25 caracteres
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 20] // validar que o campo tem entre 1 e 25 caracteres
    }
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [1, 50]
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      len: [1, 60] // hashedpassword usa 60 caracteres
    }
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // valor padrão é false (cliente)
  },
  isMod: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // valor padrão é false (cliente)
  },
  isEmailValidated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // valor padrão é false
  },
  verificationCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  

});


module.exports = User;