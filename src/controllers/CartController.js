const Cart = require('../models/Cart');

// Controlador do carrinho de compras
const CartController = {  // se comparar findOrCreateCart com o createProduct de ProductController.js  findOrCreateCart tem um codigo melhor escrito e mais facil de ler.
    findOrCreateCart: async (req, res) => {                                                     // Função para adicionar um produto ao carrinho
        try {
            const { userId, productId, quantity } = req.body;
            let cart = await Cart.findOne({ where: { userId } });                               // Procura um carrinho de compras existente para o usuário
            if (!cart) {                                                                        // se o carrinho não existir cria um novo
                cart = await Cart.create({ userId, productId, quantity });                      // Cria um novo carrinho de compras com os dados fornecidos
                res.status(201).json({ message: `Carrinho de Compras Criado` });
            } else {                                                                          // se carrinho ja existe entao atualiza a quantidade de itens
                const updatedCart = parseInt(quantity, 10) || 1;
                cart.quantity += updatedCart;
                await cart.save();
                console.log(cart)                                                              // Salva as alterações no carrinho
                res.status(200).json({ message: `A quantidade de produtos do carrinho foi atualizada para ${cart.quantity}.` });
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Ocorreu um erro ao adicionar o produto ao carrinho' });
        }
    },
    getCart: async (req, res) => {                                                              // Função para obter o carrinho de compras do usuário
        try {
            const carts = await Cart.findAll();                                                  // Retorna todos os carrinhos de compras
            res.status(200).json(carts);
        } catch (error) {
            console.error('Error:', error);
            res.status(400).json({ message: 'Ocorreu um erro ao listar os carrinhos de compras.' });
        }
    },
    updateCartItem: async (req, res) => {                                                       // Função para atualizar a quantidade de um produto no carrinho
        try {
            const { id } = req.params;
            const { quantity, productId } = req.body;
            if (!productId) {                                                                    // Verificar se o produto foi encontrado
                return res.status(404).json({ error: "Produto não encontrado" });
            }
            await Cart.update({ quantity, productId }, { where: { id } });                       // Atualiza a quantidade de um produto no carrinho
            res.status(200).json({ message: 'Item do carrinho atualizado com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Ocorreu um erro ao atualizar o item do carrinho' });
        }
    },
};

module.exports = CartController;