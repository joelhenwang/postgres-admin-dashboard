const jwt = require('jsonwebtoken');
const auth_config = require('../config/auth.config');
const db = require('../models/index');

function verifyToken(req, res, next) {
    const token = req.headers("x-access-token");
    
    if(!token) {
        return res.status(403).send({
            message: "No token provided."
        });
    }
    
    jwt.verify(
        token,
        auth_config.secret,
        (err, decoded) => {
            if(err){
                return res.status(401).send({
                    message: "Unauthorized.",
                });
            }

            req.userId = decoded.id;
            next();
        }
    );
}

const authJWT = {
    verifyToken: verifyToken,
};

module.exports = authJWT;