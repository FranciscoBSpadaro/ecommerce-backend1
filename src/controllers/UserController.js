const User = require("../models/User");                                   // Importa o modelo do usuário
const passwordUtils = require('../utils/passwordUtils');                  // Importa funções úteis do bcrypt para lidar com senhas
const jwt = require('jsonwebtoken');                                      // Importa a biblioteca de geração de tokens JWT
const { validationResult } = require('express-validator');                // Importa a função de validação de entrada

const handleValidationErrors = (req, res, next) => {                      // Middleware para lidar com erros de validação
  const errors = validationResult(req);                                   // Obtém os erros de validação da requisição
  if (!errors.isEmpty()) {                                                // se nao estiver vazio e houver erros execute o codigo abaixo com array de erros.
    return res.status(400).json({ errors: errors.array() });              // Retorna uma resposta com erro 400 se houver erros de validação
  }
  next();
};

const handle404Error = (res, message) => {                                // Função utilitária para lidar com erros 404 para o array
  return res.status(404).json({ message: `${message} 🔍` });              // Retorna uma resposta com erro 404 e uma mensagem personalizada
};
const handle403Error = (res, message) => {
  return res.status(403).json({ message });
};
const handle401Error = (res, message) => {
  return res.status(401).json({ message });
};

const handle400Error = (res, message) => {
  return res.status(400).json({ message });
};


exports.createUser = async (req, res) => {                                 // Rota para criar um novo usuário
  try {
    const { username, password, email } = req.body;                        // Obtém os dados do corpo da requisição
    const userAlreadyExists = await User.findOne({ where: { username } }); // Verifica se o usuário já existe no banco de dados

    if (userAlreadyExists) {
      return handle400Error(res, `⚠ O Usuário ${username} já está cadastrado ⚠`); // Retorna uma resposta com erro 400 se o usuário já existir
    }

    const hashedPassword = await passwordUtils.hashPassword(password);     //  Gera um hash da senha com a função hashPassword do bcrypt
    const user = await User.create({ username, email, password: hashedPassword }); // Cadastra o usuário no banco de dados com a senha criptografada

    console.log(user);
    res.status(201).json({ message: `🤖 O Usuário ${username}, foi Cadastrado com Sucesso! 🤖` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "⚠ E-mail inválido ou já cadastrado ⚠" });
  }
};

exports.loginUser = async (req, res) => {                                   // adicionar chaves para o início e fim do bloco try-catch
  try {
    const { username, password } = req.body;                                // corrigir a forma como os dados são obtidos do corpo da requisição
    const user = await User.findOne({ where: { username } });               // corrigir a forma como o objeto de busca é passado ao método findOne

    if (!user)                                                              // adicionar chaves para o bloco condicional
      return handle404Error(res, "Usuário não encontrado.");

    const passwordMatch = await passwordUtils.comparePasswords(password, user.password);

    if (passwordMatch) {                                                    // se a senha for correta faz o login
      console.log(`🔓 Login realizado com sucesso para o usuário ${username} 🔓`);
      const token = jwt.sign({                                              // gerar JWToken ao usuário
        username: user.username,
        isAdmin: user.isAdmin,                                               // adiciona no token o atributo isAdmin do usuario para verificar se é um adm quando as rotas forem executadas                                   
        isMod: user.isMod                                              
      },
        process.env.JWT_SECRET,                                             // senha do token definida no variável de ambiente
        {
          expiresIn: process.env.JWT_TIME                                   // tempo de expiraçao do token definido na variável de ambiente
        });
      console.log(token);
      res.status(200).json({ message: `Login realizado com sucesso. 🔑🔓` });
    } else {
      handle401Error(res, "⚠ Senha incorreta ⚠");
    }
  } catch (error) {                                                         // adicionar chaves para o bloco catch
    console.error(error);
    res.status(500).json({ message: error.message });                       // corrigir a forma como o objeto de resposta é estruturado
  }
};

exports.updateUserEmail = async (req, res) => {                             // Rota para atualizar e-mail do usuário
  try {
    const id = req.params;                                                  // busca o id do usuario pela rota da requisição
    const { email } = req.body;                                             // apenas o email é enviado no corpo da requisição

    const [updatedRows] = await User.update({ email }, { where: id });      // Busca na tabela de usuários o atributo email pelo id
    if (updatedRows === 0) {                                                // se retorna indice 0 não localizou registros pelo id e retorna erro 404
      return handle404Error(res, 'Usuário não encontrado.');
    }

    console.log(`User ID ${id} email atualizado para ${email}`);
    res.status(200).json({ message: '🤖 E-mail Atualizado com Sucesso. 🤖' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '⚠ E-mail inválido ou já cadastrado ⚠' });
  }
};
// Rota ADM
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const userToDelete = await User.findByPk(id);
    if (!userToDelete) {                                                 // Verifica se o usuário existe
      return handle404Error(res, 'Usuário não encontrado.');
    }

    if (userToDelete.isAdmin == 1) {                                    // verifica se o usuário é um admin
      return handle403Error(res, "Não é possível excluir um usuário administrador.");
    }

    const deletedRows = await User.destroy({ where: { id } });
    if (deletedRows === 0) {                                           // se retornar indice 0 significa que não excluiu nenhum usuário , esse if é apenas uma camada adicional de validação
      return handle404Error(res, 'Nenhum usuário foi excluido');
    }
    console.log(`User ID "${id}" excluído.`);                         // confirma exclusão
    res.status(200).json({ message: "👋 Usuário excluído com sucesso. 👋" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};

// ROTA ADM
exports.getUserByID = async (req, res) => {
  try {
    const id = req.params;                                             // define objeto de id pela rota da requisição                      
    const user = await User.findOne({ where: id });                    // busca na tabela de Usuários o id fornecido                 
    if (!user)                                                         // se não houver usuários com o id fornecido retorna erro 404         
      return handle404Error(res, 'Usuário não encontrado.');

    return res.json(user);                                              // retorna dados do usuário
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};
// ROTA ADM
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();                                  // busca todos os usuários no banco de dados
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });
  }
};
