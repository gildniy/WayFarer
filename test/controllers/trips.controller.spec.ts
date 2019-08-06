import Server                                                             from '../../server';
import { adminLoginUser, loginUserToken, request, should, writeJSONFile } from "../common.test";

const filename = '../data/trips.json';
let trips = require('../../server/api/data/trips.json');

describe('Trips', () => {

    let adminToken;

    before('Create JWT Token ', done => {
        loginUserToken(adminLoginUser).then(token => adminToken = token);
        done()
    });

    // TODO: Get rid of this
    // ----------STARTS----------
    it('==================================================================', () => {});
    // ----------ENDS------------

    it('should get all trips', done => {
            request(Server)
                .get(`${ process.env.API_BASE }/trips`)
                .set('Accept', 'application/json')
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
        }
    );

    it('should add a new trip', () =>
        request(Server)
            .post(`${ process.env.API_BASE }/trips`)
            .send({
                seating_capacity: 40,
                bus_license_number: "111",
                origin: "AAAA",
                destination: "BBBB",
                trip_date: "2019-07-18",
                fare: 1.328e+22
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminToken)
            .then(res => {
                // should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('object');
                res.body.status.should.be.a('string');
                res.body.status.should.eql('success');
            })
    );

    it('should get a trip by id', () =>
        request(Server)
            .get(`${ process.env.API_BASE }/trips/1`)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminToken)
            .then((res) => {
                // should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('object');
                res.body.status.should.eql('success');
                // done()
            })
    );

    it('should cancel a trip by id', () =>
        request(Server)
            .patch(`${ process.env.API_BASE }/trips/1/cancel`)
            // .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + adminToken)
            .then(res => {
                // should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(200);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('string');
                res.body.data.should.eql('Trip cancelled successfully');
                res.body.status.should.eql('success');
            })
    );

    after('Reset the previous trips states.', () => {
        // Uncancel the cancelled trip
        const canceledTrip = trips.filter(u => u.id == 1)[0];
        if (!!canceledTrip && canceledTrip.status == 0) {
            canceledTrip.status = 1;
        }

        // Remove the last added (in Test)
        const trips$ = trips.filter(t => t.origin !== 'AAAA' && t.destination !== 'BBBB');
        writeJSONFile(filename, trips$);
    });
});
