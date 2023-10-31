const Sequelize = require('sequelize');
const db = require('../config/database');
const Profile = require('./Profile');

const User = db.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: Sequelize.STRING(25), // limite de 25 caracteres
    allowNull: false,
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
  },
  isEmailValidated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false, // valor padrão é false
  },
  verificationCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  
  profileId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
        model: Profile,
        key: 'id'
    }
}

});

User.belongsTo(Profile, { foreignKey: 'profileId' });


// Método para associar um perfil automaticamente ao criar um usuário
User.addHook('beforeValidate', async (user, options) => {    // beforeValidate em vez de beforeCreate. Dessa forma, o profileId será definido antes da validação ocorrer. e nao dar erro de  'users.profileId cannot be null'
  try {
    // Cria um perfil associado ao usuário
    const profile = await Profile.create();
    user.profileId = profile.id;
  } catch (error) {
    throw new Error('Erro ao criar o perfil e associá-lo ao usuário: ' + error.message);
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