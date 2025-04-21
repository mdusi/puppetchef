const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level.toUpperCase()}: ${message}`;
});

/**
 * The logger instance for the application.
 *
 * @type {Logger}
 */
const logger = createLogger({
  format: combine(timestamp(), customFormat),
  defaultMeta: { service: "puppetchef" },
  transports: [
    new transports.File({
      filename: "/dev/null",
    }),
  ],
});

if (process.env.PUPPETCHEF_DEBUG == 1) {
  const transport = process.env.PUPPETCHEF_LOGFILE
    ? new transports.File({
        filename: process.env.PUPPETCHEF_LOGFILE,
        level: "debug",
        maxsize: 1024 * 1024 * 10,
        maxFiles: 3,
      })
    : new transports.Console({
        level: "debug",
      });
  logger.add(transport);
}

if (process.env.PUPPETCHEF_INFO == 1) {
  const transport = process.env.PUPPETCHEF_LOGFILE
    ? new transports.File({
        filename: process.env.PUPPETCHEF_LOGFILE,
        level: "info",
        maxsize: 1024 * 1024 * 10,
        maxFiles: 3,
      })
    : new transports.Console({
        level: "info",
      });
  logger.add(transport);
}

module.exports = {
  logger,
};
