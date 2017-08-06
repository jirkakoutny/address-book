var sslRedirect = require('heroku-ssl-redirect');

var ssl = sslRedirect();

module.exports = { ssl }