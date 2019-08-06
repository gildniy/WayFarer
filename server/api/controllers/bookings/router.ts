import express    from 'express';
import controller from './controller'
import {
    validateAuthToken,
    validateCreateBookingInputs,
    validateInteger,
    validatePermission
}                 from "../../middlewares/validators";

export default express.Router()
                      .get('/', [validateAuthToken], controller.showBookings)
                      .post('/', [validateAuthToken, validatePermission('user'), validateCreateBookingInputs], controller.bookTrip)
                      .delete('/:bookingId', [validateAuthToken, validatePermission('owner'), validateInteger], controller.deleteBooking)
