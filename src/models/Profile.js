const Sequelize = require('sequelize');
const db = require('../config/database');
const User = require('./User');


const Profile = db.define('profiles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    },
    username: {
        type: Sequelize.STRING(25),
        allowNull: false,
        references: {
            model: User,
            key: 'username'
        }
    }
    
});

Profile.belongsTo(User, { foreignKey: 'username' });

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Profiles Criada com sucesso! ✔');
    })
    .catch((error) => {
        console.error('Erro ao criar tabela de Profiles:', error);
    });

module.exports = Profile;