const { createUser } = require('./user.service');
const { callHasura } = require('./util/hasura');

const validateRegisterProvider = async (providerBody) => {};

const validateUpdateProvider = async (providerBody) => {};

const persistProvider = async (provider) => {
  const query = `
    mutation upsert_o2_provider($object: o2_provider_insert_input!) {
      insert_o2_provider_one(object:$object, on_conflict: {constraint: o2_provider_pkey, update_columns:[address, status, pin_code]}) {
        uuid,
        user_id
      }
    }
  `;
  const variable = {
    object: provider,
  };
  const response = await callHasura(query, variable, 'upsert_o2_provider');
  provider.uuid = response.data.insert_o2_provider_one.uuid;
  return provider;
};

/**
 * Create a user
 * @param {Object} providerBody
 * @returns {Promise<User>}
 */
const registerProvider = async (providerBody) => {
  await validateRegisterProvider(providerBody);
  const { provider } = providerBody.message;
  let user = {
    name: provider.name,
    mobile: provider.contact.mobile,
    email: provider.contact.email,
    phone: provider.contact.phone,
    type: 'supplier',
  };
  user = await createUser(user);

  let providerDbObject = {
    user_id: user.uuid,
    status: provider.status,
    pin_code: provider.located_at.pin_code,
    address: provider.located_at.address,
    city: provider.located_at.city.name,
  };

  providerDbObject = await persistProvider(providerDbObject);

  return {
    uuid: providerDbObject.uuid,
  };
};

module.exports = {
  registerProvider,
};
