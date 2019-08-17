import {
  adminPayload,
  jwt,
  options,
  request,
  secret,
  should,
  userPayload,
  userWithNoBookingPayload
} from '../../../common';
import Server from '../../../../server';
import L from '../../../../server/common/logger';

describe('api/controllers/bookings/controller.js', () => {

  const userToken = jwt.sign(userPayload, secret, options);
  const adminToken = jwt.sign(adminPayload, secret, options);
  const userWithNoBookingToken = jwt.sign(userWithNoBookingPayload, secret, options);

  // BookingsService#create (Success: 201, Error: 400, 409, 400, 400, 400 )
  context('#bookTrip', () => {

    it('it should get Success with status 201', (done) => {
      L.info('USER TOKEN: ', userToken);
      request(Server)
        .post(`${process.env.API_BASE}/bookings`)
        .send({
          trip_id: 2,
          seat_no: 1
        })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(201);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(201);
          done();
        });
    });
    it('it should get Error with status 400', () => { /*isDesiredSeatAvailable*/
    });
    it('it should get Error with status 409', (done) => { /*!bookingAlreadyExists*/
      request(Server)
        .post(`${process.env.API_BASE}/bookings`)
        .send({
          trip_id: 2,
          seat_no: 1
        })
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(409);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.a('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(409);
          done();
        });
    });
    it('it should get Error with status 400', () => { /*isAnySeatAvailable*/
    });
    it('it should get Error with status 400', () => { /*isTripActive*/
    });
    it('it should get Error with status 400', () => { /*currentTrip*/
    });
  });

// BookingsService#all (Success: 200, Error: 404 )
  context('#showBookings', () => {
    it('it should get Success with status 200', (done) => {
      request(Server)
        .get(`${process.env.API_BASE}/bookings`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('array');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(200);
          done();
        });
    });
    it('it should get Error with status 404', (done) => {
      request(Server)
        .get(`${process.env.API_BASE}/bookings`)
        .set('Authorization', `Bearer ${userWithNoBookingToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.a('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
    });
  });

// BookingsService#delete (Success: 200, Error: 404 )
  context('#deleteBooking', () => {
    it('it should get Success with status 200', (done) => {
      request(Server)
        .delete(`${process.env.API_BASE}/bookings/4`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(200);
          done();
        });
    });
    it('it should get Error with status 404', (done) => {
      request(Server)
        .delete(`${process.env.API_BASE}/bookings/4`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.a('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
    });
  });
});

