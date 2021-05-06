const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { searchService } = require('../services');

const registerO2Requirement = catchAsync(async (req, res) => {
  const search = await searchService.registerO2Requirement(req.body);
  if (!search) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Failed to register search request');
  }
  const response = {
    ack: {
      code: '',
      message: '',
      searchId: search.uuid,
    },
  };
  // res.send(search);
  res.status(httpStatus.CREATED).send(response);
});

module.exports = {
  registerO2Requirement,
};
