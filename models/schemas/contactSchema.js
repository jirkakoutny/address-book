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

module.exports = { ContactSchema };