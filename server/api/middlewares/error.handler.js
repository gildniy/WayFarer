import { responseObj } from '../helpers/helpers';
import { Constants } from '../helpers/constants';

const errorHandler = (err, req, res, next) => res.status(500)
  .send(responseObj('error', Constants.response.serverError, err.message));

export default errorHandler;
