import path from "node:path";
import winston from "winston";

import { getNodeEnv } from "./config";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each log level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that we want to link the colors
winston.addColors(colors);

// Create log format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        ({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        },
      ),
    ),
  }),

  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), "logs", "error.log"),
    level: "error",
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.json(),
    ),
  }),

  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), "logs", "combined.log"),
    format: winston.format.combine(
      winston.format.uncolorize(),
      winston.format.json(),
    ),
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: getNodeEnv() === "development" ? "debug" : "info",
  levels,
  format,
  transports,
  exitOnError: false,
});

// If we're not in production then log to the console with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (getNodeEnv() === "test") {
  logger.silent = true; // Disable logging during tests
}

// Create a stream object with a 'write' function that will be used by Morgan
const stream = {
  write: (message: string) => {
    // Use the http severity to log HTTP requests
    logger.http(message.trim());
  },
};

// Export logger and stream
export { logger, stream };
export default logger;
