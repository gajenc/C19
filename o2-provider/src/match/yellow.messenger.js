const ymClient = require('../config/yellow.messenger');

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

  const response = await ymClient.post('', requestBody);
  return response;
};

const sendRequestExpiredMessage = async (mobile, message) => {
  const requestBody = {
    body: {
      to: '',
      ttl: 86400,
      type: 'template',
      template: {
        namespace: '7d08a43e_5c20_45e3_a26e_aa9e0e4ab729',
        name: 'search_for_supplier',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
        components: [
          {
            type: 'button',
            sub_type: 'quick_reply',
            index: '0',
            parameters: [
              {
                type: 'payload',
                payload: 'search_for_supplier:continue',
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
                payload: 'search_for_supplier:cancel',
              },
            ],
          },
        ],
      },
    },
  };

  requestBody.body.to = `91${mobile}`;
  const response = await ymClient.post('', requestBody);
  return response;
};

const sendAcceptedProviderDetails = async (mobile, message) => {
  const requestBody = {
    body: {
      to: '',
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
            default: '${DEALER DETAILS}',
          },
        ],
      },
    },
  };
  requestBody.body.to = `91${mobile}`;
  requestBody.body.hsm.localizable_params[0].default = message.providerDetails;

  const response = await ymClient.post('', requestBody);
  return response;
};

module.exports = {
  sendProviderNotificationMessage,
  sendRequestExpiredMessage,
  sendAcceptedProviderDetails,
};
