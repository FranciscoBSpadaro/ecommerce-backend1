const Sequelize = require('sequelize');
const db = require('../config/database');

const UserRole = db.define('users_roles', {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
  });
UserRole.associate = function (models) {
    // associations can be defined here
    UserRole.belongsTo(models.Role);
    UserRole.belongsTo(models.User);
};
// Sincroniza o modelo com o banco de dados e cria a tabela de Usuários automaticamente
db.sync()
    .then(() => {
        console.log('🤖 Tabela de Regras de Usuários Criada com Sucesso! ✔');
        // se remover os comentarios abaixo os usuarios do db aparecem no log do terminal.
        // const users = await User.findAll();
        //console.log('Users:', users);
    })
    .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = UserRole;