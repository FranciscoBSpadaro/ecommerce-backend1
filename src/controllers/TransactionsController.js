const Transaction = require('../models/Transaction');
const PaymentMethod = require('../models/PaymentMethod');

class TransactionsController {
  async createTransaction(req, res) {  // metodo de teste , a transação deve ser criada no pedido em OrderController
    try {
      const { id } = req.decodedToken;
      const {
        amount,
        paymentMethodId, // detalhes do pagamento
        description, // descrever a transação
      } = req.body;

      // Crie a transação
      const newTransaction = await Transaction.create({
        userId: id,
        amount: amount,
        description: description,
        paymentMethodId: paymentMethodId,
      });

      return res.status(201).json(newTransaction);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Erro ao criar transação', error });
    }
  }

  async getTransactionsByUserId(req, res) {
    try {
      const { id } = req.params
      const transactions = await Transaction.findAll({
        where: { userId: id },
        include: [
          {
            model: PaymentMethod,
            as: 'payment_method',
            attributes: ['id', 'cardLastFourDigits', 'cardHolderName', 'cardExpirationDate', 'type'],
          },
        ],
      });
      return res.status(200).json(transactions);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Erro ao buscar transações', error });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: PaymentMethod,
            as: 'payment_method',
            attributes: ['id', 'cardLastFourDigits', 'cardHolderName', 'cardExpirationDate', 'type'],
          },
        ],
      });
      return res.status(200).json(transactions);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Erro ao buscar todas as transações', error });
    }
  }

  // only admin
  async deleteTransaction(req, res) {
    try {
      await Transaction.destroy({ where: { id: req.params.id } }); // id da transação nao do usuario
      return res
        .status(200)
        .json({ message: 'Transação deletada com sucesso' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao deletar transação', error });
    }
  }
}

module.exports = new TransactionsController();