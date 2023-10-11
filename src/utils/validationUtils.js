const User = require('../models/User');
const Product = require('../models/Product');

// Verifica se o usuário já está cadastrado no banco de dados
const isUserAlreadyRegistered = async (username) => {
    const user = await User.findOne({ where: { username } });
    return !!user;
};

const isProductAlreadyRegistered = async (product) => {
    const produto = await Product.findOne({ where: { product } });
    return !!produto;
};


module.exports = {
    isUserAlreadyRegistered,isProductAlreadyRegistered
};