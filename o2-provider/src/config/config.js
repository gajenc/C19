const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const { hasuraAdminSecret } = require('../validations/custom.validation');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    HASURA_ADMIN_SECRET: Joi.string().custom(hasuraAdminSecret).required(),
    HASURA_URL: Joi.string().required(),
    API_TOKEN: Joi.string(),
    REQUIREMENT_EXPIRE_MINUTES: Joi.number().required()
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

if (envVars.NODE_ENV === 'production' && !envVars.API_TOKEN) {
  throw new Error(`Config validation error: API_TOKEN not configured `);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  hasuraAdminSecret: envVars.HASURA_ADMIN_SECRET,
  hasuraUrl: envVars.HASURA_URL,
  ymHost: envVars.YM_HOST,
  ymSendMessageEndpoint: envVars.YM_SEND_MESSAGE_ENDPOINT,
  ymExpiryNotificationEndpoint: envVars.YM_EXPIRY_NOTIFICATION_ENDPOINT,
  ymBotId: envVars.YM_BOT_ID,
  ymAuthToken: envVars.YM_AUTH_TOKEN,
  apiToken: envVars.API_TOKEN,
  requirementExpireMinutes: envVars.REQUIREMENT_EXPIRE_MINUTES,
};
