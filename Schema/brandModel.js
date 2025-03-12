const mongoose=require('mongoose')

const BrandSchema= new mongoose.Schema({
    brandName:{
        required:true,
        type:String,
        lowercase:true,
        trim:true
    },
    brandImage:{
        type:String,
    },
    brandCategory: {
        type: [String],
        trim: true,
        lowercase: true,
        default: [],
        set: category => category.map(categories => categories.split(" ").join(""))
    },
    userId:{
        required:true,
        type:mongoose.Schema.Types.ObjectId
    }
})

const brands=mongoose.model('brands',BrandSchema)
module.exports=brands
