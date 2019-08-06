import Server                                             from '../../server';
import { adminLoginUser, request, should, writeJSONFile } from "../common.test";

const filename = '../data/users.json';
let users = require('../../server/api/data/users.json');

// https://codeburst.io/authenticated-testing-with-mocha-and-chai-7277c47020b7
// https://juffalow.com/javascript/express-server-with-jwt-authentication
// https://blog.khophi.co/mocha-chai-chai-http-test-express-api-auth-endpoints/

// https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
describe('POST /auth/signin', () => {
    // USER NOT FOUND
    it('it responds with 404 status code if user does not exist', done => {
        request(Server)
            .post(`${ process.env.API_BASE }/auth/signin`)
            .send({
                email: 'bad@test.com',
                password: 'wrong'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(404);
                res.body.should.include.keys('status', 'error');
                res.body.status.should.eql('error');
                res.body.error.should.be.a('string');
                done();
            });
    });
    // // SUCCESS
    it('it responds with 302 status code if user is logged in', done => {
        request(Server)
            .post(`${ process.env.API_BASE }/auth/signin`)
            .send(adminLoginUser)
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(302);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('object');
                res.body.status.should.eql('success');
                should.exist(res.body.data.token);
                done();
            });
    });
});

describe('POST /auth/signup', () => {

    // USER ALREADY EXISTS
    it('it responds with 409 status code if user already exists', done => {
        request(Server)
            .post(`${ process.env.API_BASE }/auth/signup`)
            .send({
                email: 'user1@site.com',
                password: 'password',
                first_name: 'fuser1',
                last_name: 'luser1'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(409);
                res.body.should.include.keys('status', 'error');
                res.body.status.should.eql('error');
                res.body.error.should.be.a('string');
                done();
            });
    });
    // SUCCESS
    it('it responds with 201 status code if user was registered', done => {
        request(Server)
            .post(`${ process.env.API_BASE }/auth/signup`)
            .send({
                email: 'user1000@site.com',
                password: 'password',
                first_name: 'fuser1000',
                last_name: 'luser1000'
            })
            .end((err, res) => {
                should.not.exist(err);
                res.redirects.length.should.eql(0);
                res.status.should.eql(201);
                res.body.should.include.keys('status', 'data');
                res.body.data.should.be.an('object');
                res.body.status.should.eql('success');
                should.exist(res.body.data.token);
                done();
            });
    });

    after(() => {
        // Clean the test user atfer he was created
        if (!!users.filter(u => u.email == 'user1000@site.com')[0]) {
            const newUsers = users.filter(u => u.email !== 'user1000@site.com');
            writeJSONFile(filename, newUsers);
        }
    });
});

