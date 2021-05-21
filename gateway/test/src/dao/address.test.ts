import app from '../../../src/server'
import AddressDAO from '../../../src/dao/address'
import { Address } from '../../../src/entity/Address'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Address DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save address', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should accept if only door provided', async () => {
      const address = new Address()
      address.door = 'door'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.door).toEqual(addressRes!.door)
    })

    it('Should accept if only building provided', async () => {
      const address = new Address()
      address.building = 'building'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.building).toEqual(addressRes!.building)
    })

    it('Should accept if only street provided', async () => {
      const address = new Address()
      address.street = 'street'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.street).toEqual(addressRes!.street)
    })

    it('Should accept if only area provided', async () => {
      const address = new Address()
      address.area = 'area'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.area).toEqual(addressRes!.area)
    })

    it('Should accept if only city provided', async () => {
      const address = new Address()
      address.city = 'city'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.city).toEqual(addressRes!.city)
    })

    it('Should accept if only country provided', async () => {
      const address = new Address()
      address.country = 'country'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.country).toEqual(addressRes!.country)
    })

    it('Should accept if only area_code provided', async () => {
      const address = new Address()
      address.area_code = 'area_code'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.area_code).toEqual(addressRes!.area_code)
    })

    it('Should save point with correct data', async () => {
      const address = new Address()
      address.door = 'door'
      address.building = 'building'
      address.street = 'street'
      address.area = 'area'
      address.city = 'city'
      address.country = 'country'
      address.area_code = 'area_code'

      const addressRes = await AddressDAO.save(address)
      const allAddresses = await getRepository(Address).find()
      expect(allAddresses.length).toEqual(1)
      expect(allAddresses[0]!.door).toEqual(addressRes!.door)
      expect(allAddresses[0]!.building).toEqual(addressRes!.building)
      expect(allAddresses[0]!.street).toEqual(addressRes!.street)
      expect(allAddresses[0]!.area).toEqual(addressRes!.area)
      expect(allAddresses[0]!.city).toEqual(addressRes!.city)
      expect(allAddresses[0]!.country).toEqual(addressRes!.country)
      expect(allAddresses[0]!.area_code).toEqual(addressRes!.area_code)
    })
  })
})
