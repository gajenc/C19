const express = require('express');
const validate = require('../../middlewares/validate');
const searchValidation = require('../../validations/search.validation');
const searchController = require('../../controllers/search.controller');

const registerSearchRoute = express.Router();
registerSearchRoute
  .route('/')
  .post(validate(searchValidation.registerO2Requirement), searchController.registerO2Requirement);

module.exports = {
  registerSearchRoute,
};
