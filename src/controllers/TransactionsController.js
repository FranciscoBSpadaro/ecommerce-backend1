const Transaction = require('../models/Transaction');
const User = require('../models/User');

class TransactionsController {

  async getTransactionsByUserId(req, res) {
    try {
      const { id } = req.params
      const transactions = await Transaction.findAll({
        where: { userId: id },
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