import * as express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateTripInputs,
  validatePermission,
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validatePermission('admin'), validateCreateTripInputs], controller.createTrip);
