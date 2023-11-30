const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_TIME } = process.env;
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const generateVerificationCode = require('../utils/verificationCode');
const { sendWelcomeEmail, sendVerificationEmail } = require('../controllers/EmailController');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Função para criar um novo usuário
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Verificar se já existe um usuário com o mesmo nome de usuário
    const usernameAlreadyExists = await User.findOne({ where: { username } });
    if (usernameAlreadyExists) {
      return res.status(400).json({
        message: `Já existe um cadastro com ${username}. Por favor, escolha outro nome de usuário.`,
      });
    }

    // Verificar se o usuário com o email fornecido já existe
    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists) {
      return res.status(400).json({
        message: `Já existe um cadastro com ${email}. Por favor, escolha outro e-mail.`,
      });
    }

    // Criar um hash da senha do usuário para segurança
    const hashedPassword = await hashPassword(password);

    // Gerar código de verificação e enviar email de verificação
    const verificationCode = generateVerificationCode(8);
    await sendWelcomeEmail(email, verificationCode);

    // Criar novo usuário no banco de dados
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await UserDetails.create({
      userId: user.id,
      verificationCode,
    });

    console.log(user); // remover quando em produçao
    return res.status(201).json({
      message: `🤖 Cadastro Realizado com Sucesso! Verifique seu e-mail 🤖`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Função para realizar login do usuário
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    // Buscar usuário por email ou nome de usuário
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Buscar detalhes do usuário no banco de dados
    const userDetails = await UserDetails.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!userDetails) {
      return res
        .status(404)
        .json({ message: 'Detalhes do usuário não encontrados.' });
    }

    // Comparar a senha com a senha criptografada no banco de dados
    const passwordMatch = await comparePasswords(password, user.password);

    if (passwordMatch) {
      console.log(`🔓 Usuário ${username} ${email} logado com sucesso 🔓`);

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id, // Use o ID do usuário em vez do nome de usuário
          username: user.username,
          isEmailValidated: userDetails.isEmailValidated,
          isAdmin: userDetails.isAdmin,
          isMod: userDetails.isMod,
        },
        JWT_SECRET,
        {
          expiresIn: JWT_TIME,
        },
      );

      return res
        .status(200)
        .json({ message: `🔑 Login bem sucedido! Boas compras 🛒`, token });
    } else {
      res.status(400).json({ message: '⚠ Senha incorreta ⚠' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Função para obter o nome de usuário para exibir no front-end
const getUsername = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.decodedToken;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado 🔍' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};

// Função para atualizar o email do usuário
const updateUserEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.decodedToken; // Use o ID do usuário do token decodificado
    const { email } = req.body;

    // Buscar usuário por ID
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Atualizar o email do usuário
    await User.update({ email }, { where: { id } });

    const verificationCode = generateVerificationCode(8);
    await sendVerificationEmail(email, verificationCode);

    // Atualizar o campo isEmailValidated no modelo UserDetails
    await UserDetails.update(
      { isEmailValidated: false },
      { where: { userId: id } },
    ); // Use o ID do usuário para atualização

    console.log(
      `Usuário ${user.username} email atualizado para ${email}. Email de verificação enviado.`,
    );
    return res
      .status(200)
      .json({ message: '🤖 Email atualizado com sucesso. 🤖' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Função para deletar um usuário (somente administradores podem executar esta ação)
const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;

    const userToDelete = await User.findOne({ where: { username } });

    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Buscar detalhes do usuário no banco de dados
    const userDetails = await UserDetails.findOne({
      where: {
        userId: userToDelete.id,
      },
    });

    if (!userDetails) {
      return res
        .status(404)
        .json({ message: 'Detalhes do usuário não encontrados.' });
    }

    if (userDetails.isAdmin === true) {
      return res
        .status(403)
        .json({ message: 'Você não pode Excluir um Usuário Administrador.' });
    }

    const deletedRows = await User.destroy({ where: { username } });

    if (deletedRows === 0) {
      return res.status(400).json({ message: 'Nenhum usuário foi deletado.' });
    }

    console.log(`Usuário "${username}" deletado.`);
    return res
      .status(200)
      .json({ message: '👋 Usuário deletado com sucesso. 👋' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Não é Possivel excluir um usuário com perfil Associado a ele' });
  }
};

// Função para obter todos os usuários (somente administradores podem executar esta ação)
const getAllUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};

// Função para obter usuário pelo email (somente administradores podem executar esta ação)
const getUserByEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsername,
  updateUserEmail,
  deleteUser,
  getAllUsers,
  getUserByEmail,
};
