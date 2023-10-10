const User = require("../models/User");

const passwordUtils = require('../utils/passwordUtils');  // importando o arquivo de configurações do bcrypt 

exports.updateUserPassword = async (req, res) => {
    try {
      // Adicionando os parametros que devem ser atualizados no put
      const { id } = req.params;
      const { password } = req.body;
      //Função para atualizar os dados  de email, pelo id
      const hashedPassword = await passwordUtils.hashPassword(password)
      const updatedUser = await User.update(
        { password: hashedPassword },
        { where: { id } }
      );
      // Se nenhum usuário foi atualizado, devido a  id invalido apresenta erro 404
      if (updatedUser[0] === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      // reposta de sucesso 200 ou 500 de erro interno
      res.status(200).json({ message: '🤖 Senha Alterada com Sucesso. 🤖' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  };