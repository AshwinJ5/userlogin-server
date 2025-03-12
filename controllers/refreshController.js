const jwt = require('jsonwebtoken');


exports.refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(403).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: "Not Authorized user" });
      req.userId = decoded.userId;                              

      const newAccessToken = jwt.sign(
          { id: decoded.userId },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );

      res.json({ accessToken: newAccessToken });
      
  });
};
