import * as winston from "winston";

export const logger = winston.createLogger({
  defaultMeta: { service: "rest" },
  format: winston.format.json(),
  level: "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});



