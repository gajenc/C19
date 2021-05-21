import app from '../../../src/server'
import CityDAO from '../../../src/dao/city'
import { City } from '../../../src/entity/City'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('City DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save city', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should throw error if city is empty', async () => {
      const city = new City()

      try {
        await CityDAO.save(city)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'name' doesn't have a default value")
      }
    })

    it('Should throw error if code is not provided in city', async () => {
      const city = new City()
      city.name = 'india'

      try {
        await CityDAO.save(city)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'code' doesn't have a default value")
      }
    })

    it('Should save city with correct data', async () => {
      const city = new City()
      city.name = 'india'
      city.code = 'code'

      const cityRes = await CityDAO.save(city)
      const allCities = await getRepository(City).find()
      expect(allCities.length).toEqual(1)
      expect(allCities[0]!.name).toEqual(cityRes!.name)
      expect(allCities[0]!.code).toEqual(cityRes!.code)
    })
  })
})
