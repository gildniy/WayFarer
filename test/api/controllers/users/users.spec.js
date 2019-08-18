import {
  adminLoginUser,
  request,
  should,
  users,
  usersFilename,
  writeJSONFile
} from '../../../common';
import Server from '../../../../server';

describe('api/controllers/users/controller.js', () => {
  // UsersService#create (Success: 201, Error: 409 )
  context('#signupUser', () => {
    it('it should get Success with status 201', (done) => {
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
    it('it should get Error with status 409', (done) => {
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

// UsersService#login (Success: 302, Error: 404 )
  context('#signinUser', () => {
    it('it should get Success with status 302', (done) => {
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
    it('it should get Error with status 404', (done) => {
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

  after(() => {
    // Clean the test user after he was created
    if (users.filter(u => u.email === 'user1000@site.com')[0]) {
      const newUsers = users.filter(u => u.email !== 'user1000@site.com');
      writeJSONFile(usersFilename, newUsers);
    }
  });
});
