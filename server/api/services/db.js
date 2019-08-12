const dotenv = require('dotenv');

dotenv.config();

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => console.log('connected to the Database'));

const createUserTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
        users(
          id UUID PRIMARY KEY,
          first_name VARCHAR(128) NOT NULL,
          last_name VARCHAR(128) NOT NULL,
          email VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL
        )`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users returning *';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createAllTables = () => {
  createUserTable();
};

const deleteAllTables = () => {
  dropUserTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUserTable,
  createAllTables,
  //
  dropUserTable,
  deleteAllTables,
  pool,
};

require('make-runnable');
