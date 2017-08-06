const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { Constants } = require('../../constants');
const { User } = require('./../../models/user');

const firstId = new ObjectID();
const secondId = new ObjectID();

const generateToken = (id) =>
  jwt.sign({ _id: id, access: Constants.authHeader }, process.env.JWT_SECRET).toString();

const users = [{
  _id: firstId,
  email: 'test1@example.com',
  password: 'password1',
  tokens: [{
    access: Constants.authHeader,
    token: generateToken(firstId)
  }]
}, {
  _id: secondId,
  email: 'test2@example.com',
  password: 'password2',
  tokens: [{
    access: Constants.authHeader,
    token: generateToken(secondId)
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const firstUser = new User(users[0]).save();
    const secondUser = new User(users[1]).save();

    return Promise.all([firstUser, secondUser])
  }).then(() => done());
};

module.exports = { users, populateUsers };
