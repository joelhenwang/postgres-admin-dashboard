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
        auth_config.API_SECRET,
        (err, decoded) => {
            if(err){
                
                if(err.name == "TokenExpiredError"){
                    return res.status(401).send({
                        message: "Token expired.",
                        expired: true
                    });
                }
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
    
    if (req.userRole == "sysadmin"){
        next();
        return;
    }

    res.status(403).send({
        message: "Require 'sysadmin' role."
    });
    return;
}

async function isManager(req, res, next) {
    if (req.userRole == "manager" || req.userRole == "sysadmin"){
        next();
        return;
    }

    res.status(403).send({
        message: "Require 'manager' role."
    });
    return;
}

async function isRestaurant(req, res, next) {
    if (req.userRole in ["sao_sebastiao", "entrecampos", "telheiras", "manager", "sysadmin"]){
        next();
        return;
    }

    res.status(403).send({
        message: "Require 'restaurant' role."
    });
    return;
}
const authJWT = {
    verifyToken: verifyToken,
    isSysadmin: isSysadmin,
    isManager: isManager,
    isRestaurant: isRestaurant
};

module.exports = authJWT;