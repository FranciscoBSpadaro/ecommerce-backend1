const express = require('express');
const routes = express.Router();
const { expressjwt: ejwt } = require("express-jwt");             // Middleware
const Admincheck = require('./middlewares/Admincheck');
const Modcheck = require('./middlewares/Modcheck');
const UserController = require('./controllers/UserController');  // importando controladores
const ProductController = require('./controllers/ProductController');  
const PasswordController = require('./controllers/PasswordController'); 
const EmailController = require('./controllers/EmailController'); 
const ProfileController = require('./controllers/ProfileController');
const AddressController = require('./controllers/AdressController');
const CategoryController = require('./controllers/CategoryController')
const OrderProductsController = require('./controllers/OrderProductsController');
const OrderController = require('./controllers/OrderController')
const AdminController = require('./controllers/AdminController')
const PaymentController = require('./controllers/PaymentController');
const UploadsController = require('./controllers/UploadsController')


// Middleware para autenticar o usuário usando o token gerado pelo jsonwebtoken
routes.use(
    ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({   // desabilita a autenticaçao para as rotas login e signup pois nessas não é possivel ter o token , o token so é gerado apos o login.
        path: ['/users/login', '/users/signup', '/public/products', '/public/users', '/email/code', '/email/verifyEmail', '/email/requestNewPassword']
    })
);

//define as rotas de usuários.
routes.post('/users/signup', UserController.createUser);
routes.post('/users/login', UserController.loginUser);
routes.post('/public/users', UserController.getUserByEmail); // esqueceu seu nome de usuario ? digite seu email para buscar

routes.post('/email/code', EmailController.requestVerification);
routes.post('/email/verifyEmail', EmailController.verifyEmail);
routes.post('/email/requestNewPassword', EmailController.requestNewPassword);

// todas as outras rotas abaixo são monitoradas por expressjwt
routes.put('/email/update', EmailController.updateUserEmail);
// Define as rotas relacionadas aos produtos.
routes.get('/public/products', ProductController.getAllProducts); // rota sem token para o front end
routes.get('/products', ProductController.getAllProducts);
routes.get('/products/:id', ProductController.getProductById);

// define a rota de senhas. 
routes.put('/password', PasswordController.updateUserPassword);
// define rotas de perfil 
//routes.get('/profiles/:id', ProfileController.getProfilebyId);
routes.post('/profiles', ProfileController.createProfile);
routes.get('/profiles', ProfileController.getProfilebyUsername);
routes.put('/profiles', ProfileController.updateProfilebyUsername);
// define rotas de endereço
routes.post('/address/', AddressController.createAddress);
routes.get('/address/:id', AddressController.getAddressesByUserId);
routes.put('/address/:id', AddressController.updateAddress);
routes.delete('/address/:id', AddressController.deleteAddress);
//define rotas de categorias
routes.get('/categories', CategoryController.getAllCategories);
routes.get('/categories/:id', CategoryController.getCategoryById);
// rotas de formas de pagamentos
routes.post('/pagamentos', PaymentController.createPaymentMethod);
routes.get('/pagamentos/:id', PaymentController.getPaymentMethodsByUserId);
routes.put('/pagamentos/:id', PaymentController.updatePaymentMethod);
routes.delete('/pagamentos/:id', PaymentController.deletePaymentMethod);


// rotas de ordens de compra 
routes.post('/ordens', OrderController.createOrder);
routes.get('/ordens/:id', OrderController.getOrderById);
routes.put('/ordens/:id', OrderController.updateOrder);

// Rotas para adicionar produtos a ordens de compra
routes.post('/addpedidos', OrderProductsController.addProductToOrder);
routes.put('/addpedidos/:id', OrderProductsController.removeProductFromOrder);

// Rota de upload de imagens
const multer = require('multer');
const multerConfig = require('./config/Multer');
routes.get('/uploads', UploadsController.getImages);
routes.post('/uploads', multer(multerConfig).single('file'), UploadsController.uploadImage);
routes.delete('/uploads/:id', UploadsController.deleteImage);



// Rotas de administrador
routes.use('/admin', Admincheck); // toda rota admin vai chamar o midleware de Autenticação de adm
routes.put('/admin/users/:id', AdminController.setRoles); // Atualizar um Usuário para adm ou moderador.
// Rotas de produtos para administrador
routes.post('/admin/products',multer(multerConfig).single('image'), ProductController.createProduct);
routes.put('/admin/products/:id', ProductController.updateProductById);
routes.delete('/admin/products/:id', ProductController.deleteProductById);
// Rotas de Usuários para administrador
routes.get('/admin/users', UserController.getAllUsers);
routes.get('/admin/users/:id', UserController.getUserByID);
routes.delete('/admin/users/:id', UserController.deleteUser);
// Rotas de Perfil para administrador
routes.get('/admin/profiles', ProfileController.getAllProfiles);
routes.delete('/admin/profiles/:id', ProfileController.deleteProfileById);
// Rotas de categorias para administrador
routes.post('/admin/categories', CategoryController.createCategory);
routes.put('/admin/categories/:id', CategoryController.updateCategory);
routes.delete('/admin/categories/:id', CategoryController.deleteCategory);
// Rotas de Ordens de compra para administrador
routes.get('/admin/ordens', OrderController.getAllOrders);


// Rotas de Moderador
routes.use('/mod', Modcheck);
routes.post('/mod/products', ProductController.createProduct);
routes.put('/mod/products/:id', ProductController.updateProductById);

routes.get('/mod/users', UserController.getAllUsers);
routes.get('/mod/users/:id', UserController.getUserByID);

routes.get('/mod/profiles', ProfileController.getAllProfiles);
routes.delete('/mod/profiles/:id', ProfileController.deleteProfileById);

routes.get('/mod/ordens', OrderController.getAllOrders);

routes.post('/mod/categories', CategoryController.createCategory);
routes.put('/mod/categories/:id', CategoryController.updateCategory);


module.exports = routes;