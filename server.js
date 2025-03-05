const express= require("express")
const cors= require("cors")
require("dotenv").config()
require('./connection')
const router=require('./router')

const app=express()
app.use(cors())
app.use(express.json())
app.use(router)

app.use('/Uploads',express.static('./Uploads'))


const PORT=process.env.PORT||5000 

app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})
