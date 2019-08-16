import Server from '../../../server';
import {
  adminPayload,
  jwt,
  options,
  request,
  secret,
  should,
  userPayload
} from '../../common';
//
// describe('POST /trips', () => {
//
//   const adminToken = jwt.sign(adminPayload, secret, options);
//   const userToken = jwt.sign(userPayload, secret, options);
//
//   context('Admin is authenticated', () => {
//     it('should add a new trip', () => request(Server)
//       .post(`${process.env.API_BASE}/trips`)
//       .send({
//         seating_capacity: 40,
//         bus_license_number: '11UEUSA1',
//         origin: 'AAAA',
//         destination: 'BBBB',
//         trip_date: '2019-08-15T20:44:41.519Z',
//         fare: 1000,
//       })
//       .set('Accept', 'application/json')
//       .set('Authorization', `Bearer ${adminToken}`)
//       .then(res => {
//         // should.not.exist(err);
//         // res.redirects.length.should.eql(0);
//         res.status.should.eql(200);
//         // res.body.should.include.keys('status', 'data');
//         // res.body.data.should.be.an('object');
//         // res.body.status.should.be.a('number');
//         // res.body.status.should.eql(200);
//       }));
//     it('should cancel a trip by id', () =>
//       request(Server)
//         .patch(`${process.env.API_BASE}/trips/1/cancel`)
//         // .set('Accept', 'application/json')
//         .set('Authorization', 'Bearer ' + adminToken)
//         .then(res => {
//           // should.not.exist(err);
//           // res.redirects.length.should.eql(0);
//           res.status.should.eql(200);
//           // res.body.should.include.keys('status', 'data');
//           // res.body.data.should.be.an('string');
//           // res.body.data.should.eql('Trip cancelled successfully');
//           // res.body.status.should.be.a('number');
//           // res.body.status.should.eql(200);
//         })
//     );
//   });
//   //
//   // context('User or Admin authenticated', () => {
//   //   it('should get all trips', done => {
//   //       request(Server)
//   //         .get(`${process.env.API_BASE}/trips`)
//   //         .set('Accept', 'application/json')
//   //         .set('Authorization', 'Bearer ' + userToken)
//   //         .end((err, res) => {
//   //           should.not.exist(err);
//   //           res.redirects.length.should.eql(0);
//   //           res.status.should.eql(200);
//   //           res.body.should.include.keys('status', 'data');
//   //           res.body.data.should.be.an('array');
//   //           res.body.status.should.be.a('number');
//   //           res.body.status.should.eql(200);
//   //           done();
//   //         });
//   //     }
//   //   );
//   //
//   //   it('should get a trip by id', () =>
//   //     request(Server)
//   //       .get(`${process.env.API_BASE}/trips/1`)
//   //       .set('Accept', 'application/json')
//   //       .set('Authorization', 'Bearer ' + userToken)
//   //       .then((res) => {
//   //         // should.not.exist(err);
//   //         res.redirects.length.should.eql(0);
//   //         res.status.should.eql(200);
//   //         res.body.should.include.keys('status', 'data');
//   //         res.body.data.should.be.an('object');
//   //         res.body.status.should.be.a('number');
//   //         res.body.status.should.eql(200);
//   //         // done()
//   //       })
//   //   );
//   // });
// });

describe('POST /trips', () => {
  const adminToken = jwt.sign(adminPayload, secret, options);
  const userToken = jwt.sign(userPayload, secret, options);

  context('User is authenticated', () => {
    it('should not be able to add a new trip', () => request(Server)
      .post(`${process.env.API_BASE}/trips`)
      .send({
        seating_capacity: 40,
        bus_license_number: '11UEUSA',
        origin: 'Jhjhjkdasnd',
        destination: 'Hjhdkasd',
        trip_date: '2019-08-15T20:44:41.519Z',
        fare: 1000,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .then(res => {
        res.status.should.eql(403);
        res.body.should.include.keys('status', 'error');
      }));
  });
  context('If trip already exists', () => {
    it('should not be added', () => request(Server)
      .post(`${process.env.API_BASE}/trips`)
      .send({
        seating_capacity: 40,
        bus_license_number: 'RAB574C',
        origin: 'RWAMAGANA',
        destination: 'MUSHUBATI',
        trip_date: '2019-08-15T20:44:41.519',
        fare: 1000,
        status: 1
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(409);
        res.body.should.include.keys('status', 'error');
      }));
  });

    context('Admin is authenticated', () => {
      it('should add a new trip', () => request(Server)
        .post(`${process.env.API_BASE}/trips`)
        .send({
          seating_capacity: 40,
          bus_license_number: 'RAB574C',
          origin: 'RWAMAGANA',
          destination: 'MUSHUBATI',
          trip_date: '2019-08-15T20:44:41.519',
          fare: 1000,
          status: true
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`)
        .then(res => {
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
        }));
    });
});

describe('PATCH /trips/:tripId/cancel', () => {

  const adminToken = jwt.sign(adminPayload, secret, options);
  const userToken = jwt.sign(userPayload, secret, options);

  context('User is authenticated', () => {
    it('should not be able to cancel trip', () => request(Server)
      .patch(`${process.env.API_BASE}/trips/2/cancel`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .then(res => {
        res.status.should.eql(403);
        res.body.should.include.keys('status', 'error');
      }));
  });

  context('ID of inexting trip', () => {
    it('should not be able to cancel trip', () => request(Server)
      .patch(`${process.env.API_BASE}/trips/2000/cancel`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(404);
        res.body.should.include.keys('status', 'error');
      }));
  });

  context('Trip already canceled', () => {
    it('should not be able to be cancel twince', () => request(Server)
      .patch(`${process.env.API_BASE}/trips/1/cancel`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(400);
        res.body.should.include.keys('status', 'error');
      }));
  });


  context('Admin authenticated', () => {
    it('should be able to be cancel a trip', () => request(Server)
      .patch(`${process.env.API_BASE}/trips/1/cancel`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(200);
        res.body.should.include.keys('status', 'error');
      }));
  });
});

describe('GET /trips', () => {
  context('Admin and User', () => {
    it('should be able to view trips', () => request(Server)
      .get(`${process.env.API_BASE}/trips`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(200);
        res.body.should.include.keys('status', 'data');
      }));
  });
});

describe('GET /trips/:tripId', () => {
  context('Admin and User supplying a wrong ID', () => {
    it('should get error ofnot found trips', () => request(Server)
      .get(`${process.env.API_BASE}/trips/500`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(404);
        res.body.should.include.keys('status', 'error');
      }));
  });
  context('Admin and User', () => {
    it('Admin and User supplying a good ID', () => request(Server)
      .get(`${process.env.API_BASE}/trips/3`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminToken}`)
      .then(res => {
        res.status.should.eql(200);
        res.body.should.include.keys('status', 'data');
      }));
  });
});
