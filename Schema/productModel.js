const mongoose=require('mongoose')

const productSchema= new mongoose.Schema({
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId
    },
    productName:{
        required:true,
        type:String,
        unique:true
    },
    brand:{
        required:true,
        type:String
    },
    description:{
        required:true,
        type:String
    },
    discountedPrice:{
        required:true,
        type:Number
    },
    actualPrice:{
        required:true,
        type:Number
    },
    productCategory:{
        required:true,
        type:String
    }
})

const products=mongoose.model('products',productSchema)
module.exports=products
