const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passwordUtils = require('../utils/passwordUtils'); // importando o arquivo de configurações do bcrypt

const PasswordController = {
  updateUserPassword: async (req, res) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res
          .status(401)
          .json({ message: 'Token de autorização não fornecido.' });
      }

      const token = authorizationHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token JWT não encontrado.' });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      if (!decodedToken) {
        return res.status(401).json({ message: 'Token JWT inválido.' });
      }

      const { username } = decodedToken;
      const { password } = req.body;
      //Função para atualizar os dados  de email, pelo id
      const hashedPassword = await passwordUtils.hashPassword(password);
      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { username } },
      );
      // Se nenhum usuário foi atualizado, devido a  id invalido apresenta erro 404
      if (updatedUser[0] === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.🔍' });
      }
      // reposta de sucesso 200 ou 500 de erro interno
      res.status(200).json({ message: '🤖 Senha Alterada com Sucesso. 🤖' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor 😱🤯' });
    }
  },

  changeUserPassword: async (req, res) => {
    // Função para alterar a senha do usuário deslogado
    try {
      // criar função para verificar se o email é um email isValidated
      const { email, verificationCode, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user.verificationCode !== verificationCode) {
        return res
          .status(400)
          .json({ message: 'Código de verificação inválido.' });
      }
      const hashedPassword = await passwordUtils.hashPassword(password);
      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { email } },
      );
      if (updatedUser[0] === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.🔍' });
      }
      res.status(200).json({ message: '🤖 Senha Alterada com Sucesso. 🤖' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor 😱🤯' });
    }
  },

  checkCode: async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const user = await User.findOne({ where: { email } });
      if (user.verificationCode !== verificationCode) {
        return res
          .status(400)
          .json({ message: 'Código de verificação inválido.' });
      }
      res.status(200).json({ message: 'Código de verificação Validado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor 😱🤯' });
    }
  },

  verifyCurrentPassword: async (req, res) => {
    try {
      const { username } = req.decodedToken;
      const { password } = req.body;
      const user = await User.findOne({ where: { username } });
      const isPasswordValid = await passwordUtils.comparePasswords(
        password,
        user.password,
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha atual inválida.' });
      }
      res.status(200).json({ message: 'Senha atual válida.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor 😱🤯' });
    }
  },
};

module.exports = PasswordController;
