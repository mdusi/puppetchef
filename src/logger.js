const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format

const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level.toUpperCase()}: ${message}`
})

/**
 * The logger instance for the application.
 *
 * @type {Logger}
 */
const logger = createLogger({
    level: 'debug',
    format: combine(timestamp(), customFormat),
    defaultMeta: { service: 'puppetchef' },
    transports: [
        new transports.File({
            filename: process.env.PUPPETCHEF_DEBUG 
                ? (process.env.PUPPETCHEF_LOGFILE || 'puppetchef.log') 
                : '/dev/null',
            maxsize: 1024 * 1024 * 10,
            maxFiles: 3,
        }),
    ],
})

module.exports = {
    logger,
}
