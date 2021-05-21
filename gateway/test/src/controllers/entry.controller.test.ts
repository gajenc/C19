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

const loginApp = async (payload: any) => agent
  .post('/login/app')
  .set('Content-type', 'application/json; charset=utf-8')
  .send(payload);

const validRegisterPayload = {
  name: 'name',
  email: 'email@email.com',
  type: 'eua',
  username: 'username',
  password: 'password',
  phone: '8888888888',
};

describe('Entry controller', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Register app', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should throw error if data is not provided', async () => {
      const registerResponse = await registerApp({})
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.name[0]).toEqual('The name field is required.')
      expect(body.data.errors.email[0]).toEqual('The email field is required.')
      expect(body.data.errors.type[0]).toEqual('The type field is required.')
      expect(body.data.errors.username[0]).toEqual('The username field is required.')
      expect(body.data.errors.phone[0]).toEqual('The phone field is required.')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if only name is provided', async () => {
      const payload = {
        name: 'name',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.email[0]).toEqual('The email field is required.')
      expect(body.data.errors.type[0]).toEqual('The type field is required.')
      expect(body.data.errors.username[0]).toEqual('The username field is required.')
      expect(body.data.errors.phone[0]).toEqual('The phone field is required.')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if email is not valid', async () => {
      const payload = {
        name: 'name',
        email: 'email',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.email[0]).toEqual('The email format is invalid.')
      expect(body.data.errors.type[0]).toEqual('The type field is required.')
      expect(body.data.errors.username[0]).toEqual('The username field is required.')
      expect(body.data.errors.phone[0]).toEqual('The phone field is required.')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if username is not provided', async () => {
      const payload = {
        name: 'name',
        email: 'email@email.com',
        type: 'eua',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.username[0]).toEqual('The username field is required.')
      expect(body.data.errors.phone[0]).toEqual('The phone field is required.')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if phone is not provided', async () => {
      const payload = {
        name: 'name',
        email: 'email@email.com',
        type: 'eua',
        username: 'username',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.phone[0]).toEqual('The phone field is required.')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if password is not provided', async () => {
      const payload = {
        name: 'name',
        email: 'email@email.com',
        type: 'eua',
        username: 'username',
        phone: '8888888888',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.password[0]).toEqual('The password field is required.')
    })

    it('should throw error if phone is not string', async () => {
      const payload = {
        name: 'name',
        email: 'email@email.com',
        type: 'eua',
        username: 'username',
        password: 'password',
        phone: 888888888,
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.phone[0]).toEqual('The phone must be a string.')
    })

    it('should throw error if phone length is not 10', async () => {
      const payload = {
        name: 'name',
        email: 'email@email.com',
        type: 'eua',
        username: 'username',
        password: 'password',
        phone: '88888888',
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.phone[0]).toEqual('The phone must be 10 characters.')
    })

    it('should register app if correct data provided', async () => {
      const registerResponse = await registerApp(validRegisterPayload)
      const body = registerResponse.body
      expect(body.name).toEqual(validRegisterPayload.name)
      expect(body.email).toEqual(validRegisterPayload.email)
      expect(body.username).toEqual(validRegisterPayload.username)
      expect(body.type).toEqual(validRegisterPayload.type)
      expect(body.phone).toEqual(validRegisterPayload.phone)
    })

    it('should register app if location data also provided', async () => {
      const payload = {
        ...validRegisterPayload,
        location: {
          type: 'gps',
          gps: {
            lat: 1234,
            lon: 2323,
          },
        },
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.name).toEqual(payload.name)
      expect(body.email).toEqual(payload.email)
      expect(body.username).toEqual(payload.username)
      expect(body.type).toEqual(payload.type)
      expect(body.phone).toEqual(payload.phone)
      expect(body.location.gps.lat).toEqual(payload.location.gps.lat)
      expect(body.location.gps.lon).toEqual(payload.location.gps.lon)
      expect(body.location.type).toEqual(payload.location.type)
    })

    it('should register app if supported_channels data also provided', async () => {
      const payload = {
        ...validRegisterPayload,
        supported_channels: [{
          name: 'phone'
        }, {
          name: 'chat'
        }]
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.name).toEqual(payload.name)
      expect(body.email).toEqual(payload.email)
      expect(body.username).toEqual(payload.username)
      expect(body.type).toEqual(payload.type)
      expect(body.phone).toEqual(payload.phone)
      expect(body.supported_channels.length).toEqual(2)
    })

    it('should register app if endpoints data also provided', async () => {
      const payload = {
        ...validRegisterPayload,
        endpoints: [{
          type: 'GET',
          url: 'mfine.co/1',
        }, {
          type: 'POST',
          url: 'mfine.co/2',
        }]
      }

      const registerResponse = await registerApp(payload)
      const body = registerResponse.body
      expect(body.name).toEqual(payload.name)
      expect(body.email).toEqual(payload.email)
      expect(body.username).toEqual(payload.username)
      expect(body.type).toEqual(payload.type)
      expect(body.phone).toEqual(payload.phone)
      expect(body.endpoints.length).toEqual(2)
    })

    it('should throw error if username is not unique', async () => {
      const payload = {
        ...validRegisterPayload,
      }

      const registerResponse1 = await registerApp(payload)
      const registerResponse2 = await registerApp(payload)
      const body = registerResponse2.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.username.toString()).toEqual('username has already been taken')
    })
  })

  describe('Login app', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('should throw error if username and password not provided', async () => {
      const loginRes = await loginApp({})
      const body = loginRes.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.username.toString()).toEqual('The username field is required.')
      expect(body.data.errors.password.toString()).toEqual('The password field is required.')
    })

    it('should throw error if password not provided', async () => {
      const payload = {
        username: 'username',
      }
      const loginRes = await loginApp(payload)
      const body = loginRes.body
      expect(body.success).toEqual(false)
      expect(body.message).toEqual('Validation failed')
      expect(body.data.errors.password.toString()).toEqual('The password field is required.')
    })

    it('should throw error if username is not registered', async () => {
      const payload = {
        username: 'username',
        password: 'password',
      }
      const loginRes = await loginApp(payload)
      const body = loginRes.body
      expect(body.message).toEqual('invalid username provided')
    })

    it('should throw error if password is not correct', async () => {
      const registerResponse = await registerApp(validRegisterPayload)

      const payload = {
        username: validRegisterPayload.username,
        password: 'invalidPassword',
      }
      const loginRes = await loginApp(payload)
      const body = loginRes.body
      expect(body.message).toEqual('username and password does not match')
    })

    it('should be able to login if correct credentials provided', async () => {
      const registerResponse = await registerApp(validRegisterPayload)

      const payload = {
        username: validRegisterPayload.username,
        password: validRegisterPayload.password,
      }
      const loginRes = await loginApp(payload)
      const body = loginRes.body
      expect(body.name).toEqual(validRegisterPayload.name)
      expect(body.phone).toEqual(validRegisterPayload.phone)
      expect(body.email).toEqual(validRegisterPayload.email)
    })
  })

})
