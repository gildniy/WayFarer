import Server from '../../server';
import { adminPayload, jwt, options, request, secret, writeJSONFile } from '../common';

const filename = '../data/trips.json';
const trips = require('../../server/api/data/trips.json');

describe('POST /auth/trips', () => {

  const adminToken = jwt.sign(adminPayload, secret, options);

  context('User is authenticated', () => {
    it('should add a new trip', () => request(Server)
      .post(`${process.env.API_BASE}/trips`)
      .send({
        seating_capacity: 40,
        bus_license_number: '111',
        origin: 'AAAA',
        destination: 'BBBB',
        trip_date: '2019-07-18',
        fare: 1.328e+22,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        // should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.body.should.include.keys('status', 'data');
        res.body.data.should.be.an('object');
        res.body.status.should.be.a('string');
        res.body.status.should.eql('success');
      }));

    after('Reset the previous trips states.', () => {
      const trips$ = trips.filter(t => t.origin !== 'AAAA' && t.destination !== 'BBBB');
      writeJSONFile(filename, trips$);
    });
  });
});
