const jwt = require('jsonwebtoken');

const { Constants } = require('../constants');

let authenticate = (req, res, next) => {
    const token = req.header(Constants.authHeader);
    let decoded;

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
