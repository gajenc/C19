import { Request, Response } from 'express'
import logger from '../utils/logger'

export const loggerMiddleware = (req: Request, resp: Response, next: any) => {
  if(req.path !== '/status') logger.debug(`Request logged: ${req.method} ${req.path}`)
  next()
}
