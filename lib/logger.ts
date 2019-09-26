import moment = require("moment");

const winston = require("winston");

const level = process.env.LOG_LEVEL || 'debug';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: level,
            timestamp: function () {
                return moment().format('YYYY-MM-DD hh:mm:ss').trim();
            }
        })
    ]
});