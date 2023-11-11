const Product = require('../models/Product');
const Uploads = require('../models/Uploads');


const ProductController = {
  // Método para obter todos os produtos
  getAllProducts: async (req, res) => {
    try {
      // Obter todos os produtos do banco de dados
      let products = await Product.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Método para obter um produto pelo seu ID
  getProductById: async (req, res) => {
    try {
      // Obter o ID do produto a partir dos parâmetros da requisição
      const id = req.params;

      // Buscar o produto no banco de dados pelo seu ID
      let product = await Product.findByPk(id);

      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // ADM Criar Produto
  createProduct: async (req, res) => {
    try {
      const { productName, price, description, categoryId, quantity, image_keys } = req.body;

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
        return res.status(400).json({ message: "Este produto já está cadastrado" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  },

  //ADM atualizar um produto pelo seu ID
  updateProductById: async (req, res) => {
    try {
      const id  = req.params.id
      let product = await Product.findByPk(id);

      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      // Extrair dados do corpo da requisição
      const { quantity, price, description, categoryId, image_key } = req.body;

      // Atualizar os dados do produto encontrado com os novos dados fornecidos
      product.quantity = quantity;
      product.price = price;
      product.description = description;
      product.categoryId = categoryId;
      product.image_key = image_key;

      let updatedProduct = await product.save();
      console.log(`Atenção os Dados do Produto ID "${req.params.id}" Foram Atualizados.`);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Não foi possivel atualizar os dados desse produto, verifique a Categoria." });
    }
  },
  // ADM  excluir um produto pelo seu ID
  deleteProductById: async (req, res) => {
    try {
      const productId  = req.params.id
      const deletedProduct = await Product.destroy({ where: { productId } });

      if (!deletedProduct) {
        // Se o produto não foi encontrado, retornar uma resposta com status 404
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      console.log(`Atenção o Produto ID "${productId}" Foi Excluido.`);
      res.status(200).json({ message: "Produto Excluido com Sucesso." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

};



module.exports = ProductController;
