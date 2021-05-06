const { default: axios } = require('axios');

const tenantId = process.env.ROOT_TENANT_ID;
const host = process.env.ENCRYPTION_SERVICE_HOST;
const encryptEndpoint = process.env.ENCRYPTION_SERVICE_ENCRYPT_ENDPOINT;
const decryptEndpoint = process.env.ENCRYPTION_SERVICE_DECRYPT_ENDPOINT;
const hashEndpoint = process.env.ENCRYPTION_SERVICE_HASH_ENDPOINT;

const encryptObject = async (object) => {
  const url = host + encryptEndpoint;
  const requestBody = {
    encryptionRequests: [
      {
        tenantId,
        type: 'Normal',
        value: object,
      },
    ],
  };

  const response = await axios.post(url, requestBody);

  const encryptedValue = response.data[0].encrypted;
  const hashedValue = response.data[0].hashed;

  return { encryptedValue, hashedValue };
};

const decryptObject = async (object) => {
  const url = host + decryptEndpoint;
  const response = await axios.post(url, object);
  return response.data;
};

const hashObject = async (object) => {
  const url = host + hashEndpoint;
  const response = await axios.post(url, object);
  return response.data;
};

module.exports = {
  encryptObject,
  decryptObject,
  hashObject,
};
