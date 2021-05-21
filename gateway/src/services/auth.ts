import ClientDAO from '../dao/client'
import authHelper from '../utils/auth-helper';
import logger from '../utils/logger';

class Auth {

  refreshAPIToken = async (data: any) => {
    const client = await ClientDAO.getClientById(data.id, { relations: ["types"] });
    return {
      api_token: authHelper.generateApiToken({ id: client!.id, name: client!.name, types: client!.types })
    }
  }

  refreshAccessToken = async (data: any) => {
    try {
      const decoded = authHelper.verify('refresh_token', data.refresh_token);
      const tokenData = decoded.data;
      if(!tokenData || !tokenData.id) throw new Error('Invalid Refresh Token');
      const client = await ClientDAO.getClientById(tokenData!.id, { relations: ["types"] });
      return {
        access_token: authHelper.generateAccessToken({ id: client!.id, name: client!.name, types: client!.types })
      }
    } catch (error) {
      logger.error('Error in Auth.refreshAccessToken ', error);
      throw error;
    }
  }

  fetchPublicKey = async () => {
    const data = authHelper.getApiTokenPublicKey();
    return {
      public_key: data.publicKey,
      encoding: data.encoding
    }
  }

}

export default Auth
