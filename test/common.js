// eslint-disable-next-line global-require
export const request = require('supertest');
export const writeJSONFile = require('../server/api/helpers/helpers').writeJSONFile;
export const adminLoginUser = {
  email: 'user1@site.com',
  password: 'password'
};
// eslint-disable-next-line global-require
export const chai = require('chai');

export const should = chai.should();
export const { expect } = chai;
// eslint-disable-next-line global-require
export const httpMocks = require('node-mocks-http');

export const res = httpMocks.createResponse();
