import { City } from '../entity/City';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class CityDAO {
  public save(city: City) {
    const cityRepository = getRepository(City)    
    return cityRepository.save(city)
  }
}

export default new CityDAO()
