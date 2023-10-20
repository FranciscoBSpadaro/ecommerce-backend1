const express = require('express');
const routes = express.Router();
const { expressjwt: ejwt } = require("express-jwt");             // Middleware
const UserController = require('./controllers/UserController');  // importando controladores
const ProductController = require('./controllers/ProductController');  
const PasswordController = require('./controllers/PasswordController'); 
const ProfileController = require('./controllers/ProfileController');
const CategoryController = require('./controllers/CategoryController')
const CartController = require('./controllers/CartController')
const OrderController = require('./controllers/OrderController')


// Middleware para autenticar o usuário usando o token gerado pelo jsonwebtoken
routes.use(
    ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({   // desabilita a autenticaçao para as rotas login e signup pois nessas não é possivel ter o token , o token so é gerado apos o login.
        path: ['/users/login', '/users/signup']
    })
);


//define as rotas de usuários.
routes.post('/users/signup', UserController.createUser);
routes.post('/users/login', UserController.loginUser);
routes.get('/users', UserController.getAllUsers);
routes.get('/users/:id', UserController.getUserByID);
routes.put('/users/:id', UserController.updateUserEmail);
routes.delete('/users/:id', UserController.deleteUser);
// Define as rotas relacionadas aos produtos.
routes.post('/products', ProductController.createProduct);
routes.get('/products', ProductController.getAllProducts);
routes.get('/products/:id', ProductController.getProductById);
routes.put('/products/:id', ProductController.updateProductById);
routes.delete('/products/:id', ProductController.deleteProductById);
// define a rota de senhas. 
routes.put('/password/:id', PasswordController.updateUserPassword);
// define rotas de perfil
routes.post('/profiles', ProfileController.createProfile);
routes.get('/profiles', ProfileController.getAllProfiles);
routes.get('/profiles/:username', ProfileController.getProfileByUsername);
routes.put('/profiles/:username', ProfileController.updateProfileByUsername);
routes.delete('/profiles/:id', ProfileController.deleteProfileById);
//define rotas de categorias
routes.post('/categories', CategoryController.createCategory);
routes.get('/categories', CategoryController.getAllCategories);
routes.get('/categories/:id', CategoryController.getCategoryById);
routes.put('/categories/:id', CategoryController.updateCategory);
routes.delete('/categories/:id', CategoryController.deleteCategory);
// rotas de carrinho de compras - work in progress/TODO
routes.post('/carts', CartController.findOrCreateCart);
routes.get('/carts', CartController.getCart);
routes.put('/carts/:id', CartController.updateCartItem);
// rotas de ordens de compra - work in progress/TODO
routes.post('/ordens', OrderController.createOrder);
routes.get('/ordens', OrderController.getAllOrders);
routes.get('/ordens/:username', OrderController.getOrdersByUserName);
routes.delete('/ordens/:id', OrderController.deleteOrder);

//  exemplo routes.put('/users/:id', ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), UserController.updateUserEmail);

module.exports = routes;