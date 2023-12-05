const Sequelize = require('sequelize');
const db = require('../config/database');
const Transaction = require('./Transaction');
const Address = require('./Address');
const User = require('./User');
const Product = require('./Product');

const Order = db.define('orders', {
  orderId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Pendente',
  },
  total_value: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  shipping_address: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Address,
      key: 'addressId',
    },
  },
  payment_details: { // salvar detalhes da transação
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: Transaction,
      key: 'transactionId',
    },
  },
});

const OrderProducts = db.define('order_products', {
  order_quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

Order.belongsToMany(Product, { through: OrderProducts });
Product.belongsToMany(Order, { through: OrderProducts });

Order.belongsTo(Transaction, { foreignKey: 'payment_details' });
Order.belongsTo(Address, { foreignKey: 'shipping_address' });
Order.belongsTo(User, { foreignKey: 'userId' });

//  garantir que o valor total seja calculado corretamente ,  formatado com duas casas decimais antes de salvar no db . Isso evitará valores negativos no saldo.
Order.addHook('beforeSave', (order, options) => {
  if (order.changed('total_value')) {
    order.total_value = parseFloat(order.total_value).toFixed(2);
  }
});

Order.prototype.calculateTotalValue = async function () {
  // Se o pedido foi rejeitado, retorne o valor total atual
  if (this.status === 'Rejeitado') {
    return this.total_value;
  }

  const products = await this.getProducts();
  return products.reduce((total, product) => {
    const price = parseFloat(product.price);
    const quantity = parseInt(product.order_products.order_quantity, 10); // alterar 'quantity' para 'order_quantity'

    if (!isNaN(price) && !isNaN(quantity)) {
      return total + price * quantity;
    } else {
      return total;
    }
  }, 0);
};

Order.prototype.updateWithTransaction = function (transaction) {
  this.payment_details = transaction.transactionId;
  return this.save();
};

Order.prototype.confirm = function () {
  this.status = 'Confirmado';
  return this.save();
};

db.sync()
  .then(() => {
    console.log('🤖 Tabela de Ordens de compras Criada com sucesso! ✔');
  })
  .catch(error => {
    console.error('Erro ao criar tabela de Ordens de compras:', error);
  });

module.exports = Order;
