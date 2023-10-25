const Sequelize = require('sequelize');
const db = require('../config/database');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(25), // limite de 25 caracteres
    allowNull: false,
    primaryKey: true,
    unique: true,
    validate: {
      len: [1, 25] // validar que o campo tem entre 1 e 25 caracteres
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
  }
});
// Sincroniza o modelo com o banco de dados e cria a tabela de Usuários automaticamente
db.sync()
  .then(() => {
    console.log('🤖 Tabela de Usuários Criada com Sucesso! ✔');
    // se remover os comentarios abaixo os usuarios do db aparecem no log do terminal.
    // const users = await User.findAll();
    //console.log('Users:', users);
  })
  .catch((err) => console.log('Erro ao Sincronizar Banco de Dados! 😥:', err));

module.exports = User;