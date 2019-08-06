import express                                         from 'express';
import controller                                      from './controller'
import { validateLoginInputs, validateRegisterInputs } from "../../middlewares/validators";

export default express.Router()
                      .post('/signup', validateRegisterInputs, controller.signupUser)
                      .post('/signin', validateLoginInputs, controller.signinUser)
