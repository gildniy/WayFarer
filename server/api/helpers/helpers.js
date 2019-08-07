import { genSaltSync, hashSync } from 'bcryptjs';

const path = require('path');
const fs = require('fs');

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

export {
  writeJSONFile,
  hashPassword,
  noSpaceString,
  isIntegerNumber,
};
