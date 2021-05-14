const express = require('express');
const {
  o2ServiceTrigger,
  o2RequirementTrigger,
  o2RequirementExpire,
  o2ContinuingSearch,
} = require('../../controllers/event.trigger.controller');

const o2RequirementRoute = express.Router();
o2RequirementRoute.route('/').post(o2RequirementTrigger);

const o2ServiceRoute = express.Router();
o2ServiceRoute.route('/').post(o2ServiceTrigger);

const o2RequirementExpireRoute = express.Router();
o2RequirementExpireRoute.route('/').post(o2RequirementExpire);

const o2ContinuingSearchRoute = express.Router();
o2ContinuingSearchRoute.route('/').post(o2ContinuingSearch);

module.exports = {
  o2RequirementRoute,
  o2ServiceRoute,
  o2RequirementExpireRoute,
  o2ContinuingSearchRoute,
};
