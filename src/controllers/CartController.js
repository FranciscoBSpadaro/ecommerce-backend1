const Cart = require('../models/Cart');

// Controlador do carrinho de compras
const CartController = {
    addToCart: async (req, res) => {                                                     // Função para adicionar um produto ao carrinho
        try {
            const { userId, productId, quantity } = req.body;                          // Dados do produto a ser adicionado ao carrinho

            const cartItem = await Cart.create({ userId, productId, quantity });       // Lógica para adicionar o produto ao carrinho
            res.status(200).json({ message: `Produto adicionado ao carrinho com sucesso` });

        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Ocorreu um erro ao adicionar o produto ao carrinho' });   //  erro se o productId do produto ou usuario estiver invalidos no request
        }
    },
    // Função para obter o carrinho de compras do usuário
    getCart: async (req, res) => {
        try {
            const carts = await Cart.findAll();
            res.status(200).json(carts);

        } catch (error) {
            console.error('Error:', error);
            res.status(400).json({ message: 'Ocorreu um erro ao listar os carrinhos de compras.' });
        }
    },
    // Função para atualizar a quantidade de um produto no carrinho
    updateCartItem: async (req, res) => {
        try {
            const { id } = req.params;
            const { quantity, productId } = req.body;

            if (!productId) {                                                                    // Verificar se o produto foi encontrado
                return res.status(404).json({ error: "Produto não encontrado" });                // Se o produto não existe, retornar uma resposta com status 404 e uma mensagem de erro
            }

            const updatedCartItem = await Cart.update({ quantity, productId }, { where: { id } });       // Lógica para atualizar a quantidade de um produto no carrinho

            res.status(200).json({ message: 'Item do carrinho atualizado com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Ocorreu um erro ao atualizar o item do carrinho' });
        }
    },

};

module.exports = CartController;