const ymClient = require('../config/yellow.messenger');
const appConfigs = require('../config/config');

const sendMessageEndpoint = appConfigs.ymSendMessageEndpoint.replace('{{botId}}', appConfigs.ymBotId);
const sendExpiryNotificationEndpoint = appConfigs.ymExpiryNotificationEndpoint.replace('{{botId}}', appConfigs.ymBotId);

const sendProviderNotificationMessage = async (mobile, message) => {
  const requestBody = {
    body: {
      to: `91${mobile}`,
      ttl: 86400,
      type: 'template',
      template: {
        namespace: '7d08a43e_5c20_45e3_a26e_aa9e0e4ab729',
        name: 'sender_notification',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: `${message.id}`,
              },
              {
                type: 'text',
                text: `${message.pin_code}`,
              },
              {
                type: 'text',
                text: `${message.city}`,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              {
                type: 'payload',
                payload: `SENDER_NOTIFICATOIN:${message.uuid}:ACCEPT`,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '1',
            parameters: [
              {
                type: 'payload',
                payload: `SENDER_NOTIFICATOIN:${message.uuid}:REJECT`,
              },
            ],
          },
        ],
      },
    },
  };

  const response = await ymClient.post(sendMessageEndpoint, requestBody);
  return response;
};

const sendExpiryNotificationToYmBot = async (mobile, message) => {
  const expiryNotifyBody = {
    data: {
      rid: `${message.search_id}`,
      event: 'request_expired',
      Message: 'Request Expired',
    },
    sender: '121',
    bot: `${appConfigs.ymBotId}`,
  };
  const response = await ymClient.post(sendExpiryNotificationEndpoint, expiryNotifyBody);
  return response;
};

const sendRequestExpiredMessage = async (mobile, message) => {
  const requestBody = {
    body: {
      to: `91${mobile}`,
      ttl: 86400,
      type: 'template',
      template: {
        namespace: '7d08a43e_5c20_45e3_a26e_aa9e0e4ab729',
        name: 'search_for_supplier_new_without_button',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
      },
    },
  };

  const response = await ymClient.post(sendMessageEndpoint, requestBody);

  await sendExpiryNotificationToYmBot(mobile, message);

  return response;
};

const sendAcceptedProviderDetails = async (mobile, message) => {
  const requestBody = {
    body: {
      to: `91${mobile}`,
      ttl: 'P1D',
      type: 'hsm',
      hsm: {
        namespace: '7d08a43e_5c20_45e3_a26e_aa9e0e4ab729',
        element_name: 'supplier_found',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
        localizable_params: [
          {
            default: `${message.providerDetails}`,
          },
        ],
      },
    },
  };

  const response = await ymClient.post(sendMessageEndpoint, requestBody);
  return response;
};

const sendContinuingSearchMessage = async (mobile) => {
  const requestBody = {
    body: {
      to: `91${mobile}`,
      ttl: 'P1D',
      type: 'hsm',
      hsm: {
        namespace: '7d08a43e_5c20_45e3_a26e_aa9e0e4ab729',
        element_name: 'supplier_not_found',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
      },
    },
  };

  const response = await ymClient.post(sendMessageEndpoint, requestBody);
  return response;
};

module.exports = {
  sendProviderNotificationMessage,
  sendRequestExpiredMessage,
  sendAcceptedProviderDetails,
  sendContinuingSearchMessage,
};
