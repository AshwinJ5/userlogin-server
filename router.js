const express=require('express')

const route=express.Router()
const userController=require('./controllers/userController')
const multerConfig=require('./Middleware/multerMiddleware')
const jwtMiddleware = require('./Middleware/jwtMiddleware');
const {validateUpdateUser,validateRegisterUser,validateLoginUser,validateObjectId} =require('./Middleware/validationMiddleware');
const { refreshToken } = require('./controllers/refreshController');

// register
route.post('/register',validateRegisterUser,userController.register)

// login
route.post('/login',validateLoginUser,userController.login)

// get all users
route.get('/users',jwtMiddleware,userController.getAllUserData)

// edit a user
route.patch('/users/:id',jwtMiddleware, multerConfig.single("userImage"),validateObjectId("id"),validateUpdateUser,userController.updateUser)

// delete a user
route.delete('/users/:id',jwtMiddleware,validateObjectId("id"),userController.deleteUser)

// refresh token
route.post("/refresh-token", refreshToken);

module.exports=route