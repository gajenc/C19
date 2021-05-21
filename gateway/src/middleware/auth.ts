import { Request, Response, NextFunction } from 'express';
import authHelper from '../utils/auth-helper';
import logger from '../utils/logger';

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers || {};
  const at = headers['accesstoken'] ? headers['accesstoken'].toString() : '';
  try {
    const decoded = authHelper.verify('access_token', at);
    if (decoded) {
      req.headers['authenticated-client'] = decoded.data;
      next();
    } else res.send({ statusCode: 401, message: 'invalid token...' });
  } catch (error) {
    logger.error('Auth Failed', error);
    res.send({ statusCode: 401, message: 'invalid token...' });
  }  
};
