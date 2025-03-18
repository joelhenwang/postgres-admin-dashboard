const jwt = require('jsonwebtoken');
const auth_config = require('../config/auth.config');
const db_pool = require('../models/index');


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
            next();
        }
    );
}

async function isWebdev(req, res, next) { 
    console.log(req.userId);
    
    const query = `SELECT id, username, password, role FROM users WHERE id='${req.userId}'`
     let query_result = [];

    try{
        const client = await db_pool.connect();
        query_result = await client.query(query); 
    }
    catch(e){
        console.log(`Error querying for user with id${req.userId}. Error message: ${e}`);
        res.status(500).send({
            message: "Error querying for user."
        })
        
    } 
    finally{
        client.release();
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