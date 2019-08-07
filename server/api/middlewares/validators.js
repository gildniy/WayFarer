import { isIntegerNumber, noSpaceString } from '../helpers/helpers';

// eslint-disable-next-line consistent-return
const validateInteger = (req, res, next) => {
  const id = req.params.tripId || req.params.bookingId;

  if (isIntegerNumber(id * 1)) next();
  else {
    return res.status(400).send({ status: 'error', error: 'ID must be of type integer' });
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
    return res.status(400).send({ status: 'error', error: 'Fields are not good' });
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
    return res.status(400).send({ status: 'error', error: 'Fields are not good' });
  }
};

export {
  validateInteger,
  validateLoginInputs,
  validateRegisterInputs,
};
