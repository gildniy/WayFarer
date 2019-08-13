import UsersService from '../../services/users.service';
import L from '../../../common/logger';

class Controller {
  signupUser(req, res) {
    UsersService.create(req.body)
      .then(result => res.status(result.code)
        .send(result.response))
      .catch(error => res.status(error.code)
        .send(error.response));
  }

  signinUser(req, res) {
    UsersService.login(req.body)
      .then(result => res.status(result.code)
        .send(result.response))
      .catch(error => res.status(error.code)
        .send(error.response));
  }
}

export default new Controller();
