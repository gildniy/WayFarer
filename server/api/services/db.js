const dotenv = require('dotenv');
dotenv.config();
const Pool = require('pg').Pool;
const dbURL = process.env.NODE_ENV === 'test' ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL;
const pool = new Pool({ connectionString: dbURL });

pool.on('connect', () => console.log('connected to the Database'));

const tablesDropString = `

        DROP TABLE IF EXISTS bookings, users, trips;
        
`;

const tablesCreateString = `

      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(128) NOT NULL,
      last_name VARCHAR(128) NOT NULL,
      email VARCHAR(128) NOT NULL,
      password VARCHAR(128) NOT NULL,
      is_admin BOOL DEFAULT 'f'
    );
    
    CREATE TABLE IF NOT EXISTS trips(
      id SERIAL PRIMARY KEY,
      seating_capacity SMALLINT NOT NULL,
      bus_license_number VARCHAR(128) NOT NULL,
      origin VARCHAR(128) NOT NULL,
      destination VARCHAR(128) NOT NULL,
      trip_date TIMESTAMP,
      fare SMALLINT NOT NULL,
      status BOOL DEFAULT 't'
    );
    
    CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      trip_id SMALLINT NOT NULL,
      user_id SMALLINT NOT NULL,
      seat_number SMALLINT NOT NULL,
      FOREIGN KEY (trip_id) REFERENCES trips (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
`;

// const devDataString = `
//
//     INSERT INTO users VALUES (1,'Gregory','Bautista','user1@test.com','password1@','t');
//
// `;

const testDataString = `

    INSERT INTO users VALUES (1,'Gregory','Bautista','user1@test.com','$2a$12$.hgLFQmcGKUVVDc5uZfcVOb3fyx34QY1X43AYm8edgqtxHsXY9wxm','t');
    INSERT INTO users VALUES (2,'Jazlene','Steele','user2@test.com','$2a$12$d242cGWomWwSSYEZqsRNkOFec.dheImobHhMEaiaCwIGi/bnCBM9i','f');
    INSERT INTO users VALUES (3,'Fernanda','Suarez','user3@test.com','$2a$12$MDB7sjNKyJi1SSKTeHE8cu712GWTLB2ZztRZq23HKIaEo6moJVJl2','f');
    INSERT INTO users VALUES (4,'Khalil','Bernard','user4@test.com','$2a$12$ddz/oNx6uPOUBuTQ5Co.NOHzTNgL43XIlLtWwk1GxrrQ/DzTD6u2S','f');
    INSERT INTO users VALUES (5,'Natalya','Montes','user5@test.com','$2a$12$z9LL1cUbU1PQyJJsCxN4qOn3mfNaC7s/uJGW7HtUNytlumlRnbECW','f');
    
    INSERT INTO trips VALUES (1,40,'RAA567R','GAKENKE','KIGALI','2019-08-15T20:44:41.519Z',1000,'f');
    INSERT INTO trips VALUES (2,20,'RAA563R','NYAMAGABE','KIGALI','2019-08-15T20:44:41.519Z',1000,'t');
    INSERT INTO trips VALUES (3,10,'RAA527E','RULINDO','BYUMBA','2019-04-15T20:44:41.519Z',1000,'t');
    INSERT INTO trips VALUES (4,40,'RAS564G','MUSONGA','KIGALI','2019-08-15T20:44:41.519Z',1000,'t');
    INSERT INTO trips VALUES (5,5,'RAA567F','GAHEMBE','GISENYI','2019-12-15T20:44:41.519Z',1000,'f');
    
    INSERT INTO bookings VALUES (1,1,2,1);
    INSERT INTO bookings VALUES (2,2,5,3);
    INSERT INTO bookings VALUES (3,3,3,20);
    INSERT INTO bookings VALUES (5,4,4,3);
    INSERT INTO bookings VALUES (6,5,4,30);
    INSERT INTO bookings VALUES (7,2,3,8);
    INSERT INTO bookings VALUES (8,1,5,4);
    INSERT INTO bookings VALUES (9,3,2,1);
    INSERT INTO bookings VALUES (10,4,2,8);
    
`;

const createAllTables = () => {
  return pool.query(
    tablesDropString +
    tablesCreateString +
    testDataString
    // (process.env.NODE_ENV === 'test' ? testDataString : devDataString)
  )
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables,
  pool,
};

require('make-runnable');
