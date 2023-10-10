// Importar o modelo de usuário
const User = require("../models/User");

const passwordUtils = require('../utils/passwordUtils');


     // Função para criar um novo usuário utilizando o bcrypt para criptografar as senhas no banco de dados
exports.createUser = async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await passwordUtils.hashPassword(password);

     // Criar uma nova instância do modelo de usuário com os dados fornecidos
  const user = new User({ ...req.body, password: hashedPassword });

  try {
    // Salvar o novo usuário no banco de dados
    const newUser = await user.save();
    // Retornar o novo usuário em formato JSON com o código de status 201 (Created)
    res.status(201).json({ message: 'Usuário Cadastrado com Sucesso' });
  } catch (error) {
    // Se ocorrer algum erro, retornar uma mensagem de erro com o código de status 400 (Bad Request)
    res.status(400).json({ message: error.message });
  }
};
    // Função para atualizar um usuário pelo ID
exports.updateUser = async (req, res) => {
  try {
    // Adicionando os parametros que devem ser atualizados no put
    const { id } = req.params;
    const { username, email } = req.body;
    //Função para atualizar os dados  username, email, pelo id
    const updatedUser = await User.update(
      { username, email },
      { where: { id } }
    );
    // Se nenhum usuário foi atualizado, devido a  id invalido apresenta erro 404
    if (updatedUser[0] === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    // reposta de sucesso 200 ou 500 de erro interno
    res.status(200).json({ message: 'Usuário Atualizado com Sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Falha ao Atualizar Usuário.' });
  }
};
    // Função para excluir um usuário pelo ID
exports.deleteUser = async (req, res) => {
  try {
    // Buscar o usuário com o ID fornecido no banco de dados e removê-lo
    const result = await User.destroy({ where: { id: req.params.id } });
    // Se o usuário não existir, retornar uma mensagem de erro com o código de status 404 (Not Found)
    if (!result) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    // Retornar uma mensagem de sucesso com o código de status 204 (No Content)
    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    // Se ocorrer algum erro, retornar uma mensagem de erro com o código de status 500 (Internal Server Error)
    res.status(500).json({ message: error.message });
  }
};
    // Função para buscar todos os pelo id
exports.getUsersbyID = async (req, res) => {
  try {
    const id = req.params.id; // obtém o ID da URL da requisição
    const users = await User.findByPk(id); // busca o usuário pelo ID
    if (!users) {  // se o resultado for diferente de users então retorna erro 404
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar usuário" });
  }
};
    // Função para obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    // Buscar todos os usuários no banco de dados
    const users = await User.findAll();
    // Retornar a lista de usuários em formato JSON
    res.status(200).json(users);
  } catch (error) {
    // Se ocorrer algum erro, retornar uma mensagem de erro com o código de status 500 (Internal Server Error)
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter os usuários' });
  }
};
