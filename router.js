const express=require('express')

const route=express.Router()
const userController=require('./controllers/userController')
const multerConfig=require('./Middleware/multerMiddleware')
const jwtMiddleware = require('./Middleware/jwtMiddleware');

// register
route.post('/register',userController.register)

// login
route.post('/login',userController.login)

// get all users
route.get('/users',jwtMiddleware,userController.getAllUserData)

// edit a user
route.patch('/users/:id',jwtMiddleware, multerConfig.single("userImage"),userController.updateUser)

// delete a user
route.delete('/users/:id',jwtMiddleware,userController.deleteUser)

module.exports=route