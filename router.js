const express=require('express')

const route=express.Router()
const userController=require('./controllers/userController')
const multerConfig=require('./Middleware/multerMiddleware')

// register
route.post('/register',userController.register)

// login
route.post('/login',userController.login)

// get all users
route.get('/users',userController.getAllUserData)

// edit a user
route.patch('/users/:id', multerConfig.fields([
    { name: 'userImage', maxCount: 1 }
  ]),userController.updateUser)

// delete a user
route.delete('/users/:id',userController.deleteUser)

module.exports=route