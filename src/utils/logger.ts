import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { createLogger, format, transports } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir: string = join(__dirname, "../logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]:: ${message}`
    )
  ),
  transports: [
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // log file /logs/error/*.log in save
      filename: `%DATE%.log`,
      maxFiles: 30, // 30 Days saved
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new transports.Console({
    format: format.combine(format.splat(), format.colorize()),
  })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, stream };
