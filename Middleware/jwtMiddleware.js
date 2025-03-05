const jwt=require("jsonwebtoken")

const jwtMiddleware=(req,res,next)=>{
    console.log('inside jwt middleware fn');
    try {
        const token=req.headers['authorization'].split(" ")[1]
        console.log(token);   
        if(token){
            jwtResponse=jwt.verify(token,process.env.Key_jwt)
            console.log(jwtResponse);
            req.payload=jwtResponse.userId
            next()
        }else{
            res.status(401).json("Please Login")
        }
    } catch(err)  {
        res.status(403).json("Invalid token")
    }
    
}

module.exports=jwtMiddleware