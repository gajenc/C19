import * as cors from 'cors'
import * as parser from 'body-parser'
import * as compression from 'compression'
import { loggerMiddleware } from './logger';
// import * as Rollbar from 'rollbar';

export default [
  cors({ credentials: true, origin: true }),
  parser.urlencoded({ extended: true }),
  parser.json(),
  compression(),
  loggerMiddleware,
  // new Rollbar().errorHandler()
];
