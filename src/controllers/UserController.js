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

const handle400Error = (res, message) => {
  return res.status(400).json({ message });
};

const handle401Error = (res, message) => {
  return res.status(401).json({ message });
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

exports.loginUser = async (req, res) => {                                    // Rota para fazer login de um usuário
  try {
    const { username, password } = req.body;                                 // Obtém os dados do corpo da requisição
    const user = await User.findOne({ where: { username } });                // Verifica se o usuário existe no banco de dados

    if (!user) {                                                             // se resultado for diferente de um usuário retorna erro , 404
      return handle404Error(res, "Usuário não encontrado.");
    }

    const passwordMatch = await passwordUtils.comparePasswords(password, user.password); // Verifica se a senha fornecida pelo usuário corresponde à senha armazenada e usa a função do bcrypt comparePassword e compara a senha criptografa

    if (passwordMatch) {                                                      // se a senha for correta faz o login do usuário
      console.log(`🔓 Login realizado com sucesso para o usuário ${username} 🔓`);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {  //  Gera um token JWT válido por um período de tempo definido nas variáveis de ambiente
        expiresIn: process.env.JWT_TIME
      });
      console.log(token);                                                     // printa o JWtoken no console.log apenas para usar esses tokens nos testes de api no insomnia , em produção esse console.log deve ser removido.
      res.status(200).json({ message: `Login realizado com sucesso. 🔑🔓` });
    } else {
      handle401Error(res, "⚠ Senha incorreta ⚠");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserEmail = async (req, res) => {                             // Rota para atualizar e-mail do usuário
  try {
    const { id } = req.params;                                              // busca o id do usuario pela rota da requisição
    const { email } = req.body;                                             // apenas o email é enviado no corpo da requisição

    const [updatedRows] = await User.update({ email }, { where: { id } });  // Busca na tabela de usuários o atributo email pelo id
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

exports.deleteUser = async (req, res) => {                                  // Rota para deletar um usuário
  try {
    const { id } = req.params;                                             // id deve ser fornecido pela rota da requisição

    const deletedRows = await User.destroy({ where: { id } });            // deleta o usuário pelo id
    if (deletedRows === 0) {                                              // se não encontra nenhum id retorna 404
      return handle404Error(res, 'Usuário não encontrado.');
    }

    console.log(`User ID "${id}" excluído.`);
    res.status(200).json({ message: "👋 Usuário excluído com sucesso. 👋" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });                // erro 401 apenas um usuário autenticado pode fazer isso. se for adm
  }
};

exports.getUserByID = async (req, res) => {                           // Rota para localizar um usuário pelo id
  try {
    const { id } = req.params;                                       // id deve ser fornecido pela rota da requisição

    const user = await User.findOne({ where: { id } });             // busca na tabela de usuários o id fornecido
    if (!user) {                                                    // se nao retornar um usuário retorna erro 404
      return handle404Error(res, 'Usuário não encontrado.');
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {                    // busca todos os usuários cadastrados.
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message });        // 401 somente adms
  }
};
