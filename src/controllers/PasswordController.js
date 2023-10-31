const User = require("../models/User");
const jwt = require('jsonwebtoken');
const passwordUtils = require('../utils/passwordUtils');  // importando o arquivo de configurações do bcrypt 

const PasswordController = {
  updateUserPassword: async (req, res) => {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
          return res.status(401).json({ message: 'Token de autorização não fornecido.' });
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
      const hashedPassword = await passwordUtils.hashPassword(password)
      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { username } }
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
  }
}

module.exports = PasswordController