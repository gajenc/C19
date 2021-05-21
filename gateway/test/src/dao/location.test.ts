import app from '../../../src/server'
import LocationDAO from '../../../src/dao/location'
import PointDAO from '../../../src/dao/point'
import CountryDAO from '../../../src/dao/country'
import CityDAO from '../../../src/dao/city'
import AddressDAO from '../../../src/dao/address'
import { Location, LocationType, } from '../../../src/entity/Location'
import { Point } from '../../../src/entity/Point'
import { Address } from '../../../src/entity/Address'
import { City } from '../../../src/entity/City'
import { Country } from '../../../src/entity/Country'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Location DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save location', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should accept if location is empty', async () => {
      const location = new Location()
      const locationRes = await LocationDAO.save(location)
      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
    })

    it('Should throw error if location type is gps and point is not provided', async () => {
      const location = new Location()
      location.type = LocationType.GPS

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('gps point is not provided')
      }
    })

    it('Should throw error if location type is address and address is not provided', async () => {
      const location = new Location()
      location.type = LocationType.ADDRESS

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('address is not provided')
      }
    })

    it('Should throw error if location type is station_code and station_code is not provided', async () => {
      const location = new Location()
      location.type = LocationType.STATION_CODE

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('station_code is not provided')
      }
    })

    it('Should throw error if location type is area_code and area_code is not provided', async () => {
      const location = new Location()
      location.type = LocationType.AREA_CODE

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('area_code is not provided')
      }
    })

    it('Should throw error if location type is city and city is not provided', async () => {
      const location = new Location()
      location.type = LocationType.CITY

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('city is not provided')
      }
    })

    it('Should throw error if location type is country and country is not provided', async () => {
      const location = new Location()
      location.type = LocationType.COUNTRY

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('country is not provided')
      }
    })

    it('Should throw error if location type is polygon and polygon is not provided', async () => {
      const location = new Location()
      location.type = LocationType.POLYGON

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('polygon is not provided')
      }
    })

    it('Should throw error if location type is apace and space is not provided', async () => {
      const location = new Location()
      location.type = LocationType.SPACE

      try {
        await LocationDAO.save(location)
      } catch(e) {
        expect(e).toEqual('space is not provided')
      }
    })

    it('Should accept if location type is gps and point is provided', async () => {
      const location = new Location()
      location.type = LocationType.GPS

      const point = new Point()
      point.lat = 123
      point.lon = 211

      const pointRes = await PointDAO.save(point)
      location.gps = point

      const locationRes = await LocationDAO.save(location)
      expect(locationRes!.gps.lat).toEqual(point.lat)
      expect(locationRes!.gps.lon).toEqual(point.lon)
      expect(locationRes!.gps.id).toEqual(pointRes!.id)

      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)

      const allPoints = await getRepository(Point).find()
      expect(allPoints.length).toEqual(1)
      expect(allPoints[0]!.id).toEqual(pointRes.id)
    })

    it('Should accept if location type is 3dspace and space is provided', async () => {
      const location = new Location()
      location.type = LocationType.SPACE
      location.space = 'space'

      const locationRes = await LocationDAO.save(location)
      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)
      expect(allLocations[0]!.space).toEqual(location.space)
    })

    it('Should accept if location type is polygon and polygon is provided', async () => {
      const location = new Location()
      location.type = LocationType.POLYGON
      location.polygon = 'polygon'

      const locationRes = await LocationDAO.save(location)
      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)
      expect(allLocations[0]!.polygon).toEqual(location.polygon)
    })

    it('Should accept if location type is country and country is provided', async () => {
      const location = new Location()
      location.type = LocationType.COUNTRY

      const country = new Country()
      country.name = 'name'
      country.code = 'code'

      const countryRes = await CountryDAO.save(country)
      location.country = country

      const locationRes = await LocationDAO.save(location)
      expect(locationRes!.country.name).toEqual(country.name)
      expect(locationRes!.country.code).toEqual(country.code)
      expect(locationRes!.country.id).toEqual(country.id)

      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)

      const allCountries = await getRepository(Country).find()
      expect(allCountries.length).toEqual(1)
      expect(allCountries[0]!.id).toEqual(countryRes.id)
    })

    it('Should accept if location type is city and city is provided', async () => {
      const location = new Location()
      location.type = LocationType.CITY

      const city = new City()
      city.name = 'name'
      city.code = 'code'

      const cityRes = await CityDAO.save(city)
      location.city = city

      const locationRes = await LocationDAO.save(location)
      expect(locationRes!.city.name).toEqual(city.name)
      expect(locationRes!.city.code).toEqual(city.code)
      expect(locationRes!.city.id).toEqual(city.id)

      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)

      const allCities = await getRepository(City).find()
      expect(allCities.length).toEqual(1)
      expect(allCities[0]!.id).toEqual(cityRes.id)
    })

    it('Should accept if location type is area_code and area_code is provided', async () => {
      const location = new Location()
      location.type = LocationType.AREA_CODE
      location.area_code = 'area_code'

      const locationRes = await LocationDAO.save(location)
      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)
      expect(allLocations[0]!.area_code).toEqual(location.area_code)
    })

    it('Should accept if location type is station_code and station_code is provided', async () => {
      const location = new Location()
      location.type = LocationType.STATION_CODE
      location.station_code = 'area_code'

      const locationRes = await LocationDAO.save(location)
      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)
      expect(allLocations[0]!.station_code).toEqual(location.station_code)
    })

    it('Should accept if location type is address and address is provided', async () => {
      const location = new Location()
      location.type = LocationType.ADDRESS

      const address = new Address()
      address.door = 'door'

      const addressRes = await AddressDAO.save(address)
      location.address = address

      const locationRes = await LocationDAO.save(location)
      expect(locationRes!.address.door).toEqual(address.door)
      expect(locationRes!.address.id).toEqual(address.id)

      const allLocations = await getRepository(Location).find()
      expect(allLocations.length).toEqual(1)
      expect(allLocations[0]!.type).toEqual(location.type)

      const allCountries = await getRepository(Address).find()
      expect(allCountries.length).toEqual(1)
      expect(allCountries[0]!.id).toEqual(addressRes.id)
    })
    
  })
})
