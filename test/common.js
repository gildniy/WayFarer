import Server from '../server';
import { Constants } from '../server/api/helpers/constants';
// eslint-disable-next-line global-require
export const request = require('supertest');

export const jwt  = require('jsonwebtoken');

export const adminPayload = {
  email: 'user1@site.com',
  is_admin: true,
  user_id: 1,
};
export const options = Constants.jwtOptions;
export const secret = process.env.JWT_SECRET;
export const adminLoginUser = {
  email: 'user1@site.com',
  password: 'password',
};
// eslint-disable-next-line global-require
export const chai = require('chai');

export const should = chai.should();
export const { expect } = chai;
// eslint-disable-next-line global-require
export const httpMocks = require('node-mocks-http');
export const { writeJSONFile } = require('../server/api/helpers/helpers');

export const res = httpMocks.createResponse();
export const loginUserToken = loginObject => new Promise(resolve => {
  request(Server)
    .post(`${process.env.API_BASE}/auth/signin`)
    .send(loginObject)
    .end((err, res) => {
      resolve(res.body.data ? res.body.data.token : '');
    });
});
