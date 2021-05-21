import * as winston from "winston";
import { LOG_LEVEL } from "./secrets";

const formatLog = (info: any) => {
  let meta: any = {};
  if (info && info.meta) {
    if (info.meta instanceof Error) {
      meta = {
        message: info.meta.message,
        stack: info.meta.stack,
      };
    } else {
      try {
        JSON.stringify(info.meta);
        meta = info.meta;
      } catch (e) {
        let err: any = "logger was unable to parse the data passed in meta as JSON";
        // eslint-disable-next-line no-prototype-builtins
        if (info.meta.hasOwnProperty("error")) {
          const { error } = info.meta;
          err = (error.response && error.response.data
            && error.response.data.error instanceof Object)
            ? error.response.data.error : "logger was unable to parse data in the error";
        }
        meta.error = err;
      }
    }
  }
  return `${info.level}: ${info.message} ${JSON.stringify(meta)}`;
};

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
  ),
  level: LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} [${info.level}]: ${info.message}`),
      )
    }),
    new winston.transports.File({
      filename: `./log/${new Date().toISOString().slice(0, 10)}-results.log`,
    })
  ],
});



export default logger;
