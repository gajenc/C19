const express = require('express');
const validate = require('../../middlewares/validate');
const serviceValidation = require('../../validations/service.validation');
const serviceController = require('../../controllers/service.controller');

const registerServiceRoute = express.Router();
registerServiceRoute.route('/').post(validate(serviceValidation.registerService), serviceController.registerService);

module.exports = {
  registerServiceRoute,
};
