import Server from '../../server';
import { jwt, options, request, secret, should, userPayload, writeJSONFile } from '../common';

const filename = '../data/bookings.json';
let bookings = require('../../server/api/data/bookings.json');

describe('Bookings', () => {

  const userToken = jwt.sign(userPayload, secret, options);
  it('======================================', () => {});

  context('User is authenticated', () => {
    //  BOOKING CREATED
    it('should create a new booking', done => {

      request(Server)
        .post(`${process.env.API_BASE}/bookings`)
        .send({
          'trip_id': 2,
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
});
