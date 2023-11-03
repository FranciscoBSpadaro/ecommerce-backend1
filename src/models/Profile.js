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
        type: Sequelize.STRING(30),
        allowNull: true,
        validate: {
            len: [1, 30]
        }
    },
    nomeMeio: {
        type: Sequelize.STRING(30),
        allowNull: true,
        validate: {
            len: [1, 30]
        }
    },
    ultimoNome: {
        type: Sequelize.STRING(30),
        allowNull: true,
        validate: {
            len: [1, 30]
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


module.exports = Profile;