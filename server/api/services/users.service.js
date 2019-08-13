import { Constants } from '../helpers/constants';
import { hashPassword, verifyPassword/*, writeJSONFile*/ } from '../helpers/helpers';
import * as jwt from 'jsonwebtoken';
import L from '../../common/logger';

const filename = '../data/users.json';
const users = require(filename);
const db = require('./../db');
// const pool = require('./db');
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

          db.query(text, values);

          const token = generateToken(user);

          resolve({
            code: Constants.response.created, // 201
            response: {
              status: Constants.response.created, // 201
              message: 'Successfully created',
              data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token
              },
            },
          });
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            code: Constants.response.exists, // 409
            response: {
              status: Constants.response.exists, // 409
              error: 'User with this email already exists!',
            },
          });
        }
      });
    });
  }

  login({ email, password }) {
    const userExists = users.filter(u => {
      const passwordMatch = verifyPassword(password, u.password);
      return u.email === email && passwordMatch;
    })[0];

    if (userExists) {
      return Promise.resolve({
        code: Constants.response.found, // 302
        response: {
          status: Constants.response.found, // 302
          message: 'success',
          data: {
            first_name: userExists.first_name,
            last_name: userExists.last_name,
            email: userExists.email,
            token
          },
        },
      });
    }

    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: Constants.response.notFound, // 404
        error: 'User not found',
      },
    });
  }
}

export default new UsersService();
