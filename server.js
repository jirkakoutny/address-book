require('./config/config');

const _ = require('lodash');
const fs = require('fs')
const express = require('express');
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Contact } = require('./models/contact');
var { authenticate } = require('./middleware/authenticate');

const publicPath = path.join(__dirname, '/public');
const logDirectory = path.join(__dirname, '/log')
const port = process.env.PORT;

var app = express();

app.use(express.static(publicPath));
app.use(bodyParser.json());


fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = rfs('access.log', {
    size: '10M',
    interval: '1d', // rotate daily 
    path: logDirectory,
})
app.use(morgan('tiny', { stream: accessLogStream }))

app.post('/users', async (req, res) => {
    try {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
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
        res.header('x-auth', token).send(user);
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

app.post('/contacts', authenticate, (req, res) => {
    try {
        const body = _.pick(req.body, ['email']);
        const contact = new Contact(body);

        console.log(contact);

        contact.saveRemote((contact, error) => {

            if (error)
                throw error;

            res.send(contact);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.listen(port, () => { console.log(`Server is up on ${port}`) });

module.exports = { app };