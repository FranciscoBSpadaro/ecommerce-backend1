const User = require('../models/User');

// Verifica se o usuário já está cadastrado no banco de dados
const isUserAlreadyRegistered = async (username) => {
    const user = await User.findOne({ where: { username } });
    return !!user;
};

module.exports = {
    isUserAlreadyRegistered,
};