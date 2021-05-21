import * as moment from "moment";
import APIResolver from "../utils/api-resolver";
import ClientTypeDAO from "../dao/client-type";
import * as _ from "lodash";
import logger from "../utils/logger";
import authHelper from "../utils/auth-helper";
import Constants from "../constants/constants";
import { ClientTypeEnum } from "../constants/clent-types";

class Search {
  /**
 * 1. Get all valid HSPs
 * 2. Send search request to all HSPs
 * 3. Add a timeout on 700ms.
 */
  getResults = async (data: any) => {
    try {
      const hspTypeClients = await ClientTypeDAO.findByData({
        where: {
          name: ClientTypeEnum.HSP
        },
        relations: ["client", "client.endpoints"]
      });

      const searchPromise: Array<any> = [];
      hspTypeClients.forEach(hspType => {
        const hsp = hspType.client;
        const baseEndpoint = hsp && hsp.endpoints && hsp.endpoints.length ? hsp.endpoints[0]!.url : null;
        if (baseEndpoint && hsp && hsp.serviceable && hsp.active)
          searchPromise.push(APIResolver.request({
            method: "POST",
            url: `${baseEndpoint}${Constants.METHOD_SIGNATURES.SEARCH}`,
            headers: { "content-type": "application/json", "signature": authHelper.generateGatewayToken(hsp.gateway_jwt_secret, { id: hsp.id, name: hsp.name }) },
            data: data,
            timeout: 1000
          }).catch(err => {
            return Promise.resolve(null);
          }));
      });

      const responses = await Promise.all(searchPromise);
      let services = _.flatten(responses.map(entry => entry && entry.services ? entry.services : []));
      if (data.message && data.message.intent && data.message.intent.order_by) {
        let order = data.message.intent.order_by!.order || "desc";
        switch (data.message.intent.order_by!.property) {
          case "experience":
            order = data.message.intent.order_by!.order || "desc";
            services = _.orderBy(services, service => moment.utc(service.consultation &&
              service.consultation.doctor && service.consultation.doctor.experience ?
              service.consultation.doctor.experience : null).unix(), order);
            break;
          case "availability":
            order = data.message.intent.order_by!.order || "asc";
            services = _.orderBy(services, service => {
              const firstSlot = service.consultation &&
                service.consultation.doctor && service.consultation.doctor.availability &&
                service.consultation.doctor.availability.slots && service.consultation.doctor.availability.slots.length ?
                service.consultation.doctor.availability.slots.find((slot: any) => slot.type === "FREE") : null;
              if (!firstSlot) return order === "asc" ? moment.utc().add(1, "year").unix() : 0;
              return moment.utc(firstSlot.slot).unix();
            }, order);
            break;
          case "price":
            order = data.message.intent.order_by!.order || "asc";
            services = _.orderBy(services, service => {
              const price = service.consultation &&
                service.consultation.doctor && service.consultation.doctor.item &&
                service.consultation.doctor.item.price ? service.consultation.doctor.item.price : null;
              if (!price) return order == "desc" ? 0 : Math.max();
              return price;
            }, order);
            break;
          default:
            break;
        }
      }
      return { services: services };
    } catch (error) {
      logger.error("Error in Search.getResults", error);
      throw error;
    }
  }
}

export default Search;
