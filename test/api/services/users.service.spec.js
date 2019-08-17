import Server from '../../../server';
import { adminLoginUser, request, should } from '../../common';

describe('POST /auth/signup', () => {
  context('User already exists', () => {
    it('should fail to register the user with 409 status code', (done) => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signup`)
        .send({
          email: 'user1@site.com',
          password: 'password1@',
          first_name: 'Gedeon',
          last_name: 'Kalisa',
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
          email: 'user100440@site.com',
          password: 'password104400@',
          first_name: 'Dominick',
          last_name: 'Munana',
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
  });
});

describe('POST /auth/signin', () => {
  context('User not found', () => {
    it('should fail to log a user with 404 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signin`)
        .send({
          email: 'bad@test.com',
          password: 'wrong8998',
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

  context('Wrong password or email', () => {
    it('should fail to log a user with 422 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signin`)
        .send({
          email: 'user1@site.com',
          password: 'wrong8998',
        })
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(422);
          res.body.should.include.keys('status', 'error');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(422);
          res.body.error.should.be.a('string');
          done();
        });
    });
  });

  context('User found', () => {
    it('should log in a user with 200 status code', done => {
      request(Server)
        .post(`${process.env.API_BASE}/auth/signin`)
        .send(adminLoginUser)
        .end((err, res) => {
          should.not.exist(err);
          res.redirects.length.should.eql(0);
          res.status.should.eql(200);
          res.body.should.include.keys('status', 'data');
          res.body.data.should.be.an('object');
          res.body.status.should.be.a('number');
          res.body.status.should.eql(200);
          should.exist(res.body.data.token);
          done();
        });
    });
  });
});
