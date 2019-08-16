import Server from '../server';
import { Constants } from '../server/api/helpers/constants';
export const request = require('supertest');
export const jwt  = require('jsonwebtoken');

export const adminPayload = {
  email: 'user1@test.com',
  is_admin: true,
  user_id: 1,
};
export const userPayload = {
  email: 'user2@test.com',
  is_admin: false,
  user_id: 2,
};
export const options = Constants.jwtOptions;
export const secret = process.env.JWT_SECRET;
export const adminLoginUser = {
  email: 'user1@test.com',
  password: 'password1@',
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
