const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');


// Função para criar um novo pedido
exports.createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, products } = req.body;

        // Verifica se o usuário existe
        const user = await User.findByPk(userId);                  // acho melhor colocar essa função no cart.
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se os produtos existem e estão disponíveis em estoque          // acho melhor colocar essa função no cart.
        const productsIds = products.map(product => product.id);
        const availableProducts = await Product.findAll({
            where: { id: productsIds, stock: { $gt: 0 } }
        });

        // Verifica se todos os produtos foram encontrados
        if (availableProducts.length !== products.length) {
            return res.status(400).json({ message: 'Um ou mais produtos não estão disponíveis' });
        }

        // Verifica se a quantidade de produtos solicitados está disponível em estoque
        const outOfStockProducts = [];
        products.forEach(product => {
            const availableProduct = availableProducts.find(p => p.id === product.id);
            if (availableProduct.stock < product.quantity) {
                outOfStockProducts.push({
                    productId: product.id,
                    productName: availableProduct.productName,
                    availableStock: availableProduct.stock
                });
            }
        });

        // Se houver produtos fora de estoque, retorna a mensagem de erro
        if (outOfStockProducts.length > 0) {
            return res.status(400).json({ message: 'Quantidade solicitada de produtos indisponível', outOfStockProducts });
        }

        // Cria o pedido
        const order = await Order.create({
            id,
            status: 'pending'
        });

        // Cria os itens do pedido
        const orderItems = products.map(product => ({
            orderId: order.id,
            productId: product.id,
            quantity: product.quantity,
        }));
        await OrderItem.bulkCreate(orderItems);

        // Atualiza o estoque dos produtos
        products.forEach(async product => {
            const availableProduct = availableProducts.find(p => p.id === product.id);
            await availableProduct.update({ stock: availableProduct.stock - product.quantity });
        });

        return res.status(201).json({ message: 'Pedido criado com sucesso', orderId: order.id });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};
exports.getAllOrders = async (req, res) => {                                                              
    try {
        let orders = await Order.findAll();                                                  
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Ocorreu um erro ao listar os ordens de compras.' });
    }
},

// Função para obter os pedidos de um usuário
exports.getOrdersByUserName = async (req, res) => {
    try {
        const username = req.params.username;
        let user = await User.findByPk(username);         // Verifica se o usuário existe        
        if (!user) {                  
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        else {
            let orders = await Order.findOne();                                                  
            res.status(200).json(orders);
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: message.error });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, quantity } = req.body

        await Order.update({ status, quantity }, { where: { id } });                    
        res.status(200).json({ message: 'Ordem de compra atualizada com sucesso' });
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({ message: message.error });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const username = req.params.username;

        await Order.destroy({ where: { username } });

        return res.status(200).json({ message });
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({ message: message.error });
    }
};