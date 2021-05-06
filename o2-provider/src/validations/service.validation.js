const Joi = require('joi');

const registerService = {
  body: Joi.object().keys({
    header: Joi.object().keys({
      authtoken: Joi.string(),
      signature: Joi.string(),
      callbackurl: Joi.string(),
      caller: Joi.object().keys({
        type: Joi.string(),
        id: Joi.string(),
      }),
    }),
    services: Joi.array().items({
      search_id: Joi.string(),
      type: Joi.string(),
      expires_at: Joi.string(),
      mobile: Joi.number(),
      status: Joi.string(),
    }),
  }),
};

module.exports = {
  registerService,
};
