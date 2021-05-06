const express = require('express');
const validate = require('../../middlewares/validate');
const feedbackValidation = require('../../validations/feedback.validation');
const feedbackController = require('../../controllers/feedback.controller');

const registerFeedbackRoute = express.Router();
registerFeedbackRoute.route('/').post(validate(feedbackValidation.registerFeedback), feedbackController.registerFeedback);

module.exports = {
  registerFeedbackRoute,
};
