import * as jwt from 'jsonwebtoken';
import { isFloatNumber, isIntegerNumber, noSpaceString } from '../helpers/helpers';
import { Constants } from '../helpers/constants';

const validateAuthToken = (req, res, next) => {

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const options = Constants.jwtOptions;
    const secret = process.env.JWT_SECRET;

    try {
      req.decoded = jwt.verify(token, secret, options);
      next();
    } catch (err) {
      throw new Error(err);
    }
  } else {
    return res.status(Constants.response.unauthorized)
      .send({
        status: Constants.response.unauthorized,
        error: 'Authentication error. Token required.',
      });
  }
};

// eslint-disable-next-line consistent-return
const validateInteger = (req, res, next) => {
  const id = req.params.tripId || req.params.bookingId;

  if (isIntegerNumber(id * 1)) next();
  else {
    return res.status(400).send({ status: 400, error: 'ID must be of type integer' });
  }
};

// eslint-disable-next-line consistent-return
const validateLoginInputs = (req, res, next) => {
  const { email, password } = req.body;

  if (
    noSpaceString(email)
    && noSpaceString(password)
  ) {
    next();
  } else {
    return res.status(400).send({ status: 400, error: 'Fields are not good' });
  }
};

// eslint-disable-next-line consistent-return
const validateRegisterInputs = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    email, first_name, last_name, password,
  } = req.body;

  if (
    noSpaceString(first_name)
    && noSpaceString(last_name)
    && noSpaceString(email)
    && noSpaceString(password)
  ) {
    next();
  } else {
    return res.status(400).send({ status: 400, error: 'Fields are not good' });
  }
};

const validateCreateTripInputs = (req, res, next) => {
  const {
    seating_capacity,
    bus_license_number,
    origin, destination,
    trip_date,
    fare,
  } = req.body;

  if (
    isIntegerNumber(seating_capacity)
    && typeof bus_license_number === 'string'
    && typeof origin === 'string'
    && typeof destination === 'string'
    && typeof trip_date.getMonth === 'function'
    && isFloatNumber(fare)
  ) {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: 'Fields are not good',
      });
  }
};


const validatePermission = (allowed) => {

  return (req, res, next) => {

    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    const userId = decoded.user_id;
    const isAdmin = decoded.is_admin;
    const bookings = require('../data/bookings.json');
    const requestedBooking = bookings.filter(b => b.id === req.params.bookingId * 1)[0];

    if (isAdmin && allowed === 'admin' || !isAdmin && allowed === 'user') {
      next();
    } else if (!isAdmin && allowed === 'owner' && !!requestedBooking && requestedBooking.user_id === userId) {
      next();
    } else {
      res.status(403)
        .send({
          status: 403,
          error: 'Unauthorized action'
        });
    }
  }
};

const validateCreateBookingInputs = (req, res, next) => {

  const { trip_id, user_id } = req.body;

  if (typeof trip_id === 'number' && typeof user_id === 'number') {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: 'Fields are not good'
      });
  }
};

export {
  validateAuthToken,
  validateLoginInputs,
  validateRegisterInputs,
  validateCreateTripInputs,
  validateInteger,
  validatePermission,
  validateCreateBookingInputs
};
