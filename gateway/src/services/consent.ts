const moment = require('moment');
import APIResolver from '../utils/api-resolver';
import * as _ from 'lodash';
import logger from '../utils/logger';
import authHelper from '../utils/auth-helper';
import Constants from '../constants/constants';
import * as Errors from '../constants/errors';
import ClientDAO from '../dao/client';

class Consent {
    /**
   * 1. Get the mapping Path
   * 2. Get destination details
   * 3. Forward the request
   */
    handle = async (data: any) => {
        try {
            const { path, payload } = data;
            const forwardPaths: { [index: string]: any } = Constants.CONSENT_MANAGEMENT_API_FORWARD_PATHS;
            const client = await ClientDAO.findOne({
                where: {
                    id: data.destinationId,
                    active: true,
                    serviceable: true
                },
                relations: ["endpoints"]
            });
            const baseEndpoint = client?.endpoints.find(endpoint => true || endpoint.type === data.destinationType);

            if (!client || !forwardPaths[path] || !baseEndpoint) {
                const err = new Errors.InvalidDestination('Invalid Destination or Path');
                err.code = 404;
                throw err;
            }
            
            const response = await APIResolver.request({
                method: 'POST',
                url: `${baseEndpoint!.url}${forwardPaths[path]}`,
                headers: { 'content-type': 'application/json', 'signature': authHelper.generateGatewayToken(client.gateway_jwt_secret, { id: client.id, name: client.name }) },
                data: data.payload,
                timeout: 1000
            })
            return response;
        } catch (error) {
            logger.error('Error in Consent.handle', error);
            throw error
        }
    }
}

export default Consent
