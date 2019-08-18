import * as jwt from 'jsonwebtoken';
import { Constants } from '../helpers/constants';
import { responseObj } from '../helpers/helpers';

const Joi = require('@hapi/joi');

const validName = Joi.string()
  .regex(/^([a-zA-Z]+\s)*[a-zA-Z]+$/)
  .min(3)
  .max(30)
  .required();

const validEmail = Joi.string()
  .email()
  .required();

const validPassword = Joi.string()
  .regex(/^[a-zA-Z0-9:.,?!@]{3,30}[#$^]?$/) // letter, number, sign min 3 max 30
  .required();

const validateAuthToken = (req, res, next) => {

  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const options = Constants.jwtOptions;
    const secret = process.env.JWT_SECRET;

    try {
      jwt.verify(token, secret, options, function (err, decoded) {
        if (err) {
          return res.status(Constants.response.unauthorized)
            .send(responseObj('error', Constants.response.unauthorized, 'Authentication error, ' + err.message));
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    return res.status(Constants.response.unauthorized)
      .send(responseObj('error', Constants.response.unauthorized, 'Authentication error, token required.'));
  }
};

const validateInteger = (req, res, next) => {
  const id = req.params['tripId'] || req.params['bookingId'];
  const data = { id };
  const schema = Joi.object()
    .keys({

      id: Joi.number()
        .greater(0)
        .less(1000000000000)
        .integer()
        .positive()
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(Constants.response.unprocessableEntry)
        .send(responseObj('error', Constants.response.unprocessableEntry, 'Invalid id' + data.id));
    } else {
      next();
    }
  });
};

const validateLoginInputs = (req, res, next) => {

  const data = req.body;

  const schema = Joi.object()
    .keys({
      email: validEmail,
      password: validPassword
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(Constants.response.unprocessableEntry)
        .send(responseObj('error', Constants.response.unprocessableEntry, 'Invalid email or password'));
    } else {
      next();
    }
  });
};

const validateRegisterInputs = (req, res, next) => {

  const data = req.body;

  const schema = Joi.object()
    .keys({
      email: validEmail,
      first_name: validName,
      last_name: validName,
      password: validPassword
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(Constants.response.unprocessableEntry)
        .send(responseObj('error', Constants.response.unprocessableEntry, 'Invalid request data'));
    } else {
      next();
    }
  });
};
// eslint-disable-next-line consistent-return
const validateCreateTripInputs = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object()
    .keys({

      seating_capacity: Joi.number()
        .integer()
        .positive(),

      bus_license_number: Joi.string()
        .min(7)
        .max(7)
        .regex(/^([A-Z0-9]+\s)*[A-Z0-9]+/)
        .required(),

      origin: Joi.string()
        .min(3)
        .max(30)
        .required(),

      destination: Joi.string()
        .min(3)
        .max(30)
        .required(),

      trip_date: Joi.string()
        .required(),

      fare: Joi.number()
        .integer()
        .required(),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(Constants.response.unprocessableEntry)
        .send(responseObj('error', Constants.response.unprocessableEntry, 'Invalid request data'));
    } else {
      next();
    }
  });
};

const validateCreateBookingInputs = (req, res, next) => {
  const data = req.body;
  const schema = Joi.object()
    .keys({
      trip_id: Joi.number()
        .greater(0)
        .less(40)
        .integer()
        .positive(),

      seat_number: Joi.number()
        .greater(0)
        .less(40)
        .integer()
        .positive()
    });
  Joi.validate(data, schema, (err, value) => {
    if (err) {
      return res.status(Constants.response.unprocessableEntry)
        .send(responseObj('error', Constants.response.unprocessableEntry, 'Invalid request data'));
    } else {
      next();
    }
  });
};

export {
  validateAuthToken,
  validateLoginInputs,
  validateRegisterInputs,
  validateCreateTripInputs,
  validateInteger,
  validateCreateBookingInputs
};
