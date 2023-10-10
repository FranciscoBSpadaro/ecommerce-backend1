const Sequelize = require('sequelize');
const db = require('../config/database');

const Product = db.define('products', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true
  }
});

// Sincroniza o modelo com o banco de dados e cria a tabela de produto automaticamente
Product.sync()
  .then(() => {
    console.log('🤖 Tabela de Produtos Criada com sucesso! ✔');
  })
  .catch((error) => {
    console.error('Erro ao criar tabela de produtos:', error);
  });

module.exports = Product;