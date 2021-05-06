const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const authHandler = function (req, res, next) {
  const { headers } = req;
  if (config.env === 'production') {
    if (config.apiToken !== headers['x-auth-token']) {
      logger.info('Access denied!');
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Access Denied'));
    }
  }
  return next();
};

module.exports = {
  authHandler,
};
