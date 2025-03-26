const db_pool = require('../models/index');
const Users = require('../models/users')

function isEmailOrUserDuplicate(req, res, next) {
    const json = req.body;
    
    try{
        const user = Users.getByUsername(json.username);
        
        if (user.length === 0){
            res.status(400).send({
                message: 'User with username already exists'
            });
            return;
        }

        next();
        
    } catch(e) {
         console.log(`Error querying for user${json.username}. Error message: ${e}`);
        res.status(500).send({
            message: "Error querying for user."
        });
        return;
    } 
};

const verifySignUp = {
    isEmailOrUserDuplicate: isEmailOrUserDuplicate,
}

module.exports = verifySignUp;