import { Address } from '../entity/Address';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class AddressDAO {
  public save(address: Address) {
    const addressRepository = getRepository(Address)    
    return addressRepository.save(address)
  }
}

export default new AddressDAO()
