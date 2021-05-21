const moment = require('moment');
import APIResolver from '../utils/api-resolver';
import ClientDAO from '../dao/client';
import * as _ from 'lodash';
import logger from '../utils/logger';
import authHelper from '../utils/auth-helper';
import Constants from '../constants/constants';
class Onboard {
  /**
 * 1. Get all valid HSPs
 * 2. Send search request to all HSPs
 * 3. Add a timeout on 700ms.
 */
  dryRun = async (client: any, data: any) => {
    try {
      const hsp = await ClientDAO.findOne({
        where: {
          id: client.id,
          active: true,
          serviceable: true
        },
        relations: ["endpoints"]
      });
      const baseEndpoint = hsp && hsp.endpoints && hsp.endpoints[0] ? hsp.endpoints[0]!.url : null;
      if (!baseEndpoint) throw new Error(`baseEndpoint missing in hsp ${client.id}`);
      const searchResponse = await APIResolver.request({
        method: 'POST',
        url: `${baseEndpoint}${Constants.METHOD_SIGNATURES.SEARCH}`,
        headers: { 'content-type': 'application/json', 'signature': authHelper.generateGatewayToken(hsp!.gateway_jwt_secret, { id: hsp!.id, name: hsp!.name }) },
        data: data,
        timeout: 500
      }).catch(err => {
        return Promise.resolve(null)
      })

      const services = searchResponse ? searchResponse.services : null;
      if (!services || !services.length) throw new Error(`services missing in search response`);
      if(!_.every(services, s => s.speciality && s.provider && s.consultation && s.fulfillment_schedule_type)) throw new Error(`Required parameters are missing in search response`);
      
      return 'ok';
    } catch (error) {
      logger.error('Error in Onboard.dryRun ', error);
      throw error
    }
  }
}

export default Onboard
