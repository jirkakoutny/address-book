const jwt = require('jsonwebtoken');

const { Constants } = require('../constants');

let authenticate = (req, res, next) => {
    const token = req.header(Constants.authHeader);
    let decoded;

    try {
        if (!token)
            throw new Error();

        let decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userid = decoded._id;
        req.token = token;

        next();
    } catch (e) {
        res.status(401).send(e);
    }
};

module.exports = { authenticate };
