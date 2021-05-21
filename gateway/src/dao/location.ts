import { Location } from '../entity/Location';
import { getRepository } from 'typeorm';
import logger from '../utils/logger'

class LocationDAO {
  public save(location: Location) {
    const locationRepository = getRepository(Location)
    
    if (location.type === 'gps' && !location.gps) {
      throw 'gps point is not provided'
    }
    if (location.type === 'address' && !location.address) {
      throw 'address is not provided'
    }
    if (location.type === 'station_code' && !location.station_code) {
      throw 'station_code is not provided'
    }
    if (location.type === 'area_code' && !location.area_code) {
      throw 'area_code is not provided'
    }
    if (location.type === 'city' && !location.city) {
      throw 'city is not provided'
    }
    if (location.type === 'country' && !location.country) {
      throw 'country is not provided'
    }
    if (location.type === 'polygon' && !location.polygon) {
      throw 'polygon is not provided'
    }
    if (location.type === '3dspace' && !location.space) {
      throw 'space is not provided'
    }

    return locationRepository.save(location)
  }

  public remove(location: Location) {
    const locationRepository = getRepository(Location)
    return locationRepository.remove(location)
  }
}

export default new LocationDAO()
