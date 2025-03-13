const jwt = require('jsonwebtoken');
const auth_config = require('../config/auth.config');
const db = require('../models/index');


function verifyToken(req, res, next) {
    const token = req.headers["x-access-token"];
    
    if(!token) {
        return res.status(403).send({
            message: "No token provided."
        });
    }
    console.log(token);
    console.log(auth_config.secret);
    
    
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
            next();
        }
    );
}

async function isWebdev(req, res, next) { 
    
    const query = `SELECT id, username, password, role FROM users WHERE if='${req.userId}'`
     let query_result = [];

    try{
        query_result = await db.any(query); 
    }
    catch(e){
        console.log(`Error querying for user with id${req.userId}. Error message: ${e}`);
        res.status(500).send({
            message: "Error querying for user."
        })
        
    } 

    if (query_result.length === 0){
        return res.status(404).send({message: "User not found."});
    }

    const user = query_result[0];
    
    if (user.role == "Webdev"){
        next();
        return;
    }

    res.status(403).send({
        message: "Require Webdev role."
    });

    return;
}

const authJWT = {
    verifyToken: verifyToken,
    isWebdev: isWebdev
};

module.exports = authJWT;