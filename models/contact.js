const { firedb } = require('../firebase/firebase');
const _ = require('lodash');

const ContactSchema = {
    dob: {},
    cell: {},
    email: {},
    gender: {},
    location: {
        street: {},
        city: {},
        postcode: {},
        state: {},
    },
    name: {
        first: {},
        last: {},
        title: {}
    },
    nat: {},
    phone: {},
    picture: {
        large: {},
        medium: {},
        thumbnail: {}
    }
}

const Contact = function (data) {
    this.data = this.sanitize(data);
}

Contact.prototype.data = {};

Contact.prototype.save = function () {
    let contact = this.data;

    return new Promise((resolve, reject) => {
        firedb.ref('CONTACTS').push(contact).then(newItem => {
            contact.externalId = newItem.key;
            resolve(contact);
        }, error => {
            reject('Unable to save to firebase');
        });
    });
};

Contact.prototype.sanitize = function (data) {
    data = data || {};
    return _.pick(_.defaults(data, ContactSchema), _.keys(ContactSchema));
}

module.exports = { Contact };