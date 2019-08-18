import {
  adminPayload,
  jwt,
  options,
  request,
  secret,
  should,
  trips,
  tripsFilename,
  userPayload,
  writeJSONFile
} from '../../../common';
import Server from '../../../../server';

describe('api/controllers/trips/controller.js', () => {

  const adminToken = jwt.sign(adminPayload, secret, options);
  const userToken = jwt.sign(userPayload, secret, options);

  // TripsService#create (Success: 200, Error: 409 )
  context('#createTrip', () => {
    it('it should get Success with status 200', (done) => {
      request(Server)
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
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(200);
          done();
        });
    });
    it('it should get Error with status 409', (done) => {
      request(Server)
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
  });

  // TripsService#edit (Success: 200, Error: 404 )
  context('#cancelTrip', () => {
    it('it should get Success with status 200', (done) => {
      request(Server)
        .patch(`${process.env.API_BASE}/trips/1/cancel`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
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
        .patch(`${process.env.API_BASE}/trips/1/cancel`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(405);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(405);
          done();
        });
    });
    it('it should get Error with status 404', (done) => {
      request(Server)
        .patch(`${process.env.API_BASE}/trips/1000/cancel`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
    });
  });

  // TripsService#all (Success: 200, 404 )
  context('#showTrips', () => {
    it('it should get Success with status 200', (done) => {
      request(Server)
        .get(`${process.env.API_BASE}/trips`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
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
      const trips$ = JSON.parse(JSON.stringify(trips));
      writeJSONFile(tripsFilename, []);
      request(Server)
        .get(`${process.env.API_BASE}/trips`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
      !trips.length && writeJSONFile(tripsFilename, trips$);
    });
    it('it should get Success with status 200', (done) => {
      request(Server)
        .get(`${process.env.API_BASE}/trips?origin=A`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
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
        .get(`${process.env.API_BASE}/trips?origin=B`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
    });
    it('it should get Success with status 200', (done) => {
      request(Server)
        .get(`${process.env.API_BASE}/trips?destination=B`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
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
        .get(`${process.env.API_BASE}/trips?destination=A`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.error.should.be.an('string');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          done();
        });
    });
  });

  after('', () => {
    const canceledTrip = trips.filter(u => u.id === 1)[0];
    if (!!canceledTrip && canceledTrip.status === 0) canceledTrip.status = 1;
    const trips$ = trips.filter(t => t.origin !== 'AAAA' && t.destination !== 'BBBB');
    writeJSONFile(tripsFilename, trips$);
  });
});
