const users= require('../Schema/userModel')
const jwt= require('jsonwebtoken')

// register

exports.register=async (req,res)=>{
    const{userName,email,password}=req.body

    try {
        const existingUser=await users.findOne({email})
        console.log(existingUser);
        if (existingUser) {
            res.status(406).json('User Already Exist! Please Login..')
        } else {
            const newUser= new users({
                userName,email,password
            })
            await newUser.save()
            res.status(200).json(newUser)
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// login
exports.login=async(req,res)=>{
    const{email,password}=req.body
      try {
        const existingUser=await users.findOne({email,password})
        console.log(existingUser);
        if (existingUser) {
            const token=jwt.sign({userId:existingUser._id},process.env.Key_jwt)
            res.status(200).json({existingUser,token})
        } else {          
            res.status(406).json('Email & Passsward does not match')
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

//get all users data

exports.getAllUserData=async(req,res)=>{
    try {
        const allUsers=await users.find()
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(401).json(error)
    }
}

//edit a user data
exports.updateUser=async(req,res)=>{
    const{userName,email,password}=req.body
    const userImage = req.files.userImage[0].filename;

        const {id}=req.params
        try {
            const result=await users.findOneAndUpdate({_id:id},{userName,email,password,userImage})
            const updatedUser=await result.save()
            res.status(200).json(updatedUser)
    
        } catch (error) {
            res.status(400).json(error)
        }
    
    }
// delete an user
    exports.deleteUser=async(req,res)=>{
        const {id}=req.params
        try {
            const result=await users.findByIdAndDelete(id)
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json(error)
        }
    }