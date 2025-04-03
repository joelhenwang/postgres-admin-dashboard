const Users = require("../models/users");

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
