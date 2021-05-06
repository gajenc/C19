const hasuraClient = require('../../config/hasura');

const callHasura = async (query, variables, operationName) => {
  const response = await hasuraClient.post('', {
    query,
    variables,
    operationName,
  });

  return response.data;
};

module.exports = {
  callHasura,
};
