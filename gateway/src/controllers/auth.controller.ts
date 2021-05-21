import * as express from 'express'
import { Request, Response } from 'express'
import ControllerBase from '../interfaces/ControllerBase.interface'
import Auth from '../services/auth'
import Validation from '../middleware/validation-middleware'
import { isAuthenticated } from '../middleware/auth'
import logger from '../utils/logger'

class AuthController implements ControllerBase {
  private path = '/api/v1'
  private router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.post(`${this.path}/refresh-accesstoken/app`, Validation.refreshAccessToken, this.refreshAccessToken)
    this.router.post(`${this.path}/refresh-apitoken/app`, isAuthenticated, this.refreshAPIToken)
    this.router.get(`${this.path}/publickey`, this.fetchPublicKey)
  }

  refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const data: any = await new Auth().refreshAccessToken(req.body)
      res.send(data).status(200)
    } catch (e) {
      logger.error('Error in refreshAccessToken ', e)
      res.status(401).send({ code: 401, message: e.message })
    }
  }

  refreshAPIToken = async (req: Request, res: Response) => {
    try {
      const data: any = await new Auth().refreshAPIToken(req.headers['authenticated-client'])
      res.send(data).status(200)
    } catch (e) {
      logger.error('Error in refreshAPIToken ', e)
      res.status(401).send({ code: 401, message: e.message })
    }
  }

  fetchPublicKey = async (req: Request, res: Response) => {
    try {
      const data: any = await new Auth().fetchPublicKey()
      res.send(data).status(200)
    } catch (e) {
      res.status(404).send('No public keys found');
    }
  }
}

export default AuthController
