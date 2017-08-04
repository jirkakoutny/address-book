const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const mongoose = require('mongoose');
const validator = require('validator');

const { Constants } = require('../constants');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            minlength: 3,
            validate: {
                validator: (value) => validator.isEmail(value),
                message: '{VALUE} is not a valid email'
            }
        },
        password: {
            type: String,
            require: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                require: true
            },
            token: {
                type: String,
                require: true
            }
        }]
    }
);

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = Constants.authHeader;
    const token = jwt.sign(
        {
            _id: user._id.toHexString(),
            access
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_VALIDITY }).toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    const User = this;

    return User.findOne({
        'tokens.token': token,
        'tokens.access': Constants.authHeader
    });
};

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.removeToken = function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({ email }).then((user) => {
        return new Promise((resolve, reject) =>
            bcrypt.compare(password, user.password, (err, res) =>
                res ? resolve(user) : reject())
        );
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = { User }