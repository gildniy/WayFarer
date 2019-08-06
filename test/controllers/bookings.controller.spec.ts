import Server                                                                               from '../../server';
import { adminLoginUser, defaultLoginUser, loginUserToken, request, should, writeJSONFile } from "../common.test";

const filename = '../data/bookings.json';
let bookings = require('../../server/api/data/bookings.json');

describe('Bookings', () => {

    let userToken;
    let adminToken;

    // TODO: Get rid of this
    // ----------STARTS----------
    beforeEach('Create JWT Token ', done => {
        loginUserToken(adminLoginUser).then(token => adminToken = token);
        loginUserToken(defaultLoginUser).then(token => userToken = token);
        done()
    });
    it('==================================================================', () => {});
    it('==================================================================', () => {});
    it('==================================================================', () => {});
    // ----------ENDS------------

    // SUCCESSFUL RETRIEVED BY ADMIN
    it('should get all bookings', done => {
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

    //  SUCCESSFUL RETRIEVED BY DEFAULT USER
    it('should get all user bookings', done => {
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

    //  BOOKING CREATED
    it('should create a new booking', done => {

        request(Server)
            .post(`${ process.env.API_BASE }/bookings`)
            .send({
                "trip_id": 2,
                "user_id": 2
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
            })
    });

    //  SUCCESSFUL DELETED
    it('should delete a booking by id', done => {
        request(Server)
            .delete(`${ process.env.API_BASE }/bookings/4`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + userToken)
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('string');
                res.body.status.should.be.a('string');
                res.body.status.should.eql('success');
                done();
            })
    });

    after(() => {
        // Remove the new created booking
        bookings.pop();
        writeJSONFile(filename, bookings);
    })
});
