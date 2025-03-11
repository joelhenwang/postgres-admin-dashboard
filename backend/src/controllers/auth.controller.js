const db = require('../models/index');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

function signin(req, res) {
    const json = req.body;
    const query = `SELECT id, username, password, role FROM users WHERE username='${json.user}'`
    let query_result = [];

    try{
        query_result = db.any(query); 
    }
    catch(e){
        console.log(`Error querying for user${json.user}. Error message: ${e}`);
        res.status(500).send({
            message: "Error querying for user."
        })
        
    } 

    if (query_result.length === 0){
        return res.status(404).send({message: "User not found."});
    }

    const user = query_result[0];

    var isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    console.log(isPasswordValid);
    
    if(!isPasswordValid){
        return res.status(401).send({
            accessToken: null,
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        { id: user.id },
        config.secret,
        {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: 1800 //30min in seconds
        }
    );

    return res.status(200).send({
        id: user.id,
        username: user.username,
        role: user.role,
        accessToken: token
    });
}


module.exports = {
    signin: signin
}