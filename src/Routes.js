const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');  // importando controlador de usuários

//define as rotas de usuários.
routes.get('/users', UserController.getAllUsers);
routes.get('/users/:id', UserController.getUsersbyID);
routes.post('/users', UserController.createUser);
routes.put('/users/:id', UserController.updateUserEmail);
routes.delete('/users/:id', UserController.deleteUser);

const ProductController = require('./controllers/ProductController');  // importando controlador de produtos

// Define as rotas relacionadas aos produtos.
routes.post('/products', ProductController.createProduct);
routes.get('/products/:id', ProductController.getProductById);
routes.get('/products', ProductController.getAllProducts);
routes.put('/products/:id', ProductController.updateProductById);
routes.delete('/products/:id', ProductController.deleteProductById);

const PasswordController = require('./controllers/PasswordController'); // importando controlador para alterar senhas
// define a rota de senhas. 
routes.put('/password/:id', PasswordController.updateUserPassword);


module.exports = routes;