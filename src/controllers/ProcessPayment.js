const { v4: uuidv4 } = require('uuid');
const { MercadoPagoConfig, Payment } = require('mercadopago');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const generateIdempotencyKey = () => uuidv4();

const processPayment = async (req, res) => {
  try {
    const { body } = req;
    const { payer, orderId, transaction_amount, payment_method_id, issuer_id } = body;

    const payment = new Payment(client);

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    const paymentData = {
      // pagamento com cartão
      transaction_amount: Number(transaction_amount), // total value
      token: body.token,
      description: body.description, // descrição dos produtos
      installments: Number(body.installments), // parcelas
      payment_method_id: payment_method_id, // master , visa...
      issuer_id: issuer_id,
      payer: {
        email: payer.email, // email mercadopago
        identification: {
          type: payer.identification.docType, // cpf
          number: payer.identification.docNumber, // numero cpf
        },
      },
    };

    const idempotencyKey = generateIdempotencyKey();

    payment
      .create({ body: paymentData }, { idempotencyKey: idempotencyKey })
      .then(async function (data) {
        await order.confirm();

        // Certifique-se de que os campos não sejam nulos antes de passá-los para a função
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
          body.installments,
          JSON.stringify(payer), // alterar para payer.email...
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
          refunds: data.refunds, // opcional
          order,
          transaction,
        });
      })
      .catch(function (error) {
        console.log(error);
        const { errorMessage, errorStatus } = validateError(error);
        res.status(errorStatus).json({ error_message: errorMessage });
      });
  } catch (error) {
    console.error('Erro ao confirmar pedido', error);
    res.status(500).json({ message: 'Ocorreu um erro ao confirmar o pedido' });
  }
};

function validateError(error) {
  let errorMessage = error.message;
  let errorStatus = 400;

  if (error.cause) {
    const sdkErrorMessage = error.cause[0].description;
    errorMessage = sdkErrorMessage || errorMessage;

    const sdkErrorStatus = error.status;
    errorStatus = sdkErrorStatus || errorStatus;
  }

  return { errorMessage, errorStatus };
}

module.exports = {
  processPayment,
};
