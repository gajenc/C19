import * as express from 'express'
import { Request, Response } from 'express'
import ControllerBase from '../interfaces/ControllerBase.interface'

class HealthCheckController implements ControllerBase {
  public path = ''
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.get(`${this.path}/status`, this.status)
  }

  status = (req: Request, res: Response) => {    
    res.send('ok').status(200);
  }
}

export default HealthCheckController
