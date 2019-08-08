/* eslint-disable camelcase */
import * as jwt from 'jsonwebtoken';
import UsersService from '../../services/users.service';
import { Constants } from '../../helpers/constants';

const buildResult = (res, result) => {
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const users = require('../../data/users');
  const { email } = result.response.data;
  const { is_admin } = users.filter(user => user.email === email)[0];
  const user_id = users.filter(user => user.email === email)[0].id;
  const payload = {
    email,
    is_admin,
    user_id,
  };
  const options = Constants.jwtOptions;
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, options);

  // eslint-disable-next-line no-param-reassign
  result.response.data.token = !!result && !!result.response && !!result.response.data && token;

  res.status(result.code)
    .send(result.response);
};

class Controller {
  signupUser(req, res) {
    UsersService.create(req.body)
      .then(result => {
        buildResult(res, result);
      })
      .catch(error => res.status(error.code)
        .send(error.response));
  }

  signinUser(req, res) {
    UsersService.login(req.body)
      .then(result => buildResult(res, result))
      .catch(error => res.status(error.code)
        .send(error.response));
  }
}

export default new Controller();
