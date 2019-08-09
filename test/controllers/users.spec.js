import Server from '../../server';
import { adminLoginUser, request, should, writeJSONFile } from '../common';

const filename = '../data/users.json';
const users = require('../../server/api/data/users.json');

describe('POST /auth/signup', () => {
  context('User already exists', () => {
    it('should fail to register the user with 409 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signup`)
        .send({
          email: 'user1@site.com',
          password: 'password',
          first_name: 'fuser1',
          last_name: 'luser1',
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(409);
          res.body.should.include.keys('status', 'error');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(409);
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  context('User doesn\'t exist', () => {
    it('should register the user with 201 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signup`)
        .send({
          email: 'user1000@site.com',
          password: 'password',
          first_name: 'fuser1000',
          last_name: 'luser1000',
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(201);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(201);
          should.exist(res.body.data.token);
          done();
        });
    });

    after(() => {
      // Clean the test user atfer he was created
      if (users.filter(u => u.email === 'user1000@site.com')[0]) {
        const newUsers = users.filter(u => u.email !== 'user1000@site.com');
        writeJSONFile(filename, newUsers);
      }
    });
  });
});

describe('POST /auth/signin', () => {
  context('User not found', () => {
    it('should fail to log a user with 404 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signin`)
        .send({
          email: 'bad@test.com',
          password: 'wrong',
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(404);
          res.body.should.include.keys('status', 'error');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(404);
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  context('User found', () => {
    it('should log in a user with 302 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signin`)
        .send(adminLoginUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(302);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(302);
          should.exist(res.body.data.token);
          done();
        });
    });
  });
});
