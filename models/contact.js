const _ = require('lodash');

const { firedb } = require('../firebase/firebase');

const ContactsCollectionId = 'Contacts';

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

const Contact = function (data, creator) {
    this.data = this.sanitize(data);
    this.data.creator = creator;
}

Contact.prototype.save = function () {
    let contact = this.data;

    return new Promise((resolve, reject) => {
        firedb.ref(ContactsCollectionId).push(contact).then(newItem => {
            contact.externalId = newItem.key;
            resolve(_.omit(contact, ['creator']));
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