const Joi = require('joi');

const registerFeedback = {
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
      feedback: Joi.object().keys({
        search_id: Joi.string(),
        usable: Joi.boolean(),
        rating: Joi.number(),
        mobile: Joi.number(),
        reason: Joi.string(),
        additional: Joi.string(),
      }),
    }),
  }),
};

module.exports = {
  registerFeedback,
};
