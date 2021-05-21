const request = require('supertest')
import app from '../../../src/server'
import { PORT, } from '../../../src/utils/secrets';

const baseURL = `http://localhost:${PORT}`;
const agent = request.agent(baseURL);

const getStatus = async () => agent
  .get('/status')
  .send();

describe('Entry controller', () => {
  beforeAll(async () => {
    await app.start()
  })

  afterAll(async () => {
    await app.stop()
  })

  describe('Check status', () => {
    it('should return status', async () => {
      const statusRes = await getStatus()
      expect(statusRes.text).toEqual('ok')
    })
  })
})
