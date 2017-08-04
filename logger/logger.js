const fs = require('fs')
const morgan = require('morgan')
const path = require('path');
const rfs = require('rotating-file-stream')

const logDirectory = path.join(__dirname, '../log');

console.log(`Initializing Morgan to ${logDirectory}`);

fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

const accessLogStream = rfs('access.log', {
    size: '10M',
    interval: '1h',
    path: logDirectory,
})

const logger = morgan('tiny', { stream: accessLogStream });

module.exports = { logger }