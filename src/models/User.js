const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
// Sincroniza o modelo com o banco de dados e cria a tabela de Usuários automaticamente
db.sync()
  .then(async () => {
    console.log('🤖 Tabela de Usuários Criada com Sucesso! ✔');
    // se remover os comentarios abaixo os usuarios do db aparecem no log do terminal.
    // const users = await User.findAll();
    //console.log('Users:', users);
  })
  .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = User;