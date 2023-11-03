const Sequelize = require('sequelize');
const db = require('../config/database');
const PaymentMethod = require('./PaymentMethod');
const Address = require('./Address');
const User = require('./User');
const Product = require('./Product');

const Order = db.define('orders', {
    orderId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Pending",
    },
    total_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    shipping_address: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Address,
            key: 'id'
        }
    },
    payment_details: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: PaymentMethod,
            key: 'id'
        }
    }
});

const OrderProducts = db.define('order_products', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

Order.belongsToMany(Product, { through: OrderProducts });
Product.belongsToMany(Order, { through: OrderProducts });

Order.belongsTo(PaymentMethod, { foreignKey: 'payment_details' });
Order.belongsTo(Address, { foreignKey: 'shipping_address' });
Order.belongsTo(User, { foreignKey: 'userId' });

//  garantir que o valor total seja calculado corretamente ,  formatado com duas casas decimais antes de salvar no db . Isso evitará valores negativos no saldo.
Order.addHook('beforeSave', (order, options) => {
    if (order.changed('total_value')) {
        order.total_value = parseFloat(order.total_value).toFixed(2);
    }
});


module.exports = Order;
