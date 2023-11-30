const PaymentMethod = require('../models/PaymentMethod');
const { validationResult } = require('express-validator');
const { hashCardNumber } = require('../utils/passwordUtils');

// Função para criar um novo método de pagamento
const createPaymentMethod = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, cardNumber, expirationDate } = req.body;

    // adiçao decriptografia do cartão - exibir apenas os ultimos 4 digitos
    const hashedCardNumber = await hashCardNumber(cardNumber);

    const paymentMethod = await PaymentMethod.create({
      userId,
      cardNumber: hashedCardNumber,
      expirationDate,
    });

    return res.status(201).json({
      message: 'Método de pagamento criado com sucesso',
      paymentMethod: {
        userId: paymentMethod.userId,
        cardNumber: paymentMethod.cardNumber.substr(-4),
        expirationDate: paymentMethod.expirationDate,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Erro ao criar método de pagamento' });
  }
};

// Função para listar todos os métodos de pagamento de um usuário
const getPaymentMethodsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const paymentMethods = await PaymentMethod.findAll({
      where: { userId },
    });

    return res.status(200).json(
      paymentMethods.map(paymentMethod => ({
        userId: paymentMethod.userId,
        cardNumber: paymentMethod.cardNumber.substr(-4),
        expirationDate: paymentMethod.expirationDate,
      })),
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Erro ao buscar métodos de pagamento' });
  }
};

// Função para atualizar um método de pagamento
const updatePaymentMethod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, cardNumber, expirationDate } = req.body;
    const paymentMethodId = req.params.id;

    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: 'Método de pagamento não encontrado' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedCardNumber = bcrypt.hashSync(cardNumber.substr(-4), salt);

    await paymentMethod.update({
      userId,
      cardNumber: hashedCardNumber,
      expirationDate,
    });

    return res.status(200).json({
      message: 'Método de pagamento atualizado com sucesso',
      paymentMethod: {
        userId: paymentMethod.userId,
        cardNumber: paymentMethod.cardNumber.substr(-4),
        expirationDate: paymentMethod.expirationDate,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Erro ao atualizar método de pagamento' });
  }
};

// Função para excluir um método de pagamento
const deletePaymentMethod = async (req, res) => {
  try {
    const paymentMethodId = req.params.id;
    const paymentMethod = await PaymentMethod.findByPk(paymentMethodId);

    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: 'Método de pagamento não encontrado' });
    }

    await paymentMethod.destroy();

    return res
      .status(200)
      .json({ message: 'Método de pagamento excluído com sucesso' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Erro ao excluir método de pagamento' });
  }
};

module.exports = {
  createPaymentMethod,
  getPaymentMethodsByUserId,
  updatePaymentMethod,
  deletePaymentMethod,
};
