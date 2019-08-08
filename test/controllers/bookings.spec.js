import Server from '../../server';
import { jwt, options, request, secret, should, userPayload, adminPayload, writeJSONFile } from '../common';

const filename = '../data/bookings.json';
let bookings = require('../../server/api/data/bookings.json');

describe('Bookings', () => {

  const userToken = jwt.sign(userPayload, secret, options);
  const adminToken = jwt.sign(adminPayload, secret, options);
  it('======================================', () => {});

  context('User is authenticated', () => {
    it('should create a new booking', done => {

      request(Server)
        .post(`${process.env.API_BASE}/bookings`)
        .send({
          'trip_id': 3,
          'user_id': 2
        })
        .set('Authorization', 'Bearer ' + userToken)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(201);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('string');
          res.body.status.should.eql('success');
          done();
        });
    });
    after(() => {
      // Remove the newly created booking
      bookings.pop();
      writeJSONFile(filename, bookings);
    });
  });

  context('Admin and User can see bookings list', () => {

    it('should get all bookings for Admin', done => {
      request(Server)
        .get(`${ process.env.API_BASE }/bookings`)
        .set('Authorization', 'Bearer ' + adminToken)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('array');
          res.body.status.should.eql('success');
          done();
        })
    });

    it('should get all their bookings for User', done => {
      request(Server)
        .get(`${ process.env.API_BASE }/bookings`)
        .set('Authorization', 'Bearer ' + userToken)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('array');
          res.body.status.should.eql('success');
          done()
        })
    });
  });
});
