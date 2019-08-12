import { Constants } from '../server/api/helpers/constants';
// eslint-disable-next-line global-require
export const request = require('supertest');
// eslint-disable-next-line global-require
export const jwt = require('jsonwebtoken');

export const adminPayload = {
  email: 'user1@site.com',
  is_admin: true,
  user_id: 1,
};
export const userPayload = {
  email: 'user2@site.com',
  is_admin: false,
  user_id: 2,
};
export const userWithNoBookingPayload = {
  email: 'user3@site.com',
  is_admin: false,
  user_id: 3,
};
export const options = Constants.jwtOptions;
export const secret = process.env.JWT_SECRET || 'secretKey123456';
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
// eslint-disable-next-line global-require
export const { writeJSONFile } = require('../server/api/helpers/helpers');
export const res = httpMocks.createResponse();
export const usersFilename = '../data/users.json';
export const users = require('../server/api/data/users.json');
export const tripsFilename = '../data/trips.json';
export const trips = require('../server/api/data/trips.json');
export const bookingsFilename = '../data/bookings.json';
export const bookings = require('../server/api/data/bookings.json');
