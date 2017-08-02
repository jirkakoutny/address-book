const jwt = require('jsonwebtoken');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    var decoded;

    try {
        if (!token) {
            throw new Error();
        }

        jwt.verify(token, process.env.JWT_SECRET);
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send();
    }
};

module.exports = { authenticate };
