const { verifyRefreshToken } = require("../Services/tokenServices");

const refreshTokenMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "Token missing. Please log in" });
        }

        verifyRefreshToken(token); 
        req.userId = verifyRefreshToken(token).userId;                
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please log in again." });
        } else if (err.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token. Please log in again." });
        } else {
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    }
};

module.exports = refreshTokenMiddleware;