const { Pool } = require('pg');

const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('connect', () => console.log('connected to the Database'));

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  pool,
};

require('make-runnable');
