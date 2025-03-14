const mongoose=require('mongoose')

const UserSchema= new mongoose.Schema({
    userName:{
        required:true,
        type:String
    },
    userImage:{
        type:String
    },
    password:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId }] 
})

const users=mongoose.model('user',UserSchema)
module.exports=users
