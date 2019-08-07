import Server from '../../server';
import { request, should } from '../common';
import { writeJSONFile } from '../../server/api/helpers/helpers';

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
          res.body.status.should.eql('error');
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  context('User doesn\'t exist', () => {
    it('should register the user wiht 201 status code', done => {
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
          res.body.status.should.eql('success');
          should.exist(res.body.data.token);
          done();
        });
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
