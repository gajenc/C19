const NodeRSA = require('node-rsa')
const crypto = require('crypto')
import authHelper from '../../../src/utils/auth-helper'
import { API_TOKEN_PUBLICKEY } from '../../../src/utils/secrets';

describe('AuthHelper', () => {
  describe('Get api token publicKey', () => {
    it('Should return api token publicKey', async () => {
      const apiTokenKey = authHelper.getApiTokenPublicKey()
      expect(apiTokenKey).toEqual({
        publicKey: API_TOKEN_PUBLICKEY,
        encoding: 'base64'
      })
    })
  })

  describe('Generate app secret', () => {
    it('Should return 96 chars hex', async () => {
      const appsecret = authHelper.generateAppSecret()
      expect(appsecret.length).toEqual(96)
    })
  })
})
