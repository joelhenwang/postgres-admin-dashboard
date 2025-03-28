const Users = require('../models/users');

exports.allAccess = (req, res) => {
      res.status(200).send("Public content");
}

exports.webdevBoard = (req, res) => {
    res.status(200).send("WebDev Content");
}

exports.getAll = async function getAll(req, res) {
    const json = req.body;

    try {
        var users = await Users.getAll();
        console.log("Users: ", users);
        return res.status(200).send(users);
    } catch(e){
        return res.status(500).send({
            message: "Error querying for users."
        });
    }
}