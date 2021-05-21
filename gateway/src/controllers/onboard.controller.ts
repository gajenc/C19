import * as express from 'express'
import { Request, Response } from 'express'
import ControllerBase from '../interfaces/ControllerBase.interface'
import { isAuthenticated } from '../middleware/auth' 
import Onboard from '../services/onboard' 

class OnboardController implements ControllerBase {
  public path = '/api/v1/onboard'
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.post(`${this.path}/dryrun`, isAuthenticated, this.dryRun)
  }

  dryRun = async (req: Request, res: Response) => {
    try {
      const data: any = await new Onboard().dryRun(req.headers['authenticated-client'], req.body);
      res.send(data).status(200);
    } catch (e) {
      res.status(500).send({ code: 500, message: e.message })
    }    
  }
}

export default OnboardController
