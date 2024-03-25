const { v4: uuidv4 } = require('uuid');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  integrator_id: process.env.MERCADO_PAGO_INTEGRATOR_ID,
});
// generateIdempotencyKey é uma função que gera um id único para cada requisição de pagamento adicionando mais segurança e evitando duplicatas
const generateIdempotencyKey = () => uuidv4();

const processPayment = async (req, res) => {
  try {
    console.log('Iniciando processamento de pagamento...');

    const { body } = req;
    const { payer, orderId, transaction_amount, payment_method_id, issuer_id } = body;

    // Verifique se todos os campos necessários estão presentes
    if (!payer || !orderId || !transaction_amount || !payment_method_id || !issuer_id) {
      return res.status(400).json({ message: 'Campos obrigatórios estão faltando' });
    }

    const payment = new Payment(client);

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const paymentData = {
      transaction_amount: Number(transaction_amount),
      token: body.token,
      description: body.description,
      installments: Number(body.installments),
      payment_method_id: payment_method_id,
      issuer_id: issuer_id,
      payer: {
        email: payer.email,
        identification: {
          type: payer.identification.type,
          number: payer.identification.number,
        },
      },
    };
    const idempotencyKey = generateIdempotencyKey();

    console.log('Dados de pagamento:', paymentData); // Adicionado log

    payment
      .create({ body: paymentData }, { idempotencyKey: idempotencyKey })
      .then(async function (data) {
        console.log('Dados de resposta do pagamento:', data); // Adicionado log

        await order.confirm();

        if (
          !body.transaction_amount ||
          !body.description ||
          !body.installments ||
          !body.payment_method_id ||
          !body.issuer_id ||
          !payer
        ) {
          return res
            .status(400)
            .json({ message: 'Campos obrigatórios estão faltando' });
        }

        const transaction = await Transaction.createForOrder(
          order,
          transaction_amount,
          payment_method_id,
          data.id,
          body.description,
          body.installments,
          payer.email,
          payer.identification.type,
          payer.identification.number,
          issuer_id
        );

        await order.updateWithTransaction(transaction.transactionId);

        res.status(201).json({
          status: data.status,
          status_detail: data.status_detail,
          id: data.id,
          date_approved: data.date_approved,
          payer: data.payer,
          payment_method_id: data.payment_method_id,
          payment_type_id: data.payment_type_id,
          refunds: data.refunds,
          order,
          transaction,
        });
      })
      .catch(function (error) {
        console.log('Erro ao processar pagamento:', error); // Adicionado log
        const { errorMessage, errorStatus } = validateError(error);
        res.status(errorStatus).json({ error_message: errorMessage });
      });
  } catch (error) {
    console.error('Erro ao confirmar pedido', error);
    res.status(500).json({ message: 'Ocorreu um erro ao confirmar o pedido' });
  }
};

function validateError(error) {
  console.log('Validando erro:', error); // Adicionado log

  let errorMessage = error.message;
  let errorStatus = 400;

  if (error.cause) {
    const sdkErrorMessage = error.cause && error.cause[0] ? error.cause[0].description : 'Unknown error';
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}
module.exports = {
  processPayment,
};
