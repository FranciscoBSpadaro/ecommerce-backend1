const User = require('../models/User');
const { hashPassword } = require('../utils/passwordUtils');


const createDefaultAdmin = async () => { // Função para criar um admin padrão caso não exista nenhum admin no momento de iniciar o aplicativo
    try {
      const admin = await User.findOne({ where: { isAdmin: true } });        // Verificar se existe um usuário admin
      if (!admin) {                                                          // Se não existe um usuário admin, criar um novo
        const hashedPassword = await hashPassword(process.env.ADM_PASS);
        await User.create({
          username: process.env.ADM_NAME,
          email: process.env.ADM_EMAIL,
          password: hashedPassword ,
          isAdmin: true,
          isMod: false,
          isEmailValidated: true
        });
        console.log('Admin padrão criado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao criar admin padrão:', error);
    }
  };

    module.exports = createDefaultAdmin;