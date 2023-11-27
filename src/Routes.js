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
const OrderProductsController = require('./controllers/OrderProductsController');
const OrderController = require('./controllers/OrderController')
const AdminController = require('./controllers/AdminController')
const PaymentController = require('./controllers/PaymentController');
const UploadsController = require('./controllers/UploadsController');

// Middleware to authenticate tokens
routes.use(
    ejwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }).unless({
        path: ['/users/signup', '/users/login', '/public/users', '/public/products', '/forgotpassword', '/checkcode', '/email/code']
    })
);

// Routes without token authentication
routes.post('/users/signup', UserController.createUser);
routes.post('/users/login', UserController.loginUser);
routes.post('/public/users', UserController.getUserByEmail);
routes.get('/public/products', ProductController.getAllProducts);
routes.put('/forgotpassword', PasswordController.changeUserPassword);
routes.post('/checkcode', PasswordController.checkCode);
routes.post('/email/code', EmailController.requestVerification);


// All routes below require token authentication.
routes.post('/email/verifyEmail', checkBearerToken(), EmailController.verifyEmail);
routes.put('/email/update', checkBearerToken(), EmailController.updateUserEmail);

routes.put('/password', checkBearerToken(), PasswordController.updateUserPassword);
routes.post('/password/verify', checkBearerToken(), PasswordController.verifyCurrentPassword);

routes.post('/profiles', checkBearerToken(), ProfileController.createProfile);
routes.get('/profiles', checkBearerToken(), ProfileController.getProfileByUsername);
routes.put('/profiles', checkBearerToken(), ProfileController.updateProfileByUsername);

routes.post('/addresses', checkBearerToken(), AddressController.createAddress);
routes.get('/addresses', checkBearerToken(), AddressController.getAddressesByUsername);
routes.put('/addresses/:id', checkBearerToken(), AddressController.updateAddress);
routes.delete('/addresses/:id', checkBearerToken(), AddressController.deleteAddress);

routes.get('/categories', checkBearerToken(), CategoryController.getAllCategories);
routes.get('/categories/:id', checkBearerToken(), CategoryController.getCategoryById);

routes.post('/payments', checkBearerToken(), PaymentController.createPaymentMethod);
routes.get('/payments/:id', checkBearerToken(), PaymentController.getPaymentMethodsByUserId);
routes.put('/payments/:id', checkBearerToken(), PaymentController.updatePaymentMethod);
routes.delete('/payments/:id', checkBearerToken(), PaymentController.deletePaymentMethod);

routes.post('/orders', checkBearerToken(), OrderController.createOrder);
routes.get('/orders', checkBearerToken(), OrderController.getAllOrders);
routes.get('/orders/:id', checkBearerToken(), OrderController.getOrderById);
routes.put('/orders/:id', checkBearerToken(), OrderController.updateOrder);

routes.post('/orderproducts', checkBearerToken(), OrderProductsController.addProductToOrder);
routes.put('/orderproducts/:id', checkBearerToken(), OrderProductsController.removeProductFromOrder);



// Admin routes
const adminRoutes = express.Router();
adminRoutes.use(adminCheck);

adminRoutes.get('/users/all', UserController.getAllUsers);
adminRoutes.put('/users/roles', AdminController.setRoles);
adminRoutes.get('/users/edit', AdminController.getUser);
adminRoutes.delete('/users/delete', UserController.deleteUser);
adminRoutes.post('/email/requestNewPassword', EmailController.requestNewPassword);

adminRoutes.get('/profiles', ProfileController.getAllProfiles);
adminRoutes.delete('/profiles/:id', ProfileController.deleteProfileByUsername);

adminRoutes.post('/categories', CategoryController.createCategory);
adminRoutes.put('/categories/:id', CategoryController.updateCategory);
adminRoutes.delete('/categories/:id', CategoryController.deleteCategory);

const multer = require('multer');
const multerConfig = require('./config/multer');
adminRoutes.get('/uploads', UploadsController.getImages);
adminRoutes.get('/uploads/images', UploadsController.getImagesByName);
adminRoutes.post('/uploads', multer(multerConfig).single('file'), UploadsController.uploadImage);
adminRoutes.delete('/uploads/:id', UploadsController.deleteImage);

adminRoutes.get('/products/:id', ProductController.getProductsByQuery);
adminRoutes.get('/products/:id', ProductController.getProductById);
adminRoutes.post('/products', ProductController.createProduct);
adminRoutes.put('/products/:id', ProductController.updateProductById);
adminRoutes.delete('/products/:id', ProductController.deleteProductById);

adminRoutes.get('/productdetails/:productId', ProductDetailsController.getProductDetailsByProductId);
adminRoutes.post('/productdetails', ProductDetailsController.createProductDetails);
adminRoutes.put('/productdetails/:productId', ProductDetailsController.updateProductDetailsByProductId);
adminRoutes.delete('/productdetails/:productId', ProductDetailsController.deleteProductDetailsByProductId);

adminRoutes.get('/orders', OrderController.getAllOrders);


routes.use('/admin', adminRoutes);

// Moderator routes
const modRoutes = express.Router();
modRoutes.use(modCheck);

modRoutes.get('/users', UserController.getAllUsers);
modRoutes.get('/users', UserController.getUsername);
modRoutes.post('/email/requestNewPassword', EmailController.requestNewPassword);

modRoutes.get('/profiles', ProfileController.getAllProfiles);
modRoutes.delete('/profiles/:id', ProfileController.deleteProfileByUsername);

modRoutes.get('/orders', OrderController.getAllOrders);

modRoutes.post('/categories', CategoryController.createCategory);
modRoutes.put('/categories/:id', CategoryController.updateCategory);


modRoutes.put('/products/:id', ProductController.updateProductById);

// Rotas para ProductDetails em modRoutes
modRoutes.get('/productdetails/:productId', ProductDetailsController.getProductDetailsByProductId);
modRoutes.post('/productdetails', ProductDetailsController.createProductDetails);
modRoutes.put('/productdetails/:productId', ProductDetailsController.updateProductDetailsByProductId);
modRoutes.delete('/productdetails/:productId', ProductDetailsController.deleteProductDetailsByProductId);

routes.use('/mod', modRoutes);


module.exports = routes;
