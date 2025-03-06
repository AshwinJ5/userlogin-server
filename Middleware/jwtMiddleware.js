const jwt=require("jsonwebtoken")

const jwtMiddleware=(req,res,next)=>{
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token=authHeader.split(" ")[1]
        if(!token){
            return res.status(401).json({ message: "Token missing. Please login" });
        }
        jwt.verify(token, process.env.Key_jwt, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired. Please log in again." });
                }
                return res.status(403).json({ message: "Invalid token" });
            }

            req.payload = decoded.userId;
            next();
        });
    }catch(err)  {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
    
}

module.exports=jwtMiddleware