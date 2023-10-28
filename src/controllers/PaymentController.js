const PaymentMethod = require('../models/PaymentMethod');
const { validationResult } = require('express-validator');

// Função para criar um novo método de pagamento
exports.createPaymentMethod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, cardNumber, expirationDate } = req.body;

    const paymentMethod = await PaymentMethod.create({
      userId,
      cardNumber,
      expirationDate,
    });

    return res.status(201).json({ message: 'Método de pagamento criado com sucesso', paymentMethod });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar método de pagamento' });
  }
};

// Função para listar todos os métodos de pagamento de um usuário
exports.getPaymentMethodsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
    });

    return res.status(200).json(paymentMethods);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao buscar métodos de pagamento' });
  }
};

// Função para atualizar um método de pagamento
exports.updatePaymentMethod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, cardNumber, expirationDate } = req.body;
    const paymentMethodId = req.params.id;

    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Método de pagamento não encontrado' });
    }

    await paymentMethod.update({
      userId,
      cardNumber,
      expirationDate,
    });

    return res.status(200).json({ message: 'Método de pagamento atualizado com sucesso', paymentMethod });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar método de pagamento' });
  }
};

// Função para excluir um método de pagamento
exports.deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethodId = req.params.id;
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Método de pagamento não encontrado' });
    }

    await paymentMethod.destroy();

    return res.status(200).json({ message: 'Método de pagamento excluído com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao excluir método de pagamento' });
  }
};
