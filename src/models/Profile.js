const Sequelize = require('sequelize');
const db = require('../config/database');


const Profile = db.define('profiles', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(45),
        allowNull: true,
        validate: {
            len: [1, 45]
        }
    },
    nomeMeio: {
        type: Sequelize.STRING(45),
        allowNull: true,
        validate: {
            len: [1, 45]
        }
    },
    ultimoNome: {
        type: Sequelize.STRING(45),
        allowNull: true,
        validate: {
            len: [1, 45]
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

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Profiles Criada com Sucesso! ✔');
    })
    .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = Profile;