import app from '../../../src/server'
import CountryDAO from '../../../src/dao/country'
import { Country } from '../../../src/entity/Country'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Country DAO', () => {
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

    it('Should throw error if country is empty', async () => {
      const country = new Country()

      try {
        await CountryDAO.save(country)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'name' doesn't have a default value")
      }
    })

    it('Should throw error if code is not provided in country', async () => {
      const country = new Country()
      country.name = 'india'

      try {
        await CountryDAO.save(country)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'code' doesn't have a default value")
      }
    })

    it('Should save country with correct data', async () => {
      const country = new Country()
      country.name = 'india'
      country.code = 'code'

      const countryRes = await CountryDAO.save(country)
      const allCountries = await getRepository(Country).find()
      expect(allCountries.length).toEqual(1)
      expect(allCountries[0]!.name).toEqual(countryRes!.name)
      expect(allCountries[0]!.code).toEqual(countryRes!.code)
    })
  })
})
