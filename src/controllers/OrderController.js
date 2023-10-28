const Order = require('../models/Order');
const PaymentMethod = require('../models/PaymentMethod');
const Address = require('../models/Address');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const Product = require('../models/Product');

// Crie um novo pedido
exports.createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Extrair informações do corpo da solicitação
        const { status, userId, shipping_address, payment_details, productsId } = req.body;

        // Verifica se o pedido já existe
        const userOrder = await Order.findOne({ where: { userId } });
        if (userOrder) {
            return res.status(404).json({ message: 'Já existe um pedido para o usuário' });
        }

        const order = await Order.create({
            status,
            total_value: 0,
            userId,
            shipping_address,
            payment_details,
        });
        return res.status(201).json({ message: 'Pedido criado com sucesso', order });
    } catch (error) {
        console.error('Erro ao criar um pedido:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao criar um pedido' });
    }
};

// Obtenha todos os pedidos
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [PaymentMethod, Address, User, Product] // Inclua informações de método de pagamento e endereço e do Usúario 
        });

        return res.status(200).json(orders);
    } catch (error) {
        console.error('Erro ao listar pedidos:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao listar os pedidos' });
    }
};

// Obtenha um pedido por ID
exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId, {
            include: [PaymentMethod, Address, User, Product]
        });

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Erro ao obter um pedido por ID:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao obter o pedido' });
    }
};

// Atualize um pedido por ID
exports.updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status, payment_details, shipping_address } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Atualização dos dados do pedido
        await order.update({ status, payment_details, shipping_address });

        // Recarregar o pedido após a atualização
        const updatedOrder = await Order.findByPk(orderId);

        return res.status(200).json({ message: 'Pedido atualizado com sucesso', order: updatedOrder });
    } catch (error) {
        console.error('Erro ao atualizar um pedido:', error);
        return res.status(500).json({ message: 'Ocorreu um erro ao atualizar o pedido' });
    }
};