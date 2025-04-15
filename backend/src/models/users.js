const db_pool = require("./index");
const sql_format = require("pg-format");

async function getAll() {
	const query = "SELECT * FROM users";

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(`Error queuerying for all users. Error message: ${e}`);
		throw Error(`Error queuerying for all users. Error message: ${e}`);
	} finally {
		client.release();
	}

	return query_result;
}

async function safeGetAll() {
	const query = "SELECT id, username, role, email FROM users";

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(`Error queuerying for all users. Error message: ${e}`);
		throw Error(`Error queuerying for all users. Error message: ${e}`);
	} finally {
		client.release();
	}

	return query_result;
}

async function getById(id) {
	const query = sql_format("SELECT * FROM users WHERE id = %L", id);

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(`Error querying for user with id: ${id}. Error message: ${e}`);
		throw Error(`Error querying for user with id: ${id}`);
	} finally {
		client.release();
	}

	return query_result;
}

async function getByUsername(username) {
	const query = sql_format("SELECT * FROM users WHERE username = %L", username);

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(
			`Error querying for user with username: ${username}. Error message: ${e.errors}`,
		);
		throw Error(`Error querying for user with username: ${username}`);
	} finally {
		client.release();
	}

	return query_result.rows;
}

async function insertUser(username, password, role, email) {
	const query = sql_format(
		"INSERT INTO users (username, password, role, email) VALUES (%L,%L,%L,%L)",
		username,
		password,
		role,
		email,
	);

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(
			`Error inserting user with username: ${username}. Error message: ${e}`,
		);
		throw Error(
			`Error inserting user with username: ${username}. Error message: ${e}`,
		);
	} finally {
		client.release();
	}

	return;
}

async function deleteByID(id) {
	const query = sql_format("DELETE FROM users WHERE id = %L", id);

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(
			`Error inserting user with username: ${username}. Error message: ${e}`,
		);
		throw Error(
			`Error inserting user with username: ${username}. Error message: ${e}`,
		);
	} finally {
		client.release();
	}

	return;
}

async function batchDeleteByUsernames(usernames) {
	// Format usernames as a proper SQL array
	const usernamesArray = usernames.map(username => `'${username}'`);
	const query = `DELETE FROM users WHERE username IN (${usernamesArray.join(',')})`;

	try {
		var client = await db_pool.connect();
		var query_result = await client.query(query);
	} catch (e) {
		console.log(
			`Error deleting users with usernames: ${usernames}. Error message: ${e}`,
		);
		throw Error(`Error deleting users with usernames: ${usernames}`);
	} finally {
		client.release();
	}
}

const Users = {
	getAll: getAll,
	safeGetAll: safeGetAll,
	getById: getById,
	getByUsername: getByUsername,
	insertUser: insertUser,
	deleteByID: deleteByID,
	batchDeleteByUsernames: batchDeleteByUsernames,
};

module.exports = Users;
