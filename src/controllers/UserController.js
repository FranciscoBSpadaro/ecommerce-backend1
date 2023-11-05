const User = require("../models/User");                                   // Importa o modelo do usuário
const passwordUtils = require('../utils/passwordUtils');                  // Importa funções úteis do bcrypt para lidar com senhas
const generateVerificationCode = require('../utils/VerificationCode');    // importa funções úteis para gerar codigos
const jwt = require('jsonwebtoken');                                      // Importa a biblioteca de geração de tokens JWT
const EmailController = require('../controllers/EmailController');        // Importa as funções de envio de email
const { Op } = require('sequelize');                                      // operadores no código da consulta em loginUser
const Admincheck = require ('../middlewares/Admincheck')




exports.createUser = async (req, res) => {                                       // Rota para criar um novo usuário
  try {
    const { username, email, password } = req.body;                                       // Obtém os dados do corpo da requisição
    const userAlreadyExists = await User.findOne({ where: { email } });         // Verifica se o usuário já existe no banco de dados

    if (userAlreadyExists) {
      res.status(400).json({ message: `⚠ O Cliente com e-mail ${email} já está cadastrado ⚠`}); // Retorna uma resposta com erro 400 se o usuário já existir
    }

    const hashedPassword = await passwordUtils.hashPassword(password);              //  Gera um hash da senha com a função hashPassword do bcrypt
    const verificationCode = generateVerificationCode(8);                           // gera o godigo de verificação 
    await EmailController.sendWelcome(email, verificationCode);                     // envia o email de bem vindo com o codigo para validar o email
    const user = await User.create({ username, email, password: hashedPassword, verificationCode });            // Cadastra o usuário no banco de dados com a senha criptografada
    console.log(user);
    res.status(201).json({ message: `🤖 O Cliente ${username} com E-mail. ${email}, foi Cadastrado com Sucesso! 🤖` });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "⚠ E-mail inválido ou já cadastrado ⚠" });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [  // login com email ou username
          { email },
          { username }
        ]
      }
    });

    if (!user) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    const passwordMatch = await passwordUtils.comparePasswords(password, user.password);

    if (passwordMatch) {                                                    // se a senha for correta faz o login
      console.log(`🔓 Login realizado com sucesso para o usuário ${username} ${email} 🔓`);
      const token = jwt.sign({                                              // gerar JWToken ao usuário
        username: user.username,
        isEmailValidated: user.isEmailValidated,                             // verifica se o usuario jav validou o email true or false pra notificar no front end
        isAdmin: user.isAdmin,                                               // adiciona no token o atributo isAdmin do usuario para verificar se é um adm quando as rotas forem executadas                                   
        isMod: user.isMod                                              
      },
        process.env.JWT_SECRET,                                             // senha do token definida no variável de ambiente
        {
          expiresIn: process.env.JWT_TIME                                   // tempo de expiraçao do token definido na variável de ambiente
        });

      res.status(200).json({ message: `🔑 Login realizado Aproveite a Loja 🛒`, token  });
      

    } else {
      res.status(400).json({ message: "⚠ Senha incorreta ⚠"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


exports.updateUserEmail = async (req, res) => {                             // Rota que o cliente usa para troca de email
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
    const { email } = req.body;

    const [updatedRows] = await User.update(
      { email }, { where: {username} }
      );
    if (updatedRows === 0) {                                                // se retorna indice 0 não localizou registros pelo id e retorna erro 404
      res.status(404).json({ message: 'Usuário não encontrado.'});
    }
    await EmailController.sendVerificationEmail(email, verificationCode);
    await User.update(
      { isEmailValidated: false }, { where: { email } }
      );

    console.log(`Cliente ${username} email atualizado para ${email} Enviado email para verificação`);
    res.status(200).json({ message: '🤖 E-mail Atualizado com Sucesso. 🤖' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: '⚠ E-mail inválido ou já cadastrado ⚠' });
  }
};

// Rota ADM
exports.deleteUser = async (req, res) => {
  try {
    const requestingUser = Admincheck // verifica se é admin

    if (!requestingUser) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir usuários.' });
    }

    const { username } = req.body;

    const userToDelete = await User.findOne({ where: { username } });

    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (userToDelete.isAdmin === true) {
      return res.status(403).json({ message: 'Não é possível excluir um usuário administrador.' });
    }

    const deletedRows = await User.destroy({ where: { username } });

    if (deletedRows === 0) {
      return res.status(400).json({ message: 'Nenhum usuário foi excluído' });
    }

    console.log(` "${username}" excluído.`);
    return res.status(200).json({ message: '👋 Usuário excluído com sucesso. 👋' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// ROTA ADM
exports.getUsername = async (req, res) => {
  try {
    const username = req.boby                                            // define objeto de username pela rota da requisição                      
    const user = await User.findOne({ where: username });                    // busca na tabela de Usuários o username fornecido                 
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


exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body; // Busca o e-mail no corpo da requisição
    const user = await User.findOne({ where: { email } }); // Busca o usuário com base no e-mail

    if (!user)
    res.status(404).json({ message: 'Usuário não encontrado.'});

    return res.json(user); // Retorna o nome de usuário encontrado
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};