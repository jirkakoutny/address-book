console.log("Starting up STRV Backend Test Project - Addressbook");

require('./config/config');

const bodyParser = require('body-parser');
const fs = require('fs')
const express = require('express');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const path = require('path');

const { authenticate } = require('./middleware/authenticate');
const { Constants } = require('./constants');
const { mongoose } = require('./db/mongoose');

const { logger } = require('./logger/logger');
const { limiter } = require('./rate-limiter/rate-limiter');
const { ssl } = require('./ssl-redirect/ssl-redirect');

const { Contact } = require('./models/contact');
const { User } = require('./models/user');

const app = express();

app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc) 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(limiter); 
app.use(logger);
app.use(ssl);

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header(Constants.authHeader, token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/users/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByToken(req.token);
        res.send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        res.header(Constants.authHeader, token).send(user);
    } catch (e) {
        res.status(400).send();
    }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
    try {
        const user = await User.findByToken(req.token);
        await user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
});

app.post('/contacts', authenticate, async (req, res) => {
    try {
        const contact = await new Contact(req.body, req.userid).save();
        res.send(contact);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.listen(process.env.PORT, () => console.log(`Server is up on ${process.env.PORT}`) );

module.exports = { app };