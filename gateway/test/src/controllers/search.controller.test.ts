const request = require('supertest')
import app from '../../../src/server'
import { PORT, } from '../../../src/utils/secrets';
import { getConnection } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

const baseURL = `http://localhost:${PORT}/api/v1`;
const agent = request.agent(baseURL);

const registerApp = async (payload: any) => agent
  .post('/register/app')
  .set('Content-type', 'application/json; charset=utf-8')
  .send(payload);

const search = async (headers: any) => agent
  .post('/search/service')
  .set(headers)
  .send();

const validRegisterPayload = {
  name: 'name',
  email: 'email@email.com',
  type: 'eua',
  username: 'username',
  password: 'password',
  phone: '8888888888',
};

describe('Search controller', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Refresh apitoken', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should throw error if authrised call is not there', async () => {
      const searchRes = await search({})
      const body = searchRes.body
      expect(body.statusCode).toEqual(401)
      expect(body.message).toEqual('invalid token...')
    })

    it('should return empty response if hsp is not registered', async () => {
      const registerAppRes = await registerApp(validRegisterPayload)
      const searchRes = await search({
        accesstoken: registerAppRes.body.access_token
      })
      expect(searchRes.body.services.length).toEqual(0)
    })
  })
})
