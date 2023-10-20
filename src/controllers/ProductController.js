const Product = require('../models/Product');

const ProductController = {
  // Método um novo produto
  createProduct: async (req, res) => {
    try {
      // Extrair dados do corpo da requisição
      const { productName, price, description, categoryId, quantity } = req.body;

      // Verificar se o produto já existe pelo nome
      let produtoJaExiste = await Product.findOne({ where: { productName } });

      if (!produtoJaExiste) {
        // Se o produto não existe, criar um novo produto
        const newProduct = new Product({
          productName,
          price,
          description,
          categoryId,
          quantity: quantity || 1 // Se não for fornecida uma quantidade, cadastrar com quantidade 1
        });

        const savedProduct = await newProduct.save();
        console.log(savedProduct);
        res.status(201).json(savedProduct);
      } else {
        // Se o produto já existe, atualizar a quantidade
        let updatedQuantity = parseInt(quantity, 10) || 1;
        produtoJaExiste.quantity += updatedQuantity;
        await produtoJaExiste.save();
        console.log(produtoJaExiste);
        return res.status(200).json({ message: `⚠ O Produto ${produtoJaExiste.productName} já está cadastrado. A quantidade de itens foi atualizada para ${produtoJaExiste.quantity}. ⚠` });
      }
    } catch (error) {
      res.status(400).json({ error: "Não Foi Possivel Cadastrar o Produto, Verifique a Categoria" });
    }
  },

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
      const { id } = req.params;

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

  // Método para atualizar um produto pelo seu ID
  updateProductById: async (req, res) => {
    try {
      const { id } = req.params;
      let product = await Product.findByPk(id);

      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      // Extrair dados do corpo da requisição
      const { quantity, price, description, categoryId } = req.body;

      // Atualizar os dados do produto encontrado com os novos dados fornecidos
      product.quantity = quantity;
      product.price = price;
      product.description = description;
      product.categoryId = categoryId;

      let updatedProduct = await product.save();
      console.log(`Atenção os Dados do Produto ID "${req.params.id}" Foram Atualizados.`);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: "Não foi possivel atualizar os dados desse produto, verifique a Categoria." });
    }
  },

  // Método para excluir um produto pelo seu ID
  deleteProductById: async (req, res) => {
    try {
      // Excluir o produto do banco de dados pelo seu ID
      let deletedProduct = await Product.destroy({ where: { id: req.params.id } });

      if (!deletedProduct) {
        // Se o produto não foi encontrado, retornar uma resposta com status 404
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      console.log(`Atenção o Produto ID "${req.params.id}" Foi Excluido.`);
      res.status(200).json({ message: "Produto Excluido com Sucesso." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = ProductController;
