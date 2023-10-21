const Sequelize = require('sequelize');
const db = require('../config/database');

const Role = db.define('roles', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Role.associate = function (models) {
  Role.belongsToMany(models.User, {
    through: 'users_roles',
    foreignKey: 'roleId',
    otherKey: 'userId',
  });
};

db.sync()
    .then(() => {
        console.log('🤖 Tabela de Regras Criada com Sucesso! ✔');
        // se remover os comentarios abaixo os usuarios do db aparecem no log do terminal.
        // const users = await User.findAll();
        //console.log('Users:', users);
    })
    .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = Role;