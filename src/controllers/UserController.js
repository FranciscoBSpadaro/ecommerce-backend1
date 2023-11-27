const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_TIME } = process.env;
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const generateVerificationCode = require('../utils/verificationCode');
const { sendWelcomeEmail } = require('../controllers/EmailController');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

module.exports = {
  createUser: async (req, res) => {
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
          message: `Já existe um cadastro com ${email} Por favor, escolha outro e-mail.`,
        });
      }

      // Hashing password for security
      const hashedPassword = await hashPassword(password);
      // Generating verification code and sending a verification email
      const verificationCode = generateVerificationCode(8);
      await sendWelcomeEmail(email, verificationCode);
      // Creating user in the database
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
  },

  // Route for user login
  loginUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, username, password } = req.body;

// Find user by email or username
const user = await User.findOne({
  where: {
    [Op.or]: [{ email }, { username }],
  },
});

if (!user) {
  return res.status(404).json({ message: 'User not found.' });
}

// Find user details
const userDetails = await UserDetails.findOne({
  where: {
    userId: user.id,
  },
});

if (!userDetails) {
  return res.status(404).json({ message: 'User details not found.' });
}

// Compare password with hashed password stored in the database
const passwordMatch = await comparePasswords(password, user.password);

if (passwordMatch) {
  console.log(`🔓 User ${username} ${email} logged in successfully 🔓`);

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id, // Use user id instead of username
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
    .json({ message: `🔑 Login successful! Happy shopping 🛒`, token });
} else {
  res.status(400).json({ message: '⚠ Incorrect password ⚠' });
}
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // front-end display username
  getUsername: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.decodedToken;
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: 'User not found 🔍' });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: error.message });
    }
  },

  // Route for user updating email
  updateUserEmail: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.decodedToken; // Use user id from decoded token
      const { email } = req.body;

      // Buscar o usuário pelo id
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Atualizar o email do usuário
      await User.update(
        { email },
        { where: { id } }, // Use user id for update
      );

      const verificationCode = generateVerificationCode(8);
      await sendVerificationEmail(email, verificationCode);

      // Atualizar o campo isEmailValidated no modelo UserDetails
      await UserDetails.update(
        { isEmailValidated: false },
        { where: { userId: id } },
      ); // Use user id for update

      console.log(
        `User ${user.username} email updated to ${email}. Verification email sent.`,
      );
      return res
        .status(200)
        .json({ message: '🤖 Email updated successfully. 🤖' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
  // Route for deleting user (only admins can perform this action)
  deleteUser: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username } = req.body;

      const userToDelete = await User.findOne({ where: { username } });

      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (userToDelete.isAdmin === true) {
        return res
          .status(403)
          .json({ message: 'You cannot delete an admin user.' });
      }

      const deletedRows = await User.destroy({ where: { username } });

      if (deletedRows === 0) {
        return res.status(400).json({ message: 'No users were deleted.' });
      }

      console.log(`User "${username}" deleted.`);
      return res
        .status(200)
        .json({ message: '👋 User deleted successfully. 👋' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Route for getting all users (only admins can perform this action)
  getAllUsers: async (req, res) => {
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
  },

  // Route for getting user by email (only admins can perform this action)
  getUserByEmail: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(404).json({ message: 'User not found.' });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: error.message });
    }
  },
};
