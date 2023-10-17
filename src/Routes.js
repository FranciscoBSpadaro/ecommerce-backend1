const express = require('express');
const routes = express.Router();

const UserController = require('./controllers/UserController');  // importando controlador de usuários

//define as rotas de usuários.
routes.post('/users', UserController.createUser);
routes.get('/users', UserController.getAllUsers);
routes.get('/users/:id', UserController.getUsersbyID);
routes.put('/users/:id', UserController.updateUserEmail);
routes.delete('/users/:id', UserController.deleteUser);

const ProductController = require('./controllers/ProductController');  // importando controlador de produtos

// Define as rotas relacionadas aos produtos.
routes.post('/products', ProductController.createProduct);
routes.get('/products', ProductController.getAllProducts);
routes.get('/products/:id', ProductController.getProductById);
routes.put('/products/:id', ProductController.updateProductById);
routes.delete('/products/:id', ProductController.deleteProductById);

const PasswordController = require('./controllers/PasswordController'); // importando controlador para alterar senhas
// define a rota de senhas. 
routes.put('/password/:id', PasswordController.updateUserPassword);

const ProfileController = require('./controllers/ProfileController');

routes.post('/profiles', ProfileController.createProfile);
routes.get('/profiles', ProfileController.getAllProfiles);
routes.get('/profiles/:username', ProfileController.getProfileByUsername);
routes.put('/profiles/:username', ProfileController.updateProfileByUsername);
routes.delete('/profiles/:id', ProfileController.deleteProfileById);

const CategoryController = require('./controllers/CategoryController')

routes.post('/categories', CategoryController.createCategory);
routes.get('/categories', CategoryController.getAllCategories);
routes.get('/categories/:id', CategoryController.getCategoryById);
routes.put('/categories/:id', CategoryController.updateCategory);

routes.delete('/categories/:id', CategoryController.deleteCategory);

const CartController = require('./controllers/CartController')

routes.post('/carts', CartController.findOrCreateCart);
routes.get('/carts', CartController.getCart);
routes.put('/carts/:id', CartController.updateCartItem);


const OrderController = require('./controllers/OrderController')

routes.post('/ordens', OrderController.createOrder);
routes.get('/ordens', OrderController.getAllOrders);
routes.get('/ordens/username', OrderController.getOrdersByUserName);
routes.delete('/ordens/:id', OrderController.deleteOrder);


module.exports = routes;