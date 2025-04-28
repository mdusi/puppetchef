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

const logLevels = ["info", "debug", "error", "warn", "verbose"];

if (!process.env.PUPPETCHEF_LOGLEVEL && process.env.PUPPETCHEF_INFO == 1)
  process.env.PUPPETCHEF_LOGLEVEL = "info";

if (!process.env.PUPPETCHEF_LOGLEVEL && process.env.PUPPETCHEF_DEBUG == 1)
  process.env.PUPPETCHEF_LOGLEVEL = "debug";

if (
  process.env.PUPPETCHEF_LOGLEVEL &&
  logLevels.includes(process.env.PUPPETCHEF_LOGLEVEL.toLowerCase())
) {
  const logLevel = process.env.PUPPETCHEF_LOGLEVEL.toLowerCase();
  const transport = process.env.PUPPETCHEF_LOGFILE
    ? new transports.File({
        filename: process.env.PUPPETCHEF_LOGFILE,
        level: logLevel,
        maxsize: 1024 * 1024 * 10,
        maxFiles: 3,
      })
    : new transports.Console({
        level: logLevel,
      });
  logger.add(transport);
}

module.exports = {
  logger,
};
