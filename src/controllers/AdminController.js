const Role = require("../models/Role");
const UserRole = require("../models/UserRole");

exports.createRoles = async (req, res) => {
  try {
    const { name, description, isAdmin } = req.body; 
    const setroles = await Role.create({ name, description, isAdmin }); 
    res.status(200).json(setroles);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message }); 
  }
};

exports.setUserRoles = async (req, res) => {
  try {
    const { userId, roleId } = req.body; 
    const setroles = await UserRole.create({ userId, roleId }); 
    res.status(200).json(setroles);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message }); 
  }
};