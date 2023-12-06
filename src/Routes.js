const express = require('express');
const routes = express.Router();
const { expressjwt: ejwt } = require("express-jwt");
const adminCheck = require('./middlewares/adminCheck');
const modCheck  = require('./middlewares/modCheck');
const checkBearerToken = require('./middlewares/jwtMiddleware')
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');
const ProductDetailsController = require('./controllers/ProductDetailsController');
const PasswordController = require('./controllers/PasswordController');
const EmailController = require('./controllers/EmailController');
const ProfileController = require('./controllers/ProfileController');
const AddressController = require('./controllers/AddressController');
const CategoryController = require('./controllers/CategoryController')
const OrderController = require('./controllers/OrderController')
const Order_Controller = require('./controllers/Order_Controller')
const ProcessPayment = require('./controllers/ProcessPayment')
const AdminController = require('./controllers/AdminController')
const TransactionController = require('./controllers/TransactionsController');
const UploadsController = require('./controllers/UploadsController');

// Middleware to authenticate tokens
routes.use(
    ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
      path: [
        '/users/signup', 
        '/users/login', 
        '/public/users', 
        '/public/products', 
        '/forgotpassword', 
        '/checkcode', 
        '/email/code',
        /^\/productdetails\/.*/, // Adiciona uma expressão regular para isentar todas as rotas que começam com '/productdetails/'
        /^\/products\/.*/, // Adiciona uma expressão regular para isentar todas as rotas que começam com '/products/'
      ]
    })
  );

// Routes without token authentication
routes.post('/users/signup', UserController.createUser);
routes.post('/users/login', UserController.loginUser);
routes.post('/public/users', UserController.getUserByEmail);
routes.get('/public/products', ProductController.getAllProducts);
routes.get('/products/search/:id', ProductController.getProductsByQuery);
routes.get('/products/:productId', ProductController.getProductById);
routes.get('/productdetails/:productId', ProductDetailsController.getProductDetailsByProductId);
routes.put('/forgotpassword', PasswordController.changeUserPassword);
routes.post('/checkcode', PasswordController.checkCode);
routes.post('/email/code', EmailController.requestVerification);


// All routes below require token authentication.
routes.post('/email/verifyEmail', checkBearerToken(), EmailController.verifyEmail);
routes.put('/email/update', checkBearerToken(), EmailController.updateUserEmail);

routes.put('/password', checkBearerToken(), PasswordController.updateUserPassword);
routes.post('/password/verify', checkBearerToken(), PasswordController.verifyCurrentPassword);

routes.post('/profiles', checkBearerToken(), ProfileController.createProfile);
routes.get('/profiles/query', checkBearerToken(), ProfileController.getProfileByQuery);
routes.get('/profiles/token', checkBearerToken(), ProfileController.getProfileByToken);
routes.put('/profiles', checkBearerToken(), ProfileController.updateProfileById);

routes.post('/addresses/create/:id', checkBearerToken(), AddressController.createAddress);
routes.get('/addresses/user/:id', checkBearerToken(), AddressController.getAddressesByUserId);
routes.put('/addresses/update/:id', checkBearerToken(), AddressController.updateAddress);
routes.delete('/addresses/delete/:id', checkBearerToken(), AddressController.deleteAddress);

routes.get('/categories', checkBearerToken(), CategoryController.getAllCategories);
routes.get('/categories/:id', checkBearerToken(), CategoryController.getCategoryById);

routes.get('/transaction/:id', checkBearerToken(), TransactionController.getTransactionsByUserId);

routes.post('/orders/create', checkBearerToken(), OrderController.createOrder);
routes.post('/orders/addproduct/:id', checkBearerToken(), OrderController.addProductToOrder);
routes.post('/orders/removeproduct/:id', checkBearerToken(), OrderController.removeProductFromOrder);
routes.get('/orders/user/:id', checkBearerToken(), Order_Controller.getOrdersByUserId);
routes.get('/orders/:id', checkBearerToken(), Order_Controller.getOrderById);
routes.put('/orders/updatequantity/:orderId', checkBearerToken(), Order_Controller.updateProductQuantityInOrder);

routes.get('/orders/checkout/:id', checkBearerToken(), OrderController.checkoutOrder);
routes.post('/orders/process_payment', checkBearerToken(), ProcessPayment.processPayment);



// Admin routes
const adminRoutes = express.Router();
adminRoutes.use(adminCheck);

adminRoutes.get('/users/all', UserController.getAllUsers);
adminRoutes.put('/users/roles', AdminController.setRoles);
adminRoutes.get('/users/edit', AdminController.getUser);
adminRoutes.delete('/users/delete', UserController.deleteUser);
adminRoutes.post('/email/requestNewPassword', EmailController.requestNewPassword);

adminRoutes.get('/profiles', ProfileController.getAllProfiles);
adminRoutes.delete('/profiles/:id', ProfileController.deleteProfileById);

adminRoutes.post('/categories', CategoryController.createCategory);
adminRoutes.put('/categories/:id', CategoryController.updateCategory);
adminRoutes.delete('/categories/:id', CategoryController.deleteCategory);

const multer = require('multer');
const multerConfig = require('./config/multer');
adminRoutes.get('/uploads', UploadsController.getImages);
adminRoutes.get('/uploads/images', UploadsController.getImagesByName);
adminRoutes.post('/uploads', multer(multerConfig).single('file'), UploadsController.uploadImage);
adminRoutes.delete('/uploads/:id', UploadsController.deleteImage);

adminRoutes.post('/products', ProductController.createProduct);
adminRoutes.put('/products/:id', ProductController.updateProductById);
adminRoutes.delete('/products/:id', ProductController.deleteProductById);

adminRoutes.post('/productdetails/create', ProductDetailsController.createProductDetails);
adminRoutes.put('/productdetails/:productId', ProductDetailsController.updateProductDetailsByProductId);
adminRoutes.delete('/productdetails/:productId', ProductDetailsController.deleteProductDetailsByProductId);

adminRoutes.get('/transactions', TransactionController.getAllTransactions);
adminRoutes.delete('/transaction/:id', TransactionController.deleteTransaction);

adminRoutes.get('/orders/search/:id', Order_Controller.getOrderByIdAdm);
adminRoutes.get('/orders/confirmed', Order_Controller.getAllConfirmedOrders);
adminRoutes.get('/orders/pending', Order_Controller.getAllPendingOrders);
adminRoutes.get('/orders/rejected', Order_Controller.getAllRejectedOrders);


routes.use('/admin', adminRoutes);

// Moderator routes
const modRoutes = express.Router();
modRoutes.use(modCheck);

modRoutes.get('/users', UserController.getAllUsers);
modRoutes.get('/users', UserController.getUsername);
modRoutes.post('/email/requestNewPassword', EmailController.requestNewPassword);

modRoutes.get('/profiles', ProfileController.getAllProfiles);
modRoutes.delete('/profiles/:id', ProfileController.deleteProfileById);

// modRoutes.get('/orders', OrderController.getAllOrders);

modRoutes.post('/categories', CategoryController.createCategory);
modRoutes.put('/categories/:id', CategoryController.updateCategory);


modRoutes.put('/products/:id', ProductController.updateProductById);

// Rotas para ProductDetails em modRoutes
modRoutes.post('/productdetails', ProductDetailsController.createProductDetails);
modRoutes.put('/productdetails/:productId', ProductDetailsController.updateProductDetailsByProductId);
modRoutes.delete('/productdetails/:productId', ProductDetailsController.deleteProductDetailsByProductId);

routes.use('/mod', modRoutes);


module.exports = routes;
