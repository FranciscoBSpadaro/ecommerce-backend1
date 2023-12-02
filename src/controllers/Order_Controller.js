const Order = require('../models/Order');
const Address = require('../models/Address');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');

// Obtém todos os pedidos de um usuário
const getOrdersByUserId = async (req, res) => {
    try {
      const { id } = req.decodedToken; // userId
      const orders = await Order.findAll({
        where: { userId: id },
        include: [
          {
            model: Product,
            through: { attributes: ['quantity'] }, // incluir a quantidade de cada produto no pedido
          },
        ],
      });
  
      if (!orders.length) {
        return res.status(404).json({ message: 'Pedidos não encontrados' });
      }
  
      res.json(orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos', error);
      res.status(500).json({ message: 'Ocorreu um erro ao buscar os pedidos' });
    }
  };
  
  // Obtém um pedido por ID
  const getOrderByIdAdm = async (req, res) => {
    try {
      const orderId = req.params.id;
  
      const order = await Order.findByPk(orderId, {
        include: [Address, User, Product, Transaction],
      });
  
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
  
      res.status(200).json(order);
    } catch (error) {
      console.error('Erro ao obter pedido por ID', error);
      res
        .status(500)
        .json({ message: 'Ocorreu um erro ao obter o pedido pelo id' });
    }
  };
  
  // Obtém todos os pedidos com status "Confirmado" admin only
  const getAllConfirmedOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: {
          status: 'Confirmado',
        },
      });
  
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Não há pedidos confirmados' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Erro ao obter todos os pedidos', error);
      res
        .status(500)
        .json({ message: 'Ocorreu um erro ao obter todos os pedidos' });
    }
  };
  
  // Obtém todos os pedidos com status "Pendente" admin only
  const getAllPendingOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: {
          status: 'Pendente',
        },
      });
  
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Não há pedidos Pendentes' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Erro ao obter todos os pedidos', error);
      res
        .status(500)
        .json({ message: 'Ocorreu um erro ao obter todos os pedidos' });
    }
  };
  
  // Obtém todos os pedidos com status "Rejeitado" admin only
  const getAllRejectedOrders = async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: {
          status: 'Rejeitado',
        },
      });
  
      if (orders.length === 0) {
        return res.status(200).json({ message: 'Não há pedidos Rejeitados' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Erro ao obter todos os pedidos', error);
      res
        .status(500)
        .json({ message: 'Ocorreu um erro ao obter todos os pedidos' });
    }
  };
  
  // Atualiza um pedido por ID
  const updateOrder = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const orderId = req.params.id;
      const { payment_details, shipping_address } = req.body;
  
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
  
      // Atualização dos dados do pedido
      await order.update({ payment_details, shipping_address });
  
      // Recarregue o pedido após a atualização
      const updatedOrder = await Order.findByPk(orderId);
  
      res
        .status(200)
        .json({ message: 'Pedido atualizado com sucesso', order: updatedOrder });
    } catch (error) {
      console.error('Erro ao atualizar pedido', error);
      res.status(500).json({ message: 'Ocorreu um erro ao atualizar o pedido' });
    }
  };

  module.exports = {
    getAllConfirmedOrders,
    getAllPendingOrders,
    getAllRejectedOrders,
    getOrdersByUserId,
    getOrderByIdAdm,
    updateOrder
  }