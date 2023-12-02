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
    const { body, orderId } = req;
    const { payer } = body;

    const payment = new Payment(client);

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    let totalValue = await order.calculateTotalValue();
    totalValue = parseFloat(totalValue);

    const paymentData = { // pagamento com cartão
      transaction_amount: Number(body.transactionAmount),
      token: body.token,
      description: body.description, // descrição dos produtos
      installments: Number(body.installments), // parcelas
      payment_method_id: body.paymentMethodId,
      issuer_id: body.issuerId,
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

        const transaction = await Transaction.createForOrder(
          order,
          body.paymentMethodId,
          data.id,
        );

        await order.updateWithTransaction(transaction);

        res.status(201).json({
          detail: data.status_detail,
          status: data.status,
          id: data.id,
          order,
          transaction
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
  let errorMessage = 'Unknown error cause';
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