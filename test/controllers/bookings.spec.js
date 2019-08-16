// import Server from '../../server';
// import { adminPayload, jwt, options, request, secret, should, userPayload } from '../common';
//
// describe('Bookings', () => {
//
//   const userToken = jwt.sign(userPayload, secret, options);
//   const adminToken = jwt.sign(adminPayload, secret, options);
//   it('======================================', () => {});
//
//   context('User is authenticated', () => {
//     it('should create a new booking', done => {
//
//       request(Server)
//         .post(`${process.env.API_BASE}/bookings`)
//         .send({
//           'trip_id': 2,
//           'user_id': 2
//         })
//         .set('Authorization', 'Bearer ' + userToken)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.redirects.length.should.eql(0);
//           res.status.should.eql(201);
//           res.body.should.include.keys('status', 'data');
//           res.body.data.should.be.an('object');
//           res.body.status.should.be.a('number');
//           res.body.status.should.eql(201);
//           done();
//         });
//     });
//   });
//
//   context('Admin and User can see bookings list', () => {
//
//     it('should get all bookings for Admin', done => {
//       request(Server)
//         .get(`${ process.env.API_BASE }/bookings`)
//         .set('Authorization', 'Bearer ' + adminToken)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.redirects.length.should.eql(0);
//           res.status.should.eql(200);
//           res.body.should.include.keys('status', 'data');
//           res.body.data.should.be.an('array');
//           res.body.status.should.be.a('number');
//           res.body.status.should.eql(200);
//           done();
//         })
//     });
//
//     it('should get all their bookings for User', done => {
//       request(Server)
//         .get(`${ process.env.API_BASE }/bookings`)
//         .set('Authorization', 'Bearer ' + userToken)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.redirects.length.should.eql(0);
//           res.status.should.eql(200);
//           res.body.should.include.keys('status', 'data');
//           res.body.data.should.be.an('array');
//           res.body.status.should.be.a('number');
//           res.body.status.should.eql(200);
//           done()
//         })
//     });
//   });
//
//   context('User authenticated and is the owner of booking', () => {
//     it('should delete a booking by id', done => {
//       request(Server)
//         .delete(`${process.env.API_BASE}/bookings/4`)
//         .set('Accept', 'application/json')
//         .set('Authorization', 'Bearer ' + userToken)
//         .end((err, res) => {
//           should.not.exist(err);
//           res.redirects.length.should.eql(0);
//           res.status.should.eql(200);
//           res.body.should.include.keys('status', 'data');
//           res.body.data.should.be.an('string');
//           res.body.status.should.be.a('number');
//           res.body.status.should.eql(200);
//           done();
//         });
//     });
//   });
// });
