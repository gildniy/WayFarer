import express from 'express';
import { validateLoginInputs, validateRegisterInputs } from '../../middlewares/validators';
import controller from './controller';

export default express.Router()
  .post('/signup', validateRegisterInputs, controller.signupUser)
  .post('/signin', validateLoginInputs, controller.signinUser);
