
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authMiddleware = async (req, res, next) => {

    const authHeader = req.get("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            message: "You are not authorised user !!"
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({
                message: "You are not authorised user!!!"
            });
        }

    } catch (error) {
        return res.status(403).json({
            message: "You are not authorised user!!!"
        });
    }
};

module.exports = authMiddleware;