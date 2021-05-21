import { Client } from '../entity/Client';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class ClientDAO {
  public save(client: Client) {
    const clientRepository = getRepository(Client)
    return clientRepository.save(client)
  }

  public getClientById(id: number, options: any) {
    const clientRepository = getRepository(Client);
    return clientRepository.findOne(id, options)
  }

  public getClientByUserName(username: string) {
    const clientRepository = getRepository(Client);
    return clientRepository.findOne({ username })
  }

  public findByData(data: any) {
    const clientRepository = getRepository(Client);
    return clientRepository.find(data)
  }

  public findOne(data: any) {
    const clientRepository = getRepository(Client);
    return clientRepository.findOne(data)
  }
}

export default new ClientDAO()
