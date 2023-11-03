const Sequelize = require('sequelize');
const db = require('../config/database');

const Category = db.define('Category', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    categoryName: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true,
        validate: {
            len: [1, 25]
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },

});


module.exports = Category;