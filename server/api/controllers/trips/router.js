import express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateTripInputs,
  validateInteger,
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validateCreateTripInputs], controller.createTrip)
  .patch('/:tripId/cancel', [validateAuthToken/*, validateInteger*/], controller.cancelTrip)
  .get('/', [validateAuthToken], controller.showTrips)
  .get('/:tripId', [validateAuthToken, validateInteger], controller.showTrip)
