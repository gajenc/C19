/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { callHasura } = require('./util/hasura');
const { getUserIdByMobile } = require('./user.service');
const logger = require('../config/logger');

// TODO: This will not be insert but update. Update the status from REQUESTED -> ACCEPTED/REJECTED
// Make the change after the cron job is functional as the o2_service will be created there.
const persistService = async (service) => {
  const query = `
    mutation update_o2_service($search_id: Int!, $provider_id: uuid!, $status: String!, $expires_at: String!) {
      update_o2_service(where: {o2_requirement: {id: {_eq: $search_id}}, provider_id: {_eq: $provider_id}}, _set: {status: $status, expires_at: $expires_at}){
        affected_rows
      }
    }
  `;
  const variable = service;
  const response = await callHasura(query, variable, 'update_o2_service');
  if (response.errors !== undefined) {
    logger.error(JSON.stringify(response.errors));
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to register event');
  }
  // service.uuid = response.data.insert_o2_service.returning.uuid;
  return service;
};

/**
 * On search
 * @param {Object} serviceBody
 * @returns {Promise<User>}
 */
const registerService = async (serviceBody) => {
  const { services } = serviceBody;
  // eslint-disable-next-line no-restricted-syntax
  for (const service of services) {
    const providerId = await getUserIdByMobile(service.mobile, 'supplier');
    if (providerId.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No supplier registered for this mobile!');
    }
    const serviceDbObject = {
      search_id: service.search_id,
      provider_id: providerId[0].o2_providers[0].uuid,
      expires_at: service.expires_at,
      status: service.status,
    };
    // TODO group by status and bulk update
    await persistService(serviceDbObject);
  }
};

module.exports = {
  registerService,
};
