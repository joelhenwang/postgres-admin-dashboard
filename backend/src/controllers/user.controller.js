const Users = require("../models/users");
const bcrypt = require("bcryptjs");


exports.allAccess = (req, res) => {
	res.status(200).send("Public content");
};

exports.webdevBoard = (req, res) => {
	res.status(200).send("WebDev Content");
};

exports.getAll = async function getAll(req, res) {
	try {
		var users = await Users.getAll();
		return res.status(200).send(users);
	} catch (e) {
		return res.status(500).send({
			message: "Error querying for users.",
		});
	}
};

exports.safeGetAll = async function safeGetAll(req, res) {
	try {
		var users = await Users.safeGetAll();
		return res.status(200).send(users);
	} catch (e) {
		return res.status(500).send({
			message: "Error querying for users.",
		});
	}
};

exports.safeCreate = async function safeCreate(req, res) {
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

exports.safeDelete = async function safeDelete(req, res) {
    try{
        const json = req.body;
        Users.deleteUser(json.username);
        res.send({
            message: `User with username: ${json.username} - was deleted successfully.`
        });
    } catch(e){
        res.status(500).send(`Error deleting user with username: ${json.username}`);
    }
}

exports.safeBatchDelete = async function safeBatchDelete(req, res) {
    try{
        const json = req.body;
        Users.batchDeleteByUsernames(json.usernames);
        res.send({
            message: `Users with usernames: ${json.usernames} - were deleted successfully.`
        });
    } catch(e){
        res.status(500).send(`Error deleting users with usernames: ${json.usernames}`);
    }
}

exports.safeUpdate = async function safeUpdate(req, res) {
    try{
        const json = req.body;
        Users.updateUser(json.username, json.role, json.email);
        res.send({
            message: `User with username: ${json.username} - was updated successfully.`
        });
    } catch(e){
        res.status(500).send(`Error updating user with username: ${json.username}`);
    }
}	






