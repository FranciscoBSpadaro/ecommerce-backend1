const Product = require('../models/Product');
const { validationResult } = require('express-validator');

const ProductController = {
  // Método para obter todos os produtos
  getAllProducts: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Obter todos os produtos do banco de dados
      let products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Método para obter um produto pelo seu ID
  getProductById: async (req, res) => {
    try {
      // Obter o ID do produto a partir dos parâmetros da requisição
      const id = req.params;

      // Buscar o produto no banco de dados pelo seu ID
      let product = await Product.findOne(id);

      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // ADM Criar Produto
  createProduct: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        productName,
        price,
        description,
        categoryId,
        quantity,
        image_keys,
      } = req.body;

      const productExists = await Product.findOne({ where: { productName } });

      if (!productExists) {
        const newProduct = new Product({
          productName,
          price,
          description,
          categoryId,
          quantity: quantity || 1,
          image_keys: image_keys || [], // Adiciona as chaves das imagens no produto
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
      } else {
        return res
          .status(400)
          .json({ message: 'Este produto já está cadastrado' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  //ADM atualizar um produto pelo seu ID
  updateProductById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { productId, productName, price, discountPrice, isOffer, description, quantity, image_keys } = req.body;

        const product = await Product.findOne({ where: { productId } });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        const updatedProduct = await product.update({
            productName,
            price,
            discountPrice, // preço de oferta
            isOffer, // se o produto é uma oferta
            description,
            quantity,
            image_keys
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
},
  // ADM  excluir um produto pelo seu ID
  deleteProductById: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const productId = req.params.id;
      const deletedProduct = await Product.destroy({ where: { productId } });

      if (!deletedProduct) {
        // Se o produto não foi encontrado, retornar uma resposta com status 404
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      console.log(`Atenção o Produto ID "${productId}" Foi Excluido.`);
      res.status(200).json({ message: 'Produto Excluido com Sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductController;
