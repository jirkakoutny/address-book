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
    const User = this;
    const userObject = User.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    const User = this;

    const access = Constants.authHeader;
    const token = jwt.sign(
        {
            _id: User._id.toHexString(),
            access
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_VALIDITY }).toString();

    User.tokens.push({ access, token });

    return User.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function (token) {
    const User = this;

    return User.update({
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

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({ email }).then((user) => {

        const invalidCredentials = {
            msg: "Invalid credentials"
        };

        if (!user)
            return Promise.reject(invalidCredentials); // no user for given email

        return new Promise((resolve, reject) =>
            bcrypt.compare(password, user.password, (err, res) =>
                res ? resolve(user) : reject(invalidCredentials)) // bad password
        );
    });
};

UserSchema.pre('save', function (next) {
    const User = this;

    if (User.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(User.password, salt, (err, hash) => {
                User.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// UserSchema.post('save', (error, res, next) => {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         next(_.omit(error.toJSON(), ['op']));   // omit ID of duplicit record
//     } else {
//         next(error);
//     }
// });

const User = mongoose.model('User', UserSchema);

module.exports = { User }