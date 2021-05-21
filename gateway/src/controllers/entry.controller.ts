import * as express from "express";
import { Request, Response } from "express";
import ControllerBase from "../interfaces/ControllerBase.interface";
import Entry from "../services/entry";
import { isAuthenticated } from "../middleware/auth";
import Validation from "../middleware/validation-middleware";
import logger from "../utils/logger";

class EntryController implements ControllerBase {
  private path = "/api/v1"
  private router = express.Router()

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.post(`${this.path}/register/app`, Validation.register, this.register);
    this.router.post(`${this.path}/login/app`, Validation.login, this.login);
    this.router.post(`${this.path}/update/app`, isAuthenticated, Validation.update, this.update);
  }

  register = async (req: Request, res: Response) => {
    try {
      const data: any = await new Entry().register(req.body);
      res.send(data).status(200);
    } catch (e) {
      logger.error("Error in EntryController.register ", e);
      res.status(500).send({ code: 500, message: e.message });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      const data: any = await new Entry().login(req.body);
      res.send(data).status(200);
    } catch (e) {
      console.log(e);
      logger.error("Error in EntryController.login ", e);
      res.status(401).send({ code: 401, message: e.message });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const data: any = await new Entry().update(req.body);
      res.send(data).status(200);
    } catch (e) {
      logger.error("Error in EntryController.update ", e);
      res.status(500).send({ code: 500, message: e.message });
    }
  }
}

export default EntryController;
