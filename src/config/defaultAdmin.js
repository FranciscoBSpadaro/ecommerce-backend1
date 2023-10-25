const User = require('../models/User');
const db = require('./database');
const passwordUtils = require('../utils/passwordUtils');

// Função para criar um admin padrão caso não exista nenhum admin no momento de iniciar o aplicativo
const createDefaultAdmin = async () => {
    try {
      const admin = await User.findOne({ where: { isAdmin: true } });     // Verificar se existe um usuário admin
      if (!admin) {      // Se não existe um usuário admin, criar um novo
        const hashedPassword = await passwordUtils.hashPassword(process.env.ADM_PASS);
        await User.create({
          username: process.env.ADM_NAME,
          email: process.env.ADM_EMAIL,
          password: hashedPassword ,
          isAdmin: true,
          isMod: false,
        });
        console.log('Admin padrão criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar admin padrão:', error);
    }
  };
  // Inicie o banco de dados (sincronização dos modelos) e crie o admin padrão
  db.sync()
    .then(() => {
      console.log('Banco de dados sincronizado com sucesso!');
      // Chame a função para criar o admin padrão
      createDefaultAdmin();
    })
    .catch((error) => console.error('Erro ao sincronizar o banco de dados:', error));

    module.exports = createDefaultAdmin;