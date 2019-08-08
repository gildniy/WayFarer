import * as express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateTripInputs,
  validateInteger,
  validatePermission,
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validatePermission('admin'), validateCreateTripInputs], controller.createTrip)
  .patch('/:tripId/cancel', [validateAuthToken, validatePermission('admin'), validateInteger], controller.cancelTrip)
  .get('/', [validateAuthToken], controller.showTrips)
  .get('/:tripId', [validateAuthToken, validateInteger], controller.showTrip)
