import app from '../../../src/server'
import ClientDAO from '../../../src/dao/client'
import ApiDAO from '../../../src/dao/api'
import ChannelDAO from '../../../src/dao/channel'
import { Client, ClientType, } from '../../../src/entity/Client'
import { Channel, ChannelName, } from '../../../src/entity/Channel'
import { Api } from '../../../src/entity/Api'
import { getRepository, getConnection, } from 'typeorm';

const deleteAllContents = () => {
  return getConnection().synchronize(true)
}

describe('Client DAO', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Save client', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should throw error if name is not provided in client', async () => {
      const client = new Client()
      client.type = ClientType.EUA

      try {
        await ClientDAO.save(client)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'name' doesn't have a default value")
      }
    })

    it('Should throw error if username is not provided in client', async () => {
      const client = new Client()
      client.name = 'eua'

      try {
        await ClientDAO.save(client)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'username' doesn't have a default value")
      }
    })

    it('Should throw error if password is not provided in client', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'

      try {
        await ClientDAO.save(client)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'password' doesn't have a default value")
      }
    })

    it('Should throw error if phone is not provided in client', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'

      try {
        await ClientDAO.save(client)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'phone' doesn't have a default value")
      }
    })

    it('Should throw error if email is not provided in client', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'

      try {
        await ClientDAO.save(client)
      } catch(e) {
        expect(e.message).toEqual("ER_NO_DEFAULT_FOR_FIELD: Field 'email' doesn't have a default value")
      }
    })

    it('Should accept if correct data provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
    })

    it('Should accept if correct data and documents provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'
      client.documents = ['document1']

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.documents).toEqual(client.documents)
    })

    it('Should accept if correct data and registration provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'
      client.documents = ['document1']
      client.registration = 'registration'

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]

      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.documents).toEqual(client.documents)
      expect(allClients!.registration).toEqual(client.registration)
    })

    it('Should accept if correct data and gateway_jwt_secret provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'
      client.documents = ['document1']
      client.registration = 'registration'
      client.gateway_jwt_secret = 'gateway_jwt_secret'

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]

      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.documents).toEqual(client.documents)
      expect(allClients!.registration).toEqual(client.registration)
      expect(allClients!.gateway_jwt_secret).toEqual(client.gateway_jwt_secret)
    })

    it('Should accept if correct data and endpoints provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'
      client.documents = ['document1']
      client.registration = 'registration'
      client.gateway_jwt_secret = 'gateway_jwt_secret'

      const api = new Api()
      api.type = 'GET'
      api.url = 'url'

      const apiRes = await ApiDAO.save(api)
      client.endpoints = [apiRes]

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]

      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.documents).toEqual(client.documents)
      expect(allClients!.registration).toEqual(client.registration)
      expect(allClients!.gateway_jwt_secret).toEqual(client.gateway_jwt_secret)

      expect(clientRes!.endpoints.length).toEqual(1)

      const allApis = await getRepository(Api).find()
      expect(allApis.length).toEqual(1)
    })

    it('Should accept if correct data and channel provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'
      client.documents = ['document1']
      client.registration = 'registration'
      client.gateway_jwt_secret = 'gateway_jwt_secret'

      const channel = new Channel()
      channel.name = ChannelName.PHONE

      const channelRes = await ChannelDAO.save(channel)
      client.supported_channels = [channelRes]

      const clientRes = await ClientDAO.save(client)
      const allClientsRes = await getRepository(Client).find()
      expect(allClientsRes.length).toEqual(1)
      const allClients = allClientsRes[0]

      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.username).toEqual(client.username)
      expect(allClients!.password).toEqual(client.password)
      expect(allClients!.phone).toEqual(client.phone)
      expect(allClients!.email).toEqual(client.email)
      expect(allClients!.name).toEqual(client.name)
      expect(allClients!.documents).toEqual(client.documents)
      expect(allClients!.registration).toEqual(client.registration)
      expect(allClients!.gateway_jwt_secret).toEqual(client.gateway_jwt_secret)

      expect(clientRes!.supported_channels.length).toEqual(1)

      const allChannles = await getRepository(Channel).find()
      expect(allChannles.length).toEqual(1)
    })
  })

  describe('Get client by id', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should get undefined as result if id does not exist in db', async () => {
      const clientGetRes = await ClientDAO.getClientById(212)
      expect(clientGetRes).toEqual(undefined)
    })

    it('Should give result if correct id provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'

      const clientRes = await ClientDAO.save(client)
      const clientGetRes = await ClientDAO.getClientById(clientRes!.id)
      expect(clientGetRes!.name).toEqual(client.name)
      expect(clientGetRes!.username).toEqual(client.username)
      expect(clientGetRes!.password).toEqual(client.password)
      expect(clientGetRes!.email).toEqual(client.email)
      expect(clientGetRes!.phone).toEqual(client.phone)
    })
  })

  describe('Get client by usename', () => {
    beforeEach(async () => {
      await deleteAllContents()
    })

    it('Should get undefined as result if username does not exist in db', async () => {
      const clientGetRes = await ClientDAO.getClientByUserName('invalidUsername')
      expect(clientGetRes).toEqual(undefined)
    })

    it('Should give result if correct id provided', async () => {
      const client = new Client()
      client.name = 'eua'
      client.username = 'eua'
      client.password = 'password'
      client.phone = '8888888888'
      client.email = 'email'

      const clientRes = await ClientDAO.save(client)
      const clientGetRes = await ClientDAO.getClientByUserName(clientRes!.username)
      expect(clientGetRes!.name).toEqual(client.name)
      expect(clientGetRes!.username).toEqual(client.username)
      expect(clientGetRes!.password).toEqual(client.password)
      expect(clientGetRes!.email).toEqual(client.email)
      expect(clientGetRes!.phone).toEqual(client.phone)
    })
  })
})
