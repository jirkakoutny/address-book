const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Constants } = require('../constants');
const { User } = require('./../models/user');
const { users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /users', () => {
  it('should create a user', (done) => {
    const email = 'example@example.com';
    const password = 'test123!';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect((res) => {
        expect(res.headers[Constants.authHeader]).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err)
          return done(err);

        User.findOne({ email }).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    const email = 'abc';
    const password = 'test';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    const password = 'test';

    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: password
      })
      .expect(400)
      .end(done);
  });
});


describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers[Constants.authHeader]).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: Constants.authHeader,
            token: res.headers[Constants.authHeader]
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'x'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers[Constants.authHeader]).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set(Constants.authHeader, users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set(Constants.authHeader, users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('POST /contacts', () => {
  it('should create a contact if authenticated', (done) => {
    const contact = {
      "cell": "697-968-088",
      "dob": "1968-08-12",
      "email": "dummy.contact@example.com",
      "gender": "male",
      "location": {
        "city": "valladolid",
        "postcode": 33179,
        "state": "comunidad de madrid",
        "street": "2562 avenida de burgos"
      },
      "name": {
        "first": "manuel",
        "last": "cortes",
        "title": "mr"
      },
      "nat": "CZE",
      "phone": "978-118-814",
      "picture": {
        "large": "https://randomuser.me/api/portraits/men/92.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/92.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/92.jpg"
      },
    };

    request(app)
      .post('/contacts')
      .send(contact)
      .set(Constants.authHeader, users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.externalId).toExist();
        expect(res.body.creator).toNotExist();
        expect(res.body.email).toBe(contact.email);
      })
      .end(done);
  });

  it('should not create a contact if not authenticated', (done) => {
    const email = 'example@example.com';

    request(app)
      .post('/contacts')
      .send({ email })
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});