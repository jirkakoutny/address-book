require('./config/config');

const _ = require('lodash');
const fs = require('fs')
const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');

const { Constants } = require('./constants');

const { User } = require('./models/user');
const { Contact } = require('./models/contact');
const { authenticate } = require('./middleware/authenticate');

const { logger } = require('./logger/logger');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT;

const app = express();

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use(logger);

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

app.listen(port, () => { console.log(`Server is up on ${port}`) });

module.exports = { app };