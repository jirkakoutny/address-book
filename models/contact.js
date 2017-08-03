const mongoose = require('mongoose');
var { firedb } = require('../firebase/firebase');
const validator = require('validator');
const _ = require('lodash');

var ContactSchema = new mongoose.Schema(
    {
        externalId: {
            type: String,
            trim: true,
        },
        name: {
            first: String,
            last: String
        },
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

    return _.omit(ContactObject, ['_id']);
};

ContactSchema.methods.saveRemote = function (callback) {
    var contact = this;

    console.log('Validator');
    var err = contact.validateSync();
    if (err) {
        callback(null, err);
        return;
    }

    firedb.ref('CONTACTS').push(contact.toJSON()).then(newItem => {
        contact.externalId = newItem.key;
        callback(contact);
    }, error => {
        callback(null, new Error('Unable to save to firebase'));
    });
};

var Contact = mongoose.model('Contact', ContactSchema);

module.exports = { Contact }