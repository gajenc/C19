const request = require('supertest')
import app from '../../../src/server'
import { PORT, } from '../../../src/utils/secrets';
import { getConnection } from 'typeorm';
import { API_TOKEN_PUBLICKEY } from '../../../src/utils/secrets';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

const baseURL = `http://localhost:${PORT}/api/v1`;
const agent = request.agent(baseURL);

const registerApp = async (payload: any) => agent
  .post('/register/app')
  .set('Content-type', 'application/json; charset=utf-8')
  .send(payload);

const refreshAccesstoken = async (payload: any) => agent
  .post('/refresh-accesstoken/app')
  .set('Content-type', 'application/json; charset=utf-8')
  .send(payload);

const refreshApitoken = async (headers: any) => agent
  .post('/refresh-apitoken/app')
  .set(headers)
  .send();

const getPublickey = async () => agent
  .get('/publickey')
  .send();

const validRegisterPayload = {
  name: 'name',
  email: 'email@email.com',
  type: 'eua',
  username: 'username',
  password: 'password',
  phone: '8888888888',
};

describe('Auth controller', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Refresh accesstoken', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should throw error if refresh token is not provided', async () => {
      const registerResponse = await refreshAccesstoken({})
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.refresh_token.toString()).toEqual('The refresh token field is required.')
    })

    it('should throw error if invalid refresh token is not provided', async () => {
      const refTokenRes = await refreshAccesstoken({ refresh_token: 'invalidRefreshToken' })
      const body = refTokenRes.body
      expect(body.code).toEqual(401)
      expect(body.message).toEqual('jwt malformed') 
    })

    it('should return correct access token if valid refresh token provided', async () => {
      const registerAppRes = await registerApp(validRegisterPayload)
      const payload = {
        refresh_token: registerAppRes.body.refresh_token
      }
      const refTokenRes = await refreshAccesstoken(payload)
      expect(refTokenRes.body.access_token).not.toEqual(0)
    })
  })

  describe('Refresh apitoken', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should throw error if authrised call is not there', async () => {
      const refApiTokenRes = await refreshApitoken({})
      const body = refApiTokenRes.body
      expect(body.statusCode).toEqual(401)
      expect(body.message).toEqual('invalid token...')
    })

    it('should throw error if invalid accesstoken provided', async () => {
      const refApiTokenRes = await refreshApitoken({accesstoken: 'invalidAccesstoken'})
      const body = refApiTokenRes.body
      expect(body.statusCode).toEqual(401)
      expect(body.message).toEqual('invalid token...')
    })

    it('should return new apitoken if valid access token provided', async () => {
      const registerAppRes = await registerApp(validRegisterPayload)
      const refApiTokenRes = await refreshApitoken({
        accesstoken: registerAppRes.body.access_token
      })

      expect(refApiTokenRes.body.api_token).not.toEqual(0)
    })
  })

  describe('Get publickey', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should return correct public key', async () => {
      const publicKeyRes = await getPublickey()
      const publicKey = JSON.parse(publicKeyRes.text)
      expect(publicKey).toEqual({
        public_key: API_TOKEN_PUBLICKEY,
        encoding: 'base64'
      })
    })
  })
})
