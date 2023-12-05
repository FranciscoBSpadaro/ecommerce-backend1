const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

const validateRequest = (req, res) => {
  // fazer isso em todos os controllers.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

const createOrder = async (req, res) => {
  try {
    validateRequest(req, res);

    const { id } = req.decodedToken;
    const { shipping_address } = req.body;

    const order = await Order.create({ userId: id, shipping_address });

    res.status(201).json({ message: 'Carrinho criado com sucesso', order });
  } catch (error) {
    console.error('Erro ao criar novo Carrinho', error);
    res.status(500).json({ message: 'Ocorreu um erro ao criar novo Carrinho' });
  }
};

const addProductToOrder = async (req, res) => {
  try {
    validateRequest(req, res);

    const orderId = req.params.id;
    const { productId, quantity } = req.body;

    const order = await Order.findByPk(orderId);
    const product = await Product.findByPk(productId);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    let orderProduct = await order.getProducts({
      where: { productId: productId },
    });

    if (orderProduct.length) {
      orderProduct = orderProduct[0];
      orderProduct.order_products.quantity += quantity;
      await orderProduct.order_products.save();
    } else {
      await order.addProduct(product, { through: { quantity } });
      orderProduct = await order.getProducts({
        where: { productId: productId },
      });
      orderProduct = orderProduct[0];
    }

    order.total_value = await order.calculateTotalValue();
    await order.save();

    res.status(201).json({
      message: 'Produto adicionado com sucesso ao pedido',
      orderProduct,
    });
  } catch (error) {
    console.error('Erro ao adicionar produto ao pedido', error);
    res
      .status(500)
      .json({ message: 'Ocorreu um erro ao adicionar produto ao pedido' });
  }
};

const checkoutOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId, {
      include: [Product],
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const totalValue = await order.calculateTotalValue();

    res.status(200).json({
      order,
      products: order.Products,
      totalValue,
    });
  } catch (error) {
    console.error('Erro ao fazer checkout do pedido', error);
    res
      .status(500)
      .json({ message: 'Ocorreu um erro ao fazer checkout do pedido' });
  }
};

const removeProductFromOrder = async (req, res) => {
  try {
    validateRequest(req, res);

    const orderId = req.params.id;
    const { productId } = req.body;

    const order = await Order.findByPk(orderId);
    const product = await Product.findByPk(productId);

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    await order.removeProduct(product);

    res.json({ message: 'Produto removido com sucesso do pedido' });
  } catch (error) {
    console.error('Erro ao remover produto do pedido', error);
    res
      .status(500)
      .json({ message: 'Ocorreu um erro ao remover produto do pedido' });
  }
};

module.exports = {
  createOrder,
  addProductToOrder,
  removeProductFromOrder,
  checkoutOrder,
};
