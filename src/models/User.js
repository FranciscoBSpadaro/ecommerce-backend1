const Sequelize = require('sequelize');
const UserDetails = require('./UserDetails');
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
      len: [5, 20] // validar que o campo tem entre 1 e 25 caracteres
    }
  },
  email: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [5, 50]
    }
  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      len: [8, 60] // hashedpassword usa 60 caracteres
    }
  }

});

User.hasOne(UserDetails, { foreignKey: 'userId', sourceKey: 'id' });
UserDetails.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Usuários Criada com sucesso! ✔');
        const createDefaultAdmin = require('../config/defaultAdmin')
        createDefaultAdmin();
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Usuários:', error);
    });

module.exports = User;