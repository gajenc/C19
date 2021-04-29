const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { providerService } = require('../services');

const registerProvider = catchAsync(async (req, res) => {
  const provider = await providerService.registerProvider(req.body);
  if (!provider) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // res.send(provider);
  res.status(httpStatus.CREATED).send(provider);
});

module.exports = {
  registerProvider,
};
