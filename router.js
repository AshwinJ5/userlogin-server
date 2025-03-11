const express=require('express')
const route=express.Router()
const userController=require('./controllers/userController')
const productController=require('./controllers/productcontroller')
const multerConfig=require('./Middleware/multerMiddleware')
const jwtMiddleware = require('./Middleware/jwtMiddleware');
const {validateUpdateUser,validateRegisterUser,validateLoginUser,validateObjectId} =require('./Middleware/validationMiddleware');
const { refreshToken } = require('./controllers/refreshController');
const { validateProduct, validateUpdateProduct } = require('./Middleware/productValidation')

// register
route.post('/register',validateRegisterUser,userController.register)

// login
route.post('/login',validateLoginUser,userController.login)

// block or unb a user
route.post('/blockusers/:blockid',jwtMiddleware,validateObjectId("blockid"),userController.blockOrUnblockAnyUser)

// get all users
route.get('/users',jwtMiddleware,userController.getAllUserData)

// edit a user
route.patch('/users/:id',jwtMiddleware, multerConfig.single("userImage"),validateObjectId("id"),validateUpdateUser,userController.updateUser)

// delete a user
route.delete('/users/:id',jwtMiddleware,validateObjectId("id"),userController.deleteUser)

// add a product by user
route.post('/product',jwtMiddleware,validateProduct,productController.addNewProducts)

// update a product by added user
route.patch('/product/:id',jwtMiddleware,validateObjectId("id"),validateUpdateProduct,productController.updateProduct)

// get all products
route.get('/product',jwtMiddleware,productController.getAllProducts)

// get a users products
route.get('/product/:id',jwtMiddleware,validateObjectId("id"),productController.getUsersProducts)

// delete a product by added user
route.delete('/product/:id',jwtMiddleware,validateObjectId("id"),productController.deleteAProduct)

// refresh token
route.post("/refresh-token",jwtMiddleware, refreshToken);

module.exports=route