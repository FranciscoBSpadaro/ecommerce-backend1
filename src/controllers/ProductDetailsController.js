const ProductDetails = require('../models/ProductDetails');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');

const ProductDetailsController = {
  // Método para obter os detalhes técnicos de um produto pelo seu ID
  getProductDetailsByProductId: async (req, res) => {
    try {
      const productId = req.params.productId;
      let productDetails = await ProductDetails.findOne({ where: { productId } });

      if (!productDetails) {
        return res.status(404).json({ error: 'Detalhes técnicos do produto não encontrados' });
      }

      res.status(200).json(productDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Método para criar detalhes técnicos para um produto
  createProductDetails: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { productId, technicalDetails } = req.body;

      // Verifique se o produto existe
      const product = await Product.findOne({ where: { productId } });
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      const productDetailsExists = await ProductDetails.findOne({ where: { productId } });

      if (!productDetailsExists) {
        const newProductDetails = new ProductDetails({
          productId,
          technicalDetails
        });

        const savedProductDetails = await newProductDetails.save();
        res.status(201).json(savedProductDetails);
      } else {
        return res.status(400).json({ message: 'Detalhes técnicos para este produto já estão cadastrados' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Método para atualizar os detalhes técnicos de um produto pelo seu ID
  updateProductDetailsByProductId: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const productId = req.params.productId;
      let productDetails = await ProductDetails.findOne({ where: { productId } });

      if (!productDetails) {
        return res.status(404).json({ error: 'Detalhes técnicos do produto não encontrados' });
      }

      const { technicalDetails } = req.body;
      productDetails.technicalDetails = technicalDetails;

      let updatedProductDetails = await productDetails.save();
      res.status(200).json(updatedProductDetails);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Método para excluir os detalhes técnicos de um produto pelo seu ID
  deleteProductDetailsByProductId: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const productId = req.params.productId;
      const deletedProductDetails = await ProductDetails.destroy({ where: { productId } });

      if (!deletedProductDetails) {
        return res.status(404).json({ error: 'Detalhes técnicos do produto não encontrados' });
      }

      res.status(200).json({ message: 'Detalhes técnicos do produto excluídos com sucesso.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductDetailsController;