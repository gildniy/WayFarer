import * as jwt from 'jsonwebtoken';
import {
  isEmailString,
  isNoSpaceString,
  isPositiveIntegerNumber,
  isPw4Minlen1Alp1Num,
} from '../helpers/helpers';
import { Constants } from '../helpers/constants';

// eslint-disable-next-line consistent-return
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

  if (isPositiveIntegerNumber(id * 1)) {
    next();
  } else {
    return res.status(Constants.response.badRequest)
      .send({
        status: Constants.response.badRequest,
        error: 'ID must be of type integer',
      });
  }
};

// eslint-disable-next-line consistent-return
const validateLoginInputs = (req, res, next) => {
  const { email, password } = req.body;

  if (
    isEmailString(email) &&
    isPw4Minlen1Alp1Num(password)
  ) {
    next();
  } else {
    return res.status(Constants.response.badRequest)
      .send({
        status: Constants.response.badRequest,
        error: `
        Fields are not good:
        ====================
        email: email string;
        password: no space string, min 4, min-len-alpha 1, min-len-numeric 1;
        `,
      });
  }
};

// eslint-disable-next-line consistent-return
const validateRegisterInputs = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    email, first_name, last_name, password,
  } = req.body;

  if (
    isNoSpaceString(first_name, 3, 20)
    && isNoSpaceString(last_name, 3, 20)
    && isEmailString(email)
    && isPw4Minlen1Alp1Num(password)
  ) {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: `
        Fields are not good:
        ====================
        first_name: no space string, min 3, max 20;
        last_name: no space string, min 3, max 20;
        email: email string;
        password: no space string, min 4, min-len-alpha 1, min-len-numeric 1;
        `,
      });
  }
};
// eslint-disable-next-line consistent-return
const validateCreateTripInputs = (req, res, next) => {
  const {
    // eslint-disable-next-line camelcase
    seating_capacity,
    // eslint-disable-next-line camelcase
    bus_license_number,
    origin,
    destination,
    // eslint-disable-next-line camelcase
    trip_date,
    fare,
  } = req.body;

  if (
    seating_capacity >= 10 && seating_capacity <= 100
    // eslint-disable-next-line camelcase
    && isNoSpaceString(bus_license_number, 7, 7)
    && typeof origin === 'string' && (origin.trim()).length >= 2 && (origin.trim()).length <= 20
    && typeof destination === 'string' && (destination.trim()).length >= 2 && (destination.trim()).length <= 20
    && typeof trip_date.getMonth === 'function'
    && typeof fare > 0 && fare <= 10000
  ) {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: `
        Fields are not good:
        ====================
        seating_capacity: integer, min 10, max 100;
        bus_license_number: no space string, min 7, max 7;
        origin: no space string, min 2, max 20;
        destination: no space string, min 2, max 20;
        trip_date: date;
        fare: integer, min 100, max 10000;
        `,
      });
  }
};


const validatePermission = allowed => (req, res, next) => {

  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = authHeader.split(' ')[1];
  const decoded = jwt.decode(token);
  const userId = decoded.user_id;
  const isAdmin = decoded.is_admin;
  // eslint-disable-next-line global-require
  const bookings = require('../data/bookings.json');
  const requestedBooking = bookings.filter(b => b.id === req.params.bookingId * 1)[0];

  // eslint-disable-next-line no-mixed-operators
  if (isAdmin && allowed === 'admin' || !isAdmin && allowed === 'user') {
    next();
  } else if (!isAdmin && allowed === 'owner' && !!requestedBooking && requestedBooking.user_id === userId) {
    next();
  } else {
    res.status(403)
      .send({
        status: 403,
        error: 'Unauthorized action',
      });
  }
};
// eslint-disable-next-line consistent-return
const validateCreateBookingInputs = (req, res, next) => {

  // eslint-disable-next-line camelcase
  const { trip_id, seat_number } = req.body;

  if (
    typeof trip_id === 'number' && trip_id > 0 && trip_id <= 1000 &&
    typeof seat_number === 'number' && seat_number > 0 && seat_number <= 100
  ) {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: `
        Fields are not good:
        ====================
        trip_id: integer, min 1, max 1000;
        seat_number: integer, min 1, max 100;
        `,
      });
  }
};

const validateOriginDestinationQuery = (req, res, next) => {
  const parseQs = req.query;
  const origin = parseQs.hasOwnProperty('origin') && parseQs.origin;
  const destination = parseQs.hasOwnProperty('destination') && parseQs.destination;
  if ((
    !isNoSpaceString(origin) !== !isNoSpaceString(destination) && (
      (origin.trim()).length >= 2 && (origin.trim()).length <= 20 ||
      (destination.trim()).length >= 2 && (destination.trim()).length <= 20
    )) || !origin && !destination) {
    next();
  } else {
    return res.status(400)
      .send({
        status: 400,
        error: `
        Fields are not good:
        ====================
        origin: optional no space string, min 2, max 20;
        destination: optional no space string, min 2, max 20;
        `,
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
  validateCreateBookingInputs,
  validateOriginDestinationQuery
};
