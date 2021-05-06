const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const feedbackService = require('../services/feedback.service');

const registerFeedback = catchAsync(async (req, res) => {
  const feedback = await feedbackService.registerFeedback(req.body);
  if (!feedback) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Feedback not found');
  }
  const response = {
    ack: {
      code: '',
      message: '',
      feedbackId: feedback.uuid,
    },
  };
  res.status(httpStatus.CREATED).send(response);
});

module.exports = {
  registerFeedback,
};
