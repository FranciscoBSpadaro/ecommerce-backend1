const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');


const Profile = db.define('profiles', {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'users', // 'users' refers to table name
          key: 'id', // 'id' refers to column name in users table
        }
      },
    nome: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
            len: [1, 20]
        }
    },
    nomeMeio: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
            len: [0, 20]
        }
    },
    ultimoNome: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
            len: [0, 20]
        }
    },
    telefone: {
        type: Sequelize.BIGINT,
        allowNull: true
    },
    celular: {
        type: Sequelize.BIGINT,
        allowNull: true
    }
    
});

Profile.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Profiles Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Profiles:', error);
    });

module.exports = Profile;