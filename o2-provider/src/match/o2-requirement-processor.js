/* eslint-disable no-await-in-loop */
/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const { fetchPincodeBasedCityMatchingProviders } = require('./match-providers');
const { decryptObject } = require('../services/encryption.service');
const { callHasura } = require('../services/util/hasura');
const { sendProviderNotificationMessage, sendAcceptedProviderDetails } = require('./yellow.messenger');

// const maxIterations = process.env.O2_REQUIREMENT_MAX_ITERATIONS;
const maxIterations = 0;

const persistO2Service = async (o2Requirement, o2Provider, status) => {
  const o2Service = {
    search_id: o2Requirement.uuid,
    type: o2Requirement.type,
    status,
    provider_id: o2Provider.uuid,
  };
  const query = `
    mutation insert_o2_service($object: o2_service_insert_input!) {
      insert_o2_service_one(object: $object) {
        uuid
      }
    }
  `;
  const variable = {
    object: o2Service,
  };
  const response = await callHasura(query, variable, 'insert_o2_service');
  if (response.errors !== undefined) {
    logger.error(JSON.stringify(response.errors));
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to register event');
  }
  o2Service.uuid = response.data.insert_o2_service_one.uuid;
  return o2Service;
};

const processO2Requirement = async (o2Requirement) => {
  o2Requirement.iteration = 0;
  let { iteration } = o2Requirement;
  if (iteration > maxIterations) {
    o2Requirement.active = false;
  } else {
    const location = {
      city: o2Requirement.city,
      pin_code: o2Requirement.pin_code,
    };
    let providers = await fetchPincodeBasedCityMatchingProviders(location, iteration);
    while (providers.length === 0 && iteration < maxIterations) {
      iteration += 1;
      providers = await fetchPincodeBasedCityMatchingProviders(location, iteration);
    }
    if (providers.length === 0) {
      o2Requirement.active = false;
    } else {
      o2Requirement.iteration = iteration;
      // eslint-disable-next-line no-restricted-syntax
      for (const provider of providers) {
        let user = provider.o2_user;
        user = await decryptObject(user);
        const ymResponse = await sendProviderNotificationMessage(user.mobile, {
          id: o2Requirement.id.toString(),
          pin_code: o2Requirement.pin_code,
          city: o2Requirement.city,
          uuid: o2Requirement.uuid,
        });
        let status = '';
        if (ymResponse.status === 200) {
          status = 'REQUESTED';
        } else {
          status = 'SEND_FAILED';
        }
        await persistO2Service(o2Requirement, provider, status);
      }
    }
  }
  // TODO: Get user mobile from db and send message to the user. Message could be 1. Requested providers OR 2. No providers found
  // TODO: update o2Requirement; new parameter o2Requirement.iteration
};

const processO2Service = async (o2Service) => {
  if (o2Service.status !== 'ACCEPTED') return;
  const serviceUuid = o2Service.uuid;
  const query = `
    query getO2Service($uuid: uuid!) {
      o2_service(where: {uuid: {_eq: $uuid}}) {
        o2_provider {
          o2_user {
            name
            mobile
          }
        }
        o2_requirement {
          active
          o2_user {
            mobile
          }
        }
      }
    }  
  `;
  const variable = {
    uuid: serviceUuid,
  };
  const response = await callHasura(query, variable, 'getO2Service');
  const service = response.data.o2_service[0];
  const requirementStatus = service.o2_requirement.active;
  if (requirementStatus) {
    service.o2_requirement.active = undefined;
    const decryptedService = await decryptObject(service);
    let providerDetails = '';
    providerDetails += `Supplier Name: ${decryptedService.o2_provider.o2_user.name}`;
    providerDetails += `, Mobile Number: ${decryptedService.o2_provider.o2_user.mobile}`;
    providerDetails += ` https://wa.me/send?phone=91${decryptedService.o2_provider.o2_user.mobile}&text=Hi`;
    const message = {
      providerDetails,
    };
    await sendAcceptedProviderDetails(decryptedService.o2_requirement.o2_user.mobile, message);
  } else {
    logger.info('Requirement has expired');
  }
};

const processO2RequirementReplies = async (o2Requirement) => {
  const replies = o2Requirement.o2_service;
  if (replies.length === 0) {
    // send message to user => no providers found
    // If iteration == maxIteration => closing the request
  } else {
    const providers = await decryptObject(replies);
    let providerDetailsMessage = '';
    if (providers.length === 1) {
      const user = providers[0].o2_provider.o2_user;
      providerDetailsMessage = `${user.name}: ${user.mobile}`;
    } else {
      for (let i = 0; i < providers.length; i += 1) {
        const user = providers[i].o2_provider.o2_user;
        providerDetailsMessage += `\n${i + 1}. ${user.name}: ${user.mobile}`;
      }
    }
    logger.info(providerDetailsMessage);
    // send message with provider details
  }
};

module.exports = {
  processO2Requirement,
  processO2RequirementReplies,
  processO2Service,
};
