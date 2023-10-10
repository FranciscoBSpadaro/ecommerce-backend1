const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');


routes.get('/users', UserController.getAllUsers);
routes.get('/users/:id', UserController.getUsersbyID);
routes.post('/users', UserController.createUser);
routes.put('/users/:id', UserController.updateUser);
routes.delete('/users/:id', UserController.deleteUser);

const ProductController = require('./controllers/ProductController');

// Defina as rotas relacionadas aos produtos
routes.post('/products', ProductController.createProduct);
routes.get('/products:id', ProductController.getProductById);
routes.get('/products', ProductController.getAllProducts);
routes.put('/products:id', ProductController.updateProductById);
routes.delete('/products:id', ProductController.deleteProductById);


module.exports = routes;