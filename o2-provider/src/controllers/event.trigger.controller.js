const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { processO2Requirement, processO2Service } = require('../match/o2-requirement-processor')
const appConfigs = require('../config/config')

const ApiError = require('../utils/ApiError');
const { callHasura } = require('../services/util/hasura');
const logger = require('../config/logger');
const { decryptObject } = require('../services/encryption.service');
const { sendRequestExpiredMessage, sendContinuingSearchMessage } = require('../match/yellow.messenger');

const o2RequirementTrigger = catchAsync(async (req, res) => {
  await processO2Requirement(req.body.event.data.new)
  // {"pin_code":"560102","uuid":"c2093125-1248-43a5-997f-71c1e22dc7b3","active":true,"city":null,"created_at":"2021-05-05T16:49:08.897133+00:00","id":7,"address_detail":null,"type":"TYPE_B","user_id":"9aa7438f-52ff-4d4d-ad6b-b1a8e9c1d507"}  

  res.status(httpStatus.OK).send();
});

const o2ServiceTrigger = catchAsync(async (req, res) => {
  await processO2Service(req.body.event.data.new)
  // {"pin_code":"560102","uuid":"c2093125-1248-43a5-997f-71c1e22dc7b3","active":true,"city":null,"created_at":"2021-05-05T16:49:08.897133+00:00","id":7,"address_detail":null,"type":"TYPE_B","user_id":"9aa7438f-52ff-4d4d-ad6b-b1a8e9c1d507"}
  
  res.status(httpStatus.OK).send();
});

const o2RequirementExpire = catchAsync(async (req, res) => {
  const minutesAgo = new Date(Date.now() - 1000 * 60 * appConfigs.requirementExpireMinutes);

  const query = `
    mutation update_o2_requirement($createdAt: timestamptz!) {
      update_o2_requirement(where: {created_at: {_lt: $createdAt}, active: {_eq: true}}, _set: {active: false}) {
        returning{
          uuid
          o2_user{
            mobile
          }
        }
      }
    }
  `;
  const variable = {
    createdAt: minutesAgo,
  };
  logger.info(`Attempting to expire records since ${minutesAgo}`)
  const response = await callHasura(query, variable, 'update_o2_requirement');
  if (response.errors !== undefined) {
    logger.error(JSON.stringify(response.errors));
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to register event');
  }

  const data = response.data.update_o2_requirement.returning;
  const users = data.map((x) => x.o2_user);
  const decryptedUsers = await decryptObject(users);

  for (let i = 0; i < data.length; i += 1) {
    await sendRequestExpiredMessage(decryptedUsers[i].mobile, { search_id: data[i].uuid });
  }

  logger.info(`${response.data.update_o2_requirement.returning.length} entries expired`)

  res.status(httpStatus.OK).send();
});

const o2ContinuingSearch = catchAsync(async (req, res) => {
  const query = `
    query getActiveRequirements {
      o2_requirement(where: {active: {_eq: true}}) {
        o2_user {
          mobile
        }
      }
    }  
  `;
  const response = await callHasura(query, {}, 'getActiveRequirements');
  const users = response.data.o2_requirement;
  const decryptedUsers = await decryptObject(users);

  for (let i = 0; i < decryptedUsers.length; i += 1) {
    await sendContinuingSearchMessage(decryptedUsers[i].o2_user.mobile);
  }

  logger.info(`Continuing Search messages send for ${decryptedUsers.length} active requirements`)

  res.status(httpStatus.OK).send();
});

module.exports = {
  o2RequirementTrigger,
  o2ServiceTrigger,
  o2RequirementExpire,
  o2ContinuingSearch,
};
