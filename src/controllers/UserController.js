// Importing required modules
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { JWT_SECRET , JWT_TIME } = process.env;
const { hashPassword, comparePasswords } = require('../utils/passwordUtils');
const generateVerificationCode = require('../utils/verificationCode');
const { sendWelcomeEmail } = require('../controllers/EmailController');
const { Op } = require('sequelize');


module.exports = {
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // Check if the user with the given email already exists
      const userAlreadyExists = await User.findOne({ where: { email } });
      if (userAlreadyExists) {
        return res.status(400).json({ message: `⚠ The user with email ${email} is already registered ⚠` });
      }
      // Hashing password for security
      const hashedPassword = await hashPassword(password);
      // Generating verification code and sending a verification email
      const verificationCode = generateVerificationCode(8);
      await sendWelcomeEmail(email, verificationCode);
      // Creating user in the database
      const user = await User.create({ username, email, password: hashedPassword, verificationCode });
      console.log(user);
      res.status(201).json({ message: `🤖 User with username ${username} and email ${email} registered successfully! 🤖` });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "⚠ Invalid or duplicate email ⚠" });
    }
  },

  // Route for user login
  loginUser: async (req, res) => {
    try {
      const { email, username, password } = req.body;

      // Find user by email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { username }
          ]
        }
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Compare password with hashed password stored in the database
      const passwordMatch = await comparePasswords(password, user.password);

      if (passwordMatch) {
        console.log(`🔓 User ${username} ${email} logged in successfully 🔓`);

        // Generate JWT token
        const token = jwt.sign({
          username: user.username,
          isEmailValidated: user.isEmailValidated,
          isAdmin: user.isAdmin,
          isMod: user.isMod
        }, JWT_SECRET, {
          expiresIn: JWT_TIME
        });

        res.status(200).json({ message: `🔑 Login successful! Happy shopping 🛒`, token });
      } else {
        res.status(400).json({ message: "⚠ Incorrect password ⚠" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // front-end display username
  getUsername: async (req, res) => {
    try {
      const { username } = req.decodedToken;;
      const user = await User.findOne({ where: { username } });

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

      const { username } = req.decodedToken;
      const { email } = req.body;

      const [updatedRows] = await User.update(
        { email }, { where: { username } }
      );

      if (updatedRows === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const verificationCode = generateVerificationCode(8);
      await sendVerificationEmail(email, verificationCode);

      await User.update(
        { isEmailValidated: false }, { where: { email } }
      );

      console.log(`User ${username} email updated to ${email}. Verification email sent.`);
      res.status(200).json({ message: '🤖 Email updated successfully. 🤖' });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: '⚠ Invalid or duplicate email ⚠' });
    }
  },

  // Route for deleting user (only admins can perform this action)
  deleteUser: async (req, res) => {
    try {

      const { username } = req.body;

      const userToDelete = await User.findOne({ where: { username } });

      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (userToDelete.isAdmin === true) {
        return res.status(403).json({ message: 'You cannot delete an admin user.' });
      }

      const deletedRows = await User.destroy({ where: { username } });

      if (deletedRows === 0) {
        return res.status(400).json({ message: 'No users were deleted.' });
      }

      console.log(`User "${username}" deleted.`);
      return res.status(200).json({ message: '👋 User deleted successfully. 👋' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Route for getting all users (only admins can perform this action)
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: error.message });
    }
  },

  // Route for getting user by email (only admins can perform this action)
  getUserByEmail: async (req, res) => {
    try {

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
  }
};
