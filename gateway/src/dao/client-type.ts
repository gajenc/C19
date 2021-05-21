import { ClientType } from '../entity/ClientType';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class ClientTypeDAO {
  public save(clientType: ClientType) {
    const clientTypeRepository = getRepository(ClientType)
    return clientTypeRepository.save(clientType)
  }

  public saveMany(clientTypes: Array<ClientType>) {
    const clientTypeRepository = getRepository(ClientType)
    return clientTypeRepository.save(clientTypes)
  }

  public delete(query: any) {
    const clientTypeRepository = getRepository(ClientType)
    return clientTypeRepository.delete(query)
  }

  public remove(clientTypes: Array<ClientType>) {
    const clientTypeRepository = getRepository(ClientType)
    return clientTypeRepository.remove(clientTypes)
  }

  public findByData(data: any) {
    const clientTypeRepository = getRepository(ClientType);
    return clientTypeRepository.find(data)
  }
}

export default new ClientTypeDAO()
