const axios = require('axios');
const appConfigs = require('./config');
const logger = require('./logger');

const ymUrl = appConfigs.ymUrl.replace('{{botId}}', appConfigs.ymBotId);

const instance = axios.create({
  baseURL: ymUrl,
});
instance.defaults.headers.common['x-auth-token'] = appConfigs.ymAuthToken;

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    if (appConfigs.env === 'development') {
      logger.info(`URL: ${config.baseURL} \nRequest Body: ${JSON.stringify(config.data)}`);
    } else {
      logger.info(`Calling URL: ${config.baseURL}`);
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    logger.error(`Call to ${ymUrl} failed with status code: ${error.response.status}`);
    return Promise.reject(error);
  }
);

module.exports = instance;
