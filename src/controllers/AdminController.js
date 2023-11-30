const User = require("../models/User");
const UserDetails = require("../models/UserDetails");

const AdminController = {
  getUser: async (req, res) => {
    const { username, email } = req.query;

    try {
      let user;
      if (username) {
        user = await User.findOne({ 
          where: { username }, 
          include: [UserDetails] // include UserDetails
        });
      } else if (email) {
        user = await User.findOne({ 
          where: { email }, 
          include: [UserDetails] // include UserDetails
        });
      } else {
        return res.status(400).json({ message: "Invalid search criteria." });
      }

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `Busca sem resultado " ${username || email} " Não Está Cadastrado` });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  setRoles: async (req, res) => {
    try {
      const { isAdmin, isMod, id } = req.body; // use id instead of username
      const userDetails = await UserDetails.findOne({ where: { userId: id } }); // find userDetails by userId

      if (userDetails) {
        const updatedRows = await UserDetails.update(
          { isAdmin, isMod },
          { where: { userId: id } }
        );

        if (updatedRows[0] > 0) {
          res.status(200).json({
            success: `User ID ${id}, ADM = ${isAdmin}, MOD = ${isMod}`,
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
