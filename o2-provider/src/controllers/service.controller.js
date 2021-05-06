const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const onSearchService = require('../services/onSearch.service');

const registerService = catchAsync(async (req, res) => {
  const service = await onSearchService.registerService(req.body);
  if (!service) {
    // throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  const response = {
    ack: {
      code: httpStatus.CREATED,
      message: 'OK',
    },
  };
  res.status(httpStatus.CREATED).send(response);
});

module.exports = {
  registerService,
};
