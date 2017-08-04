const _ = require('lodash');

const { firedb } = require('../firebase/firebase');
const { ContactSchema } = require('./schemas/contactSchema');

const Contact = function (data, creator) {
    this.data = this.sanitize(data);
    this.data.creator = creator;
}

Contact.prototype.save = function () {
    let contact = this.data;

    return new Promise((resolve, reject) => {
        firedb.ref('CONTACTS').push(contact).then(newItem => {
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