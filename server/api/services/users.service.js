import L from '../../common/logger';
import { Constants } from '../helpers/constants';
import { hashPassword, verifyPassword, writeJSONFile } from '../helpers/helpers';

const filename = '../data/users.json';
// eslint-disable-next-line import/no-dynamic-require
const users = require(filename);

class UsersService {
  create(registerObj) {
    L.info(`create user with email: ${registerObj.email}`);

    const user$ = {
      ...{ id: 0 },
      ...registerObj,
      ...{ is_admin: false },
    };

    const hashedPassword = hashPassword(registerObj.password);
    const user = {
      ...user$,
      password: hashedPassword,
    };
    const usersEmails = users.map(u => u.email);

    if (!usersEmails.includes(user.email)) {
      users.push(user);
      // eslint-disable-next-line no-param-reassign,no-return-assign
      users.forEach((el, i) => el.id = i + 1);

      if (users.includes(user)) {
        writeJSONFile(filename, users);

        return Promise.resolve({
          code: Constants.response.created, // 201
          response: {
            status: 'success',
            data: {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,
            },
          },
        });
      }

      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({
        code: Constants.response.serverError, // 500
        response: {
          status: 'error',
          error: 'Internal server error!',
        },
      });
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      code: Constants.response.exists, // 409
      response: {
        status: 'error',
        error: 'User with this email already exists!',
      },
    });
  }

  login({ email, password }) {
    L.info(`login user with email: ${email}`);

    const userExists = users.filter(u => {
      const passwordMatch = verifyPassword(password, u.password);
      return u.email === email && passwordMatch;
    })[0];

    if (userExists) {
      L.info('Yeah the user exists!');

      return Promise.resolve({
        code: Constants.response.found, // 302
        response: {
          status: 'success',
          data: {
            first_name: userExists.first_name,
            last_name: userExists.last_name,
            email: userExists.email,
          },
        },
      });
    }

    L.info('No, the user doesn\'t exist!');

    return Promise.reject({
      code: Constants.response.notFound, // 404
      response: {
        status: 'error',
        error: 'User not found',
      },
    });
  }
}

export default new UsersService();
