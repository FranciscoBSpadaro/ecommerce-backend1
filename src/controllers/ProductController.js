// Importar o model Product
const Product = require('../models/Product');

// Definir os métodos do controller
const ProductController = {
  // Método para criar um novo produto
  createProduct: async (req, res) => {
    try {
      // Extrair dados do corpo da requisição
      const { name, price, description } = req.body;

      // Criar um novo objeto do tipo Product com os dados fornecidos
      const newProduct = new Product({
        name,
        price,
        description
      });

      // Salvar o novo produto no banco de dados
      const savedProduct = await newProduct.save();

      // Retornar o novo produto criado como resposta
      res.status(201).json(savedProduct);
    } catch (error) {
      // Em caso de erro, retornar uma resposta com status 500 e mensagem de erro
      res.status(500).json({ error: error.message });
    }
  },

  // Método para obter todos os produtos
  getAllProducts: async (req, res) => {
    try {
      // Obter todos os produtos do banco de dados
      const products = await Product.findAll();

      // Retornar os produtos obtidos como resposta
      res.status(200).json(products);
    } catch (error) {
      // Em caso de erro, retornar uma resposta com status 500 e mensagem de erro
      res.status(500).json({ error: error.message });
    }
  },

  // Método para obter um produto pelo seu ID
  getProductById: async (req, res) => {
    try {
      // Obter o ID do produto a partir dos parâmetros da requisição
      const { id } = req.params;

      // Buscar o produto no banco de dados pelo seu ID
      const product = await Product.findById(id);

      // Verificar se o produto foi encontrado
      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Product not found" });
      }

      // Retornar o produto encontrado como resposta
      res.status(200).json(product);
    } catch (error) {
      // Em caso de erro, retornar uma resposta com status 500 e mensagem de erro
      res.status(500).json({ error: error.message });
    }
  },

  // Método para atualizar um produto pelo seu ID
  updateProductById: async (req, res) => {
    try {
      // Obter o ID do produto a partir dos parâmetros da requisição
      const { id } = req.params;

      // Buscar o produto no banco de dados pelo seu ID
      const product = await Product.findById(id);

      // Verificar se o produto foi encontrado
      if (!product) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Product not found" });
      }

      // Extrair dados do corpo da requisição
      const { name, price, description } = req.body;

      // Atualizar os dados do produto encontrado com os novos dados fornecidos
      product.name = name;
      product.price = price;
      product.description = description;

      // Salvar as alterações no produto no banco de dados
      const updatedProduct = await product.save();

      // Retornar o produto atualizado como resposta
      res.status(200).json(updatedProduct);
    } catch (error) {
      // Em caso de erro, retornar uma resposta com status 500 e mensagem de erro
      res.status(500).json({ error: error.message });
    }
  },

  // Método para excluir um produto pelo seu ID
  deleteProductById: async (req, res) => {
    try {
      // Obter o ID do produto a partir dos parâmetros da requisição
      const { id } = req.params;

      // Excluir o produto do banco de dados pelo seu ID
      const deletedProduct = await Product.findByIdAndDelete(id);

      // Verificar se o produto foi encontrado e excluído
      if (!deletedProduct) {
        // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Product not found" });
      }

      // Retornar o produto excluído como resposta
      res.status(200).json(deletedProduct);
    } catch (error) {
      // Em caso de erro, retornar uma resposta com status 500 e mensagem de erro
      res.status(500).json({ error: error.message });
    }
  }
};

// Essa forma de exportar é diferente do metodo usado no UserController , fiz isso apenas para estudar as diferentes formas
// as cores dos metodos fica diferente no arquivo Routes.js devido as formas diferentes de exportação. 
module.exports = ProductController;