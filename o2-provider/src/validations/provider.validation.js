const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const registerProvider = {
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
      provider: Joi.object().keys({
        status: Joi.string(),
        name: Joi.string(),
        homePage: Joi.string(),
        contact: Joi.object().keys({
          email: Joi.string(),
          mobile: Joi.string(),
          phone: Joi.string(),
        }),
        located_at: Joi.object().keys({
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

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  registerProvider,
  updateUser,
  deleteUser,
};
