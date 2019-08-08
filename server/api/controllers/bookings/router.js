import express from 'express';
import controller from './controller';
import {
  validateAuthToken,
  validateCreateBookingInputs,
  validateInteger,
  validatePermission
} from '../../middlewares/validators';

export default express.Router()
  .post('/', [validateAuthToken, validatePermission('user'), validateCreateBookingInputs], controller.bookTrip)
  .get('/', [validateAuthToken], controller.showBookings)
  .delete('/:bookingId', [validateAuthToken, validatePermission('owner'), validateInteger], controller.deleteBooking);
