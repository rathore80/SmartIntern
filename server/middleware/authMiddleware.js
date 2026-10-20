const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({
            message: "Authentication configuration error"
        });
    }

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Not authorized"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id || !decoded.role) {
            return res.status(401).json({
                message: "Invalid token payload"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;