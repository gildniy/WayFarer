import { Constants } from '../helpers/constants';
import { hashPassword, responseObj, verifyPassword } from '../helpers/helpers';
import * as jwt from 'jsonwebtoken';
import L from '../../common/logger';

const qr = require('../db-query');
const Pool = require('pg').Pool;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const generateToken = (user) => {
  const payload = {
    email: user.email,
    is_admin: user.is_admin,
    user_id: user.id,
  };
  const options = Constants.jwtOptions;
  const secret = process.env.JWT_SECRET;

  return jwt.sign(payload, secret, options);
};

class UsersService {
  create(registerObj) {

    const hashedPassword = hashPassword(registerObj.password);

    const user = {
      ...registerObj,
      ...{
        password: hashedPassword,
        is_admin: false
      },
    };

    return new Promise((resolve, reject) => {

      pool.query('SELECT * FROM users WHERE email = $1', [user.email], (error, results) => {

        if (!results.rows.length) {

          const text = `INSERT INTO
            users(first_name, last_name, email, password, is_admin)
            VALUES($1, $2, $3, $4, $5)
            returning *`;

          const values = [user.first_name, user.last_name, user.email, user.password, user.is_admin];

          qr.query(text, values)
            .then(r => {
              const token = generateToken({...user, ...{ id: r[0].id }});
              const data = {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token
              };
              resolve(responseObj('success', Constants.response.created, 'Successfully created', data));
            })
            .catch(e => reject(responseObj('error', Constants.response.serverError, 'Internal server error!')));
        } else {
          reject(responseObj('error', Constants.response.exists, 'User with this email already exists!'));
        }
      });
    });
  }

  login({ email, password }) {

    return new Promise((resolve, reject) => {

      pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {

        const user = results.rows && results.rows[0];
        if (user) {
          const passwordMatch = user && verifyPassword(password, user.password);

          if (passwordMatch) {

            const token = generateToken(user);
            const data = {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
              token
            };
            resolve(responseObj('success', Constants.response.ok, 'User logged in successfully', data));
          } else {
            reject(responseObj('error', Constants.response.unprocessableEntry, 'Wrong password'));
          }
        } else {
          reject(responseObj('error', Constants.response.notFound, 'User not found'));
        }
      });
    });
  }
}

export default new UsersService();
