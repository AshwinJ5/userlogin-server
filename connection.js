const mongoose =require('mongoose')
const connectionString= process.env.Connection_String

mongoose.connect(connectionString).then(()=>{
    console.log("mongoDB Atlas successfully connected");
}).catch((err)=>{
    console.log(`mongoDB connection failed! Error: ${err}`);
})