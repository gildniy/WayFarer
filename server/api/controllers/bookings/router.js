import express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateBookingInputs,
  validatePermission
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validatePermission('user'), validateCreateBookingInputs], controller.bookTrip);
