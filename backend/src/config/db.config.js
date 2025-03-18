require('dotenv').config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD} = process.env;

const pg_config = {
    host: PGHOST,
    port: 5432,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    ssl: {
        require: true,
    },
};

module.exports = {pg_config};