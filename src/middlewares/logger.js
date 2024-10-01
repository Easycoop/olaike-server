const winston = require("winston");
// const DailyRotateFile = require("winston-daily-rotate-file");

const { combine, colorize, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const transports = {
  //   PROD: [
  //     new DailyRotateFile({
  //       level: "info",
  //       format: combine(
  //         timestamp({
  //           format: "YYYY-MM-DD HH:mm:ss",
  //         }),
  //         logFormat
  //       ),
  //       dirname: "logs",
  //       filename: "application-%DATE%.log",
  //       datePattern: "YYYY-MM-DD",
  //       zippedArchive: true,
  //       maxSize: "20m",
  //       maxFiles: "14d",
  //     }),
  //   ],
  DEV: [
    new winston.transports.Console({
      level: "info",
      format: combine(
        colorize({
          colors: { info: "cyan", error: "red" },
        }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
      ),
    }),
  ],
  TEST: [
    new winston.transports.Console({
      level: "info",
      format: combine(
        colorize({
          colors: { info: "cyan", error: "red" },
        }),
        timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
      ),
    }),
  ],
};

const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize({
      colors: { info: "cyan", error: "red" },
    }),
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: transports["DEV"],
});

module.exports = { logger };
