const express = require('express');
const { o2ServiceTrigger, o2RequirementTrigger, o2RequirementExpire } = require('../../controllers/event.trigger.controller');

const o2RequirementRoute = express.Router();
o2RequirementRoute
.route('/').post(o2RequirementTrigger)

const o2ServiceRoute = express.Router();
o2ServiceRoute
.route('/').post(o2ServiceTrigger);

const o2RequirementExpireRoute = express.Router();
o2RequirementExpireRoute
.route('/').post(o2RequirementExpire);

module.exports = {
  o2RequirementRoute,
  o2ServiceRoute,
  o2RequirementExpireRoute
};
