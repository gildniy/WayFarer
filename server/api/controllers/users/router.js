import * as express from 'express';
import { validateRegisterInputs } from '../../middlewares/validators';
import controller from './controller';

export default express.Router()
  .post('/signup', validateRegisterInputs, controller.signupUser);
