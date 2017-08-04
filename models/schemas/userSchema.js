const mongoose = require('mongoose');
const validator = require('validator');

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

module.exports = { UserSchema };