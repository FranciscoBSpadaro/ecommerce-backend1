const User = require("../models/User");

const AdminController = {
  getUser: async (req, res) => {
    const { username, email } = req.query;

    try {
      if (username) {
        const user = await User.findOne({ where: { username: username } });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } else if (email) {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
          res.status(200).json(user);
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } else {
        res.status(400).json({ message: "Invalid search criteria." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  setRoles: async (req, res) => {
    try {
      const { isAdmin, isMod, username } = req.body;
      const user = await User.findOne({
        where: {
          username: username
        }
      });

      if (user) {
        const updatedRows = await User.update(
          { isAdmin: isAdmin, isMod: isMod },
          { where: { username: username } }
        );

        if (updatedRows[0] > 0) {
          res.status(200).json({
            success: `Username ${username}, ADM = ${isAdmin}, MOD = ${isMod}`,
            message: "User roles updated successfully.",
          });
        } else {
          res.status(404).json({ message: "User not found." });
        }
      } else {
        res.status(404).json({ message: "User not found." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AdminController;
