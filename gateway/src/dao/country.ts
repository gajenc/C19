import { Country } from '../entity/Country';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class CountryDAO {
  public save(country: Country) {
    const countryRepository = getRepository(Country)    
    return countryRepository.save(country)
  }
}

export default new CountryDAO()
