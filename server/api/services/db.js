const dotenv = require('dotenv');

dotenv.config();

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => console.log('connected to the Database'));

const poolQuery = (qt) => {
  return pool.query(`CREATE TABLE IF NOT EXISTS ${qt}`)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropTable = (table_name) => {
  const queryText = 'DROP TABLE IF EXISTS ' + table_name + ' returning *';
  return pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createUserTable = () => {
  const queryText = `
        users(
          id UUID PRIMARY KEY,
          first_name VARCHAR(128) NOT NULL,
          last_name VARCHAR(128) NOT NULL,
          email VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL
        )`;
  poolQuery(queryText);
};

const dropUserTable = () => dropTable('users');

const createTripTable = () => {
  const queryText = `
        trips(
          id UUID PRIMARY KEY,
          seating_capacity SMALLINT NOT NULL,
          bus_license_number VARCHAR(128) NOT NULL,
          origin VARCHAR(128) NOT NULL,
          destination VARCHAR(128) NOT NULL,
          trip_date TIMESTAMP
        )`;
  poolQuery(queryText);
};

const dropTripTable = () => dropTable('trips');


const createAllTables = () => {
  createUserTable();
  createTripTable();
};

const deleteAllTables = () => {
  dropUserTable();
  dropTripTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUserTable,
  createTripTable,
  createAllTables,
  //
  dropUserTable,
  dropTripTable,
  deleteAllTables,

  pool,
};

require('make-runnable');
