const jwt = require('jsonwebtoken');
const auth_config = require('../config/auth.config');


function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];
    
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
                    error: err
                });
            }
            
            req.userId = decoded.id;
            req.userName = decoded.username;
            req.userRole = decoded.role;
            next();
        }
    );
}

async function isSysadmin(req, res, next) { 
    console.log(req.userRole);
    
    if (userRole == "sysadmin"){
        next();
        return;
    }

    res.status(403).send({
        message: "Require 'sysadmin' role."
    });
    return;
}

const authJWT = {
    verifyToken: verifyToken,
    isSysadmin: isSysadmin
};

module.exports = authJWT;