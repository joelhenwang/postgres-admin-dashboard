const db_config = require('../config/db.config');

console.log(db_config);


const pgp = require("pg-promise")();
const db = pgp(db_config.pg_config);

module.exports = db;