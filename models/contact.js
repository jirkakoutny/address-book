const mongoose = require('mongoose');
var { firedb } = require('../firebase/firebase');
const validator = require('validator');
const _ = require('lodash');

var ContactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            validate: {
                validator: (value) => validator.isEmail(value),
                message: '{VALUE} is not a valid email'
            }
        }
    }
);

ContactSchema.methods.toJSON = function () {
    var Contact = this;
    var ContactObject = Contact.toObject();

    return _.pick(ContactObject, ['email', 'created']);
};

ContactSchema.methods.save = function (callback) {
    var contact = this;

    firedb.ref('CONTACTS').push(contact.toJSON(), (error) => {
        if (error)
            callback();
    }).then(newItem => {
        callback({ id: newItem.key });
    }).catch(e => {
        callback();
    });


};

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact }