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
    console.error(err);
  }
};

const hashPassword = pw => {
  const salt = genSaltSync(12);
  return hashSync(pw, salt);
};

// eslint-disable-next-line no-bitwise
const noSpaceString = value => typeof value === 'string' && !~value.indexOf(' ');

const isIntegerNumber = value => Math.floor(value) === value;

const verifyPassword = (passwordAttempted, hashedPassword) => compareSync(passwordAttempted, hashedPassword);

const scientificToDecimal = n => {
  const n$ = n.toString();

  if (~n$.indexOf('e') || ~n$.indexOf('E')) {
    const [lead, decimal, pow] = n$.split(/[eE]|\./);

    return +pow <= 0
      ? `0.${'0'.repeat(Math.abs(pow) - 1)}${lead}${decimal}`
      : lead + (

      +pow >= decimal.length
        ? (decimal + '0'.repeat(+pow - decimal.length))
        : (`${decimal.slice(0, +pow)}.${decimal.slice(+pow)}`)
    );
  }

  return n;
};

const isFloatNumber = value => {
  const float = /^([0-9]*[.])?[0-9]+$/;
  return float.test(scientificToDecimal(value));
};

export {
  getNewId,
  newDate,
  writeJSONFile,
  hashPassword,
  noSpaceString,
  isIntegerNumber,
  verifyPassword,
  isFloatNumber,
};
