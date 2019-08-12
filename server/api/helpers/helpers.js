import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

const path = require('path');
const fs = require('fs');

const getNewId = array => {
  if (array.length > 0) {
    return array[array.length - 1].id + 1;
  }
  return 1;
};

const newDate = () => new Date();

const writeJSONFile = (filename, data) => {
  try {
    fs.writeFileSync(path.resolve(__dirname, filename), JSON.stringify(data));
  } catch (err) {
    // eslint-disable-next-line no-console
    // console.error(err);
  }
};

const hashPassword = pw => {
  const salt = genSaltSync(12);
  return hashSync(pw, salt);
};

const isNoSpaceString = (value, min = 0, max = 40) => {
  const re = new RegExp('/^[a-zA-Z0-9\-_]{' + min + ',' + max + '}$/');
  return re.test(value);
};

const isPositiveIntegerNumber = value => Math.floor(value) === value && (value > 0);

// eslint-disable-next-line max-len
const verifyPassword = (passwordAttempted, hashedPassword) => compareSync(passwordAttempted, hashedPassword);

const isEmailString = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email)
    .toLowerCase());
};

const isPw4Minlen1Alp1Num = (pw) => {
  const re = /[a-z]\d|\d[a-z]/i;
  return re.test(pw) && pw.length > 3;
};

export {
  getNewId,
  newDate,
  writeJSONFile,
  hashPassword,
  isNoSpaceString,
  isPositiveIntegerNumber,
  verifyPassword,
  isEmailString,
  isPw4Minlen1Alp1Num
};
