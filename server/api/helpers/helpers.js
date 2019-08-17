import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

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

const verifyPassword = (passwordAttempted, hashedPassword) => compareSync(passwordAttempted, hashedPassword);


const decodedToken = req => {
  const authHeaders = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeaders.split(' ')[1];
  return jwt.decode(token);
};

const responseObj = (type, code, message, data = null) => {
  return {
    code: code,
    response: {
      ...{ status: code },
      ...(
        type === 'success' ? {
          message: message,
          data: data
        } : {
          error: message
        }
      )
    }
  };
};

export {
  writeJSONFile,
  hashPassword,
  verifyPassword,
  decodedToken,
  responseObj
};
