const { Pool } = require('pg');
const db_config = require('../config/db.config');

const db_pool = new Pool(db_config.pg_config)


module.exports = db_pool;