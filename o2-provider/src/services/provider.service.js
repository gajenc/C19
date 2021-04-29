const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create a user
 * @param {Object} providerBody
 * @returns {Promise<User>}
 */
const registerProvider = async (providerBody) => {
  logger.info(JSON.stringify(providerBody));
  if (false) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Provider mobile already taken');
  }
  // const user = await User.create(providerBody);
  return {};
};

module.exports = {
  registerProvider,
};
