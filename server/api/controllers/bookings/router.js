import express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateBookingInputs,
  validateInteger
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validateCreateBookingInputs], controller.bookTrip)
  .get('/', [validateAuthToken], controller.showBookings)
  .delete('/:bookingId', [validateAuthToken, validateInteger], controller.deleteBooking);
