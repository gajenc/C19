const httpStatus = require('http-status');
const { upsertUser } = require('./user.service');
const { callHasura } = require('./util/hasura');

const ApiError = require('../utils/ApiError');

/**
 * Register requirement for O2
 * @param {Object} searchRequest
 * @returns {Promise<SearchReponse>}
 */
const registerO2Requirement = async (searchRequest) => {
  const { intent } = searchRequest.message;

  let user = {
    mobile: intent.mobile,
    type: 'consumer',
  };
  user = await upsertUser(user);

  const query = `
  mutation insert_o2_requirement_one($object: o2_requirement_insert_input!) {
    insert_o2_requirement_one(object: $object) {
      uuid
    }
  }  
`;
  const variable = {
    object: {
      user_id: user.uuid,
      pin_code: intent.location.pin_code,
      type: intent.type,
      address_detail: intent.location.address,
      city: intent.location.city.name,
      active: true,
    },
  };
  const response = await callHasura(query, variable, 'insert_o2_requirement_one');

  if (response.errors !== undefined)
    throw new ApiError(httpStatus.BAD_REQUEST, 'An active search already exists for this user.');
  return response.data.insert_o2_requirement_one;
};

module.exports = {
  registerO2Requirement,
};
