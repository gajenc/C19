import app from '../../../src/server'
import ApiDAO from '../../../src/dao/api'
import { Api } from '../../../src/entity/Api'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Api DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save api', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should throw error if api is empty', async () => {
      const api = new Api()

      try {
        const apiRes = await ApiDAO.save(api)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'type' doesn't have a default value")
      }
    })

    it('Should throw error if url is not provided in api', async () => {
      const api = new Api()
      api.type = 'GET'

      try {
        const apiRes = await ApiDAO.save(api)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'url' doesn't have a default value")
      }
    })

    it('Should save api if exp is not provided', async () => {
      const api = new Api()
      api.type = 'GET'
      api.url = 'url'

      const apiRes = await ApiDAO.save(api)
      const allApis = await getRepository(Api).find()
      expect(allApis.length).toEqual(1)
      expect(allApis[0]!.type).toEqual(apiRes!.type)
      expect(allApis[0]!.url).toEqual(apiRes!.url)
      expect(allApis[0]!.exp).toEqual(apiRes!.exp)
    })

    it('Should save api with correct data', async () => {
      const api = new Api()
      api.type = 'GET'
      api.url = 'url'
      api.exp = new Date()

      const apiRes = await ApiDAO.save(api)
      const allApis = await getRepository(Api).find()
      expect(allApis.length).toEqual(1)
      expect(allApis[0]!.type).toEqual(apiRes!.type)
      expect(allApis[0]!.url).toEqual(apiRes!.url)
      expect(allApis[0]!.exp).toEqual(apiRes!.exp)
    })
  })
})
