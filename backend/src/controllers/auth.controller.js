const {API_SECRET} = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const Users = require('../models/users')

async function signup(req, res) {
    try{
        const json = req.body;
        Users.insertUser(
            json.username,
            bcrypt.hashSync(json.password, 8),
            json.role,
            json.email 
        );
        res.send({
            message: `User with username: ${json.username} - was created successfully.`
        });
    } catch(e){
        res.status(500).send(`Error registering user with username: ${json.username}`);
    }    
}



async function signin(req, res) {
    const json = req.body;

    try{
        var user = await Users.getByUsername(json.username)
        if (user.length === 0){
            return res.status(404).send({message: "User not found."});
        }
        user = user[0]
    }
    catch(e){
        return res.status(500).send({
            message: "Error querying for user."
        }); 
    } 
    

    var isPasswordValid = bcrypt.compareSync(json.password, user.password);
    
    if(!isPasswordValid){
        return res.status(401).send({
            accessToken: null,
            message: "Invalid password"
        });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        API_SECRET,
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
    signup: signup,
    signin: signin
}