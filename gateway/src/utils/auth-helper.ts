import * as moment from 'moment';
const NodeRSA = require('node-rsa');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
import { ACCESSTOKEN_SECRET, REFRESHTOKEN_SECRET, API_TOKEN_PRIVATEKEY, API_TOKEN_PUBLICKEY } from './secrets';
import logger from '../utils/logger'

const generateToken = (param: any, data: any) => {
    const token = jwt.sign({ exp: moment.utc().add(param.ttl, 'minute').valueOf(), data: data }, param.secret, { algorithm: param.algorithm, issuer: "healthgateway" });
    return token;
}

class AuthHelper {
    verify(type: string, token: string) {
        let secret = null, maxAge = '1h';
        switch (type) {
            case 'access_token':
                secret = ACCESSTOKEN_SECRET;
                maxAge = '24h';
                break;
            case 'refresh_token':
                secret = REFRESHTOKEN_SECRET;
                maxAge = '15d'                
                break;
            default:
                break;
        }
        try {
            const data = jwt.verify(token, secret, { maxAge });
            const hasExpired = moment.utc(data.exp).isBefore(moment.utc());
            if(!hasExpired) return data;
            else return false;
        } catch (error) {
            logger.error('jwt verification failed.',error);
            return false;
        }
    }

    generateApiToken(data: object) {
        const token = generateToken({ ttl: 10, secret: Buffer.from(API_TOKEN_PRIVATEKEY, 'base64').toString('ascii'), algorithm: 'RS256' }, data)
        return token;
    }

    generateAccessToken(data: object) {
        const token = generateToken({ ttl: 10, secret: ACCESSTOKEN_SECRET, algorithm: 'HS256' }, data)
        return token;
    }

    generateRefreshToken(data: object) {
        const token = generateToken({ ttl: 10 * 60 * 24 * 15, secret: REFRESHTOKEN_SECRET, algorithm: 'HS256' }, data)
        return token;
    }

    generateGatewayToken(secret: string, data: object) {
        const token = generateToken({ ttl: 10, secret: secret, algorithm: 'HS256' }, data)
        return token;
    }

    generateAppSecret() {
        return crypto.randomBytes(48).toString('hex');
    }

    generateRSAKeyPair() {
        const key = new NodeRSA();
        const publicKey = Buffer.from(key.exportKey('pkcs8-public-pem')).toString('base64');
        const privateKey = Buffer.from(key.exportKey('pkcs8-pem')).toString('base64');
        return { privateKey, publicKey }
    }

    getApiTokenPublicKey() {
        return {
            publicKey: API_TOKEN_PUBLICKEY,
            encoding: 'base64'
        }
    }
}

export default new AuthHelper()
