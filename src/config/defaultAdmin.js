const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const { hashPassword } = require('../utils/passwordUtils');

const createDefaultAdmin = async () => {
  try {
    const admin = await User.findOne({
      include: [
        {
          model: UserDetails,
          where: { isAdmin: true },
        },
      ],
    });
    if (!admin) {
      const hashedPassword = await hashPassword(process.env.ADM_PASS);
      const user = await User.create({
        username: process.env.ADM_NAME,
        email: process.env.ADM_EMAIL,
        password: hashedPassword,
      });

      await UserDetails.create({
        userId: user.id,
        isAdmin: true,
        isMod: false,
        isEmailValidated: true,
      });

      console.log('Admin padrão criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar admin padrão:', error);
  }
};

module.exports = createDefaultAdmin;
