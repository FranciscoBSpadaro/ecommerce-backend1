
const Product = require('../models/Product');


const ProductController = {
  createProduct: async (req, res) => {
    try {
      const { productName, price, description, categoryId, quantity } = req.body;
      let produtoJaExiste = await Product.findOne({ where: { productName } });          // validador verifica se o produto ja existe pelo nome
      if (!produtoJaExiste) {                                                           // se produto não  existe ' false'  cria o produto ,  se 'true/existe' pula para o else e atualiza a quantidade
        const newProduct = new Product({
          productName,
          price,
          description,
          categoryId,
          quantity: quantity || 1                                                         // quantidade ou 1  ,  ou ele cadastra a quantidade definida no cadastro ou se for cadastrado com quantidade 0 ele cadastrar com quantidade 1
        });
        const savedProduct = await newProduct.save();
        console.log(savedProduct)
        res.status(201).json(savedProduct);
      }
      else {
        let updatedQuantity = parseInt(quantity, 10) || 1;                                // parseInt(quantity, 10) o numero 10 representa a base decimal de parseInt  para garantir que o número seja interpretado como um decimal
        produtoJaExiste.quantity += updatedQuantity;                                      // se ao cadastrar o produto nao inserir a quantidade , vai adicionar 1 de quantidade toda vez
        await produtoJaExiste.save();
        console.log(produtoJaExiste)
        return res.status(200).json({ message: `⚠ O Produto ${produtoJaExiste.productName} já está cadastrado. A quantidade de itens foi atualizada para ${produtoJaExiste.quantity}. ⚠` });
      }
    }
    catch (error) {
      res.status(400).json({ error: " Não Foi Possivel Cadastrar o Produto, Verifique a Categoria" });
    }
  },
  // Método para obter todos os produtos
  getAllProducts: async (req, res) => {
    try {
      let products = await Product.findAll();                                       // Obter todos os produtos do banco de dados
      res.status(200).json(products);                                                 // Retornar os produtos obtidos como resposta
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Método para obter um produto pelo seu ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;                                                      // Obter o ID do produto a partir dos parâmetros da requisição
      let product = await Product.findByPk(id);                                     // Buscar o produto no banco de dados pelo seu ID

      if (!product) {                                                                 // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
        return res.status(404).json({ error: "Produto não encontrado" });
      }
      res.status(200).json(product);                                                  // Retornar o produto encontrado como resposta
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Método para atualizar um produto pelo seu ID
  updateProductById: async (req, res) => {
    try {
      const { id } = req.params;
      let product = await Product.findByPk(id);

      if (!product) {                                                                    // Verificar se o produto foi encontrado
        return res.status(404).json({ error: "Produto não encontrado" });                // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
      }

      const { quantity, price, description, categoryId } = req.body;                                 // Extrair dados do corpo da requisição , como regra de negocio o nome nao pode ser alterado.

      product.quantity = quantity;                                                       // Atualizar os dados do produto encontrado com os novos dados fornecidos
      product.price = price;
      product.description = description;
      product.categoryId = categoryId;

      let updatedProduct = await product.save();
      console.log(`Atenção os Dados do Produto ID "${req.params.id}" Foram Atualizados.`)                                       // Salvar as alterações no produto no banco de dados
      res.status(200).json(updatedProduct);                                              // Retornar o produto atualizado como resposta
    } catch (error) {
      res.status(400).json({ message: "Não foi possivel atualizar os dados desse produto , verifique a Categoria." });
    }
  },
  // Método para excluir um produto pelo seu ID
  deleteProductById: async (req, res) => {
    try {
      let deletedProduct = await Product.destroy({ where: { id: req.params.id } });      // Excluir o produto do banco de dados pelo seu ID
      if (!deletedProduct) {                                                               // Verificar se o produto foi encontrado e excluído
        return res.status(404).json({ error: "Produto não encontrado" });                  // Se o produto não foi encontrado, retornar uma resposta com status 404
      }
      console.log(`Atenção o Produto ID "${req.params.id}" Foi Excluido.`)
      res.status(200).json({ message: "Produto Excluido com Sucesso." });
    }
    catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// Essa forma de exportar é diferente do metodo usado no UserController , fiz isso apenas para estudar as diferentes formas
// as cores dos metodos fica diferente no arquivo Routes.js devido as formas diferentes de exportação. 
module.exports = ProductController;