const express = require('express');
const docsRoute = require('./docs.route');
const { registerProviderRoute } = require('./provider.route');
const { registerSearchRoute } = require('./search.route');
const { registerFeedbackRoute } = require('./feedback.route');
const { registerServiceRoute } = require('./service.route');
const {
  o2ServiceRoute,
  o2RequirementRoute,
  o2RequirementExpireRoute,
  o2ContinuingSearchRoute,
} = require('./event.trigger.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/register/provider',
    route: registerProviderRoute,
  },
  {
    path: '/search/service',
    route: registerSearchRoute,
  },
  {
    path: '/register/feedback',
    route: registerFeedbackRoute,
  },
  {
    path: '/on_search/service',
    route: registerServiceRoute,
  },
  {
    path: '/triggers/o2-requirement',
    route: o2RequirementRoute,
  },
  {
    path: '/triggers/o2-service',
    route: o2ServiceRoute,
  },
  {
    path: '/triggers/o2-requirement-expire',
    route: o2RequirementExpireRoute,
  },
  {
    path: '/triggers/o2-continuing-search',
    route: o2ContinuingSearchRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
