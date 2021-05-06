const Joi = require('joi');

const registerO2Requirement = {
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
    message: Joi.object().keys({
      intent: Joi.object().keys({
        mobile: Joi.string(),
        type: Joi.string(),
        location: Joi.object().keys({
          pin_code: Joi.string(),
          city: Joi.object().keys({
            code: Joi.string(),
            name: Joi.string(),
          }),
          address: Joi.object().keys({
            door: Joi.string(),
            building: Joi.string(),
            area: Joi.string(),
          }),
        }),
      }),
    }),
  }),
};

module.exports = {
  registerO2Requirement,
};
