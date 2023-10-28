const Order = require('../models/Order');
const Product = require('../models/Product');

exports.addProductToOrder = async (req, res) => {
    try {
        const { productId, orderId } = req.body;

        const order = await Order.findByPk(orderId, { include: Product });
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }

        if (product.quantity < 1) {
            return res.status(400).json({ message: 'Produto sem estoque disponível' });
        }

        order.total_value = parseFloat(order.total_value) + parseFloat(product.price);
        product.quantity--;

        await product.save();
        await order.save();

        await order.addProduct(product, { through: { quantity: 1 } });

        return res.status(200).json({ message: 'Produto adicionado ao pedido com sucesso', order });
    } catch (error) {
        console.error('Erro ao adicionar um produto ao pedido:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao adicionar o produto ao pedido' });
    }
};

exports.removeProductFromOrder = async (req, res) => {
    try {
        const orderId = req.params.id; 
        const productId = req.params.id; 

        const order = await Order.findByPk(orderId, { include: Product });
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado no pedido' });
        }

        // Verifica se o produto está presente no pedido antes de removê-lo
        const isProductInOrder = await order.hasProduct(product);
        if (!isProductInOrder) {
            return res.status(404).json({ message: 'Produto não está associado a este pedido' });
        }

        // Removendo o produto apenas se ele estiver presente no pedido
        await order.removeProduct(product);

        // Verifica se o produto já foi removido do pedido
        const isProductRemoved = await order.hasProduct(product);
        if (!isProductRemoved) {
            // Atualizando o valor total e a quantidade do produto somente se o produto foi removido
            order.total_value = parseFloat(order.total_value) - parseFloat(product.price);
            product.quantity++;
            await product.save();
            await order.save();
        }

        return res.status(200).json({ message: 'Produto removido do pedido com sucesso', order });
    } catch (error) {
        console.error('Erro ao remover um produto do pedido:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao remover o produto do pedido' });
    }
};
