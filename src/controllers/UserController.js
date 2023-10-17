// Importar o modelo de usuário
const User = require("../models/User");                                                // importando o modelo User.js

const passwordUtils = require('../utils/passwordUtils');                               // importando o arquivo de configurações do bcrypt 



// Função para criar usuários
exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;                                           // variável para validar usarios pelo username cadastro no db                                     // variável para criar um novo usuário utilizando o bcrypt para criptografar as senhas no banco de dados
    let userAlreadyExists = await User.findOne({ where: { username } });               // variável que instancia o validationUtils.ja e verifica se o usuário já está cadastrado
    if (!userAlreadyExists) {                                                          // se username já é cadastrado retorna erro 400
      const hashedPassword = await passwordUtils.hashPassword(password);               // variável que instancia o bcrypt passwordUtils.js
      let user = new User({ ...req.body, password: hashedPassword });                  // convertendo senha digitada pelo usuário em senha criptografada
      let newUser = await user.save();                                                 // cadastra o usuário no db com a senha criptografada , uso o metodo save porque precisou consultar o banco de dados primeiro antes de pode salvar diferente do metodo .create que nao consulta. 
      console.log(newUser)
      res.status(201).json({ message: `🤖 O Usuário ${username}, foi Cadastrado com Sucesso! 🤖` }); // se remover a 'mensagem' e add newUser retorna todo o res.status
    }
    else res.status(400).json({ message: `⚠ O Usuário ${username} já está cadastrado ⚠` });
  }
  catch (error) {
    console.error(error);
    res.status(400).json({ message: "⚠ E-mail inválido ou já cadastrado ⚠" });         // se colocar error.message ou apenas error vai aparecer como erro de validação de email
  }
};
// Função para realizar o login de usuário
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(400).json({ message: "⚠ Usuário não encontrado ⚠" });
    } else {
      const passwordMatch = await passwordUtils.comparePasswords(password, user.password);       // compara a senha digitada com a senha criptografada no banco de dados com 'comparePasswords' do bcrypt
      if (passwordMatch) {
        res.status(200).json({ message: `🔓 Login realizado com sucesso para o usuário ${username} 🔓` });
      } else {
        res.status(401).json({ message: "⚠ Senha incorreta ⚠" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "⚠ Erro ao realizar o login ⚠" });
  }
};
// Função para atualizar um usuário pelo ID
exports.updateUserEmail = async (req, res) => {
  try {
    const { id } = req.params;                                                        // Adicionado o parâmetro da rota que devem ser atualizados no put ' id '
    const { email } = req.body;                                                       // Adicionado o atributo do corpo da requisição que será atualizado 'email'
    let updatedUser = await User.update(                                              // Função para atualizar os dados  de email, pelo id
      { email },
      { where: { id } }
    );
    if (updatedUser[0] === 0) {                                                       // Se nenhum usuário foi atualizado, devido a  id invalido apresenta erro 404
      return res.status(404).json({ message: 'Usuário não encontrado. 🔍' });
    }
    console.log(`E-mail do Usuário ID ${id} foi alterado para ${email}`)
    res.status(200).json({ message: '🤖 E-mail Alterado com Sucesso. 🤖' });
  }
  catch (error) {
    console.error(error);
    res.status(400).json({ message: '⚠ E-mail inválido ou já cadastrado ⚠' });
  }
};
// Função para excluir um usuário pelo ID
exports.deleteUser = async (req, res) => {
  try {
    const result = await User.destroy({ where: { id: req.params.id } });              // Buscar o usuário com o ID fornecido no banco de dados e removê-lo
    if (!result) {                                                                    // Se o usuário não existir, retornar uma mensagem de erro com o código de status 404 (Not Found)
      return res.status(404).json({ message: "Usuário não encontrado. 🔍" });
    }
    console.log(`Atenção o Usuário ID "${req.params.id}" foi excluido.`)
    res.status(200).json({ message: "👋 Usuário excluído com sucesso. 👋" });
  }
  catch (error) {
    res.status(401).json({ message: error.message });
  }
};
// Função para buscar todos usuários os pelo id
exports.getUsersbyID = async (req, res) => {
  try {
    const id = req.params.id;                                                       // obtém o ID da URL da requisição
    let users = await User.findByPk(id);                                            // busca o usuário pelo ID que é uma Primary Key no DB
    if (!users) {                                                                   // se o resultado for diferente de users então retorna erro 404
      return res.status(404).json({ message: "Usuário não encontrado. 🔍" });
    }
    return res.json(users);
  }
  catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
// Função para obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.findAll();                                             // Buscar todos os usuários no banco de dados
    res.status(200).json(users);                                                  // Retornar a lista de usuários em formato JSON
  }
  catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};