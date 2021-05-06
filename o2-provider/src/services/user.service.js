const httpStatus = require('http-status');
const { encryptObject, hashObject } = require('./encryption.service');
const { callHasura } = require('./util/hasura');
const logger = require('../config/logger');

const ApiError = require('../utils/ApiError');

const createUser = async (user) => {
  const objectToEncrypt = {
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    phone: user.phone,
  };
  const encryptedObject = await encryptUser(objectToEncrypt);

  user = { ...user, ...encryptedObject };

  user = await persistUser(user);

  return user;
};

const encryptUser = async (user) => {
  const { encryptedValue, hashedValue } = await encryptObject(user);
  user.name = encryptedValue.name;
  user.mobile = encryptedValue.mobile;
  user.email = encryptedValue.email;
  user.phone = encryptedValue.phone;

  user.mobile_hash = hashedValue.mobile;
  user.email_hash = hashedValue.email;
  user.phone_hash = hashedValue.phone;
  return user;
};

const persistUser = async (user) => {
  const query = `
    mutation insert_o2_user($object: o2_user_insert_input!) {
      insert_o2_user_one(object: $object) {
        uuid
      }
    }  
  `;
  const variable = {
    object: user,
  };
  const response = await callHasura(query, variable, 'insert_o2_user');
  if (response.errors !== undefined) {
    logger.error(JSON.stringify(response.errors));
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists for this mobile!');
  }
  user.uuid = response.data.insert_o2_user_one.uuid;
  return user;
};

const getUserIdByMobile = async (mobile, type) => {
  const hashReq = {
    mobile,
  };
  const hashResponse = await hashObject(hashReq);
  const query = `
  query getO2user($mobile_hash: String!, $type:String){
    o2_user(where: {mobile_hash: {_eq: $mobile_hash}, type:{_eq:$type}}) {
      uuid
      o2_providers{
        uuid
      }      
    }
  }   
`;
  const variable = {
    mobile_hash: hashResponse.mobile,
    type,
  };
  const response = await callHasura(query, variable, 'getO2user');
  if (response.data && response.data.o2_user) return response.data.o2_user;
  logger.error(JSON.stringify(response.errors));
};

const upsertUser = async (user) => {
  const objectToEncrypt = {
    mobile: user.mobile,
  };
  const { encryptedValue, hashedValue } = await encryptObject(objectToEncrypt);
  const userDbObject = {
    mobile: encryptedValue.mobile,
    mobile_hash: hashedValue.mobile,
    type: user.type,
  };
  const query = `
  mutation upsert_o2_provider($object: o2_user_insert_input!) {
    insert_o2_user_one(object:$object, on_conflict: {constraint: o2_user_uniqueness , update_columns:[mobile_hash]}) {
      uuid
    }
  }
`;
  const variable = {
    object: userDbObject,
  };
  const response = await callHasura(query, variable, 'upsert_o2_provider');
  return response.data.insert_o2_user_one;
};

module.exports = {
  createUser,
  getUserIdByMobile,
  upsertUser,
};
