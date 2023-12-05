const Order = require('../models/Order');
const Address = require('../models/Address');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

const validateRequest = (req, res) => {
  // fazer isso em todos os controllers.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};


// Obtém todos os pedidos de um usuário
const getOrdersByUserId = async (req, res) => {
  try {
    validateRequest(req, res);
    const { id } = req.decodedToken; // userId
    const orders = await Order.findAll({
      where: { userId: id },
      include: [
        {
          model: Product,
          through: { attributes: ['order_quantity'] }, // incluir a quantidade de cada produto no pedido
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

const getOrderById = async (req, res) => {
  try {
    validateRequest(req, res);
    const orderId = req.params.id;
    const order = await Order.findByPk(orderId)
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



// Obtém um pedido por ID
const getOrderByIdAdm = async (req, res) => {
  try {
    validateRequest(req, res);
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
    validateRequest(req, res);
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
    validateRequest(req, res);
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
    validateRequest(req, res);
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

const updateProductQuantityInOrder = async (req, res) => {
  try {
    validateRequest(req, res);

    const orderId = req.params.orderId;
    const productUpdates = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    for (const { productId, orderQuantity } of productUpdates) {
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ message: `Produto ${productId} não encontrado` });
      }

      let orderProduct = await order.getProducts({
        where: { productId: productId },
      });

      if (orderProduct.length) {
        orderProduct = orderProduct[0];
        orderProduct.order_products.order_quantity = orderQuantity;
        await orderProduct.order_products.save();
      } else {
        return res
          .status(404)
          .json({ message: `Produto ${productId} não encontrado no pedido` });
      }
    }

    order.total_value = await order.calculateTotalValue();
    await order.save();

    res.status(200).json({
      message: 'Quantidade dos produtos atualizada com sucesso no pedido',
      order,
    });
  } catch (error) {
    console.error('Erro ao atualizar a quantidade dos produtos no pedido', error);
    res
      .status(500)
      .json({
        message:
          'Ocorreu um erro ao atualizar a quantidade dos produtos no pedido',
      });
  }

};

module.exports = {
  getAllConfirmedOrders,
  getAllPendingOrders,
  getAllRejectedOrders,
  getOrdersByUserId,
  getOrderByIdAdm,
  getOrderById,
  updateProductQuantityInOrder,
};
