const express = require('express');
const routes = express.Router();
const { expressjwt: ejwt } = require("express-jwt");             // Middleware
const authMiddleware = require('./middlewares/authMiddleware');
const authmodMiddleware = require('./middlewares/authmodMiddleware');
const UserController = require('./controllers/UserController');  // importando controladores
const ProductController = require('./controllers/ProductController');  
const PasswordController = require('./controllers/PasswordController'); 
const ProfileController = require('./controllers/ProfileController');
const CategoryController = require('./controllers/CategoryController')
const CartController = require('./controllers/CartController')
const OrderController = require('./controllers/OrderController')
const AdminController = require('./controllers/AdminController')


// Middleware para autenticar o usuário usando o token gerado pelo jsonwebtoken
routes.use(
    ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({   // desabilita a autenticaçao para as rotas login e signup pois nessas não é possivel ter o token , o token so é gerado apos o login.
        path: ['/users/login', '/users/signup']
    })
);

//define as rotas de usuários.
routes.post('/users/signup', UserController.createUser);
routes.post('/users/login', UserController.loginUser);
// todas as outras rotas abaxo são monitoradas por expressjwt
routes.put('/users/:id', UserController.updateUserEmail);      //  exemplo sem routes.use , routes.put('/users/:id', ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), UserController.updateUserEmail);
// Define as rotas relacionadas aos produtos.
routes.get('/products', ProductController.getAllProducts);
routes.get('/products/:id', ProductController.getProductById);
// define a rota de senhas. 
routes.put('/password/:id', PasswordController.updateUserPassword);
// define rotas de perfil
routes.post('/profiles', ProfileController.createProfile);
routes.get('/profiles/:username', ProfileController.getProfileByUsername);
routes.put('/profiles/:username', ProfileController.updateProfileByUsername);
//define rotas de categorias
routes.get('/categories', CategoryController.getAllCategories);
routes.get('/categories/:id', CategoryController.getCategoryById);
// rotas de carrinho de compras - work in progress/TODO
routes.post('/carts', CartController.findOrCreateCart);
routes.get('/carts', CartController.getCart);
routes.put('/carts/:id', CartController.updateCartItem);
// rotas de ordens de compra - work in progress/TODO
routes.post('/ordens', OrderController.createOrder);
routes.get('/ordens/:username', OrderController.getOrdersByUserName);


// Rotas de administrador
routes.use('/admin', authMiddleware); // toda rota admin vai chamar o midleware de Autenticação de adm
routes.put('/admin/users/:id', AdminController.setRoles); // Atualizar um Usuário para adm ou moderador.
// Rotas de produtos para administrador
routes.post('/admin/products', ProductController.createProduct);
routes.put('/admin/products/:id', ProductController.updateProductById);
routes.delete('/admin/products/:id', ProductController.deleteProductById);
// Rotas de Usuários para administrador
routes.get('/admin/users', UserController.getAllUsers);
routes.get('/admin/users/:id', UserController.getUserByID);
routes.delete('/admin/users/:id', UserController.deleteUser);
// Rotas de Perfil para administrador
routes.get('/admin/profiles', ProfileController.getAllProfiles);
routes.get('/admin/profiles/:username', ProfileController.getProfileByUsername);
routes.delete('/admin/profiles/:id', ProfileController.deleteProfileById);
// Rotas de categorias para administrador
routes.post('/admin/categories', CategoryController.createCategory);
routes.put('/admin/categories/:id', CategoryController.updateCategory);
routes.delete('/admin/categories/:id', CategoryController.deleteCategory);
// Rotas de Ordens de compra para administrador
routes.get('/admin/ordens', OrderController.getAllOrders);
routes.delete('/admin/ordens/:id', OrderController.deleteOrder);
// Rotas de Moderador
routes.use('/mod', authmodMiddleware);
routes.post('/mod/products', ProductController.createProduct);
routes.put('/mod/products/:id', ProductController.updateProductById);
routes.get('/mod/users', UserController.getAllUsers);
routes.get('/mod/users/:id', UserController.getUserByID);
routes.get('/mod/profiles', ProfileController.getAllProfiles);
routes.get('/mod/profiles/:username', ProfileController.getProfileByUsername);
routes.delete('/mod/profiles/:id', ProfileController.deleteProfileById);
routes.get('/mod/ordens', OrderController.getAllOrders);
routes.post('/mod/categories', CategoryController.createCategory);
routes.put('/mod/categories/:id', CategoryController.updateCategory);



module.exports = routes;