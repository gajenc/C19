import { Request, Response } from "express";
import { validator } from "../helpers/validator";
import logger from "../utils/logger";

class Validation {
  register = (req: Request, res: Response, next: any) => {
    const validationRule = {
      name: "required|string",
      email: "email",
      type: "string|required_without:types",
      username: "required|string|exists:Client,username",
      phone: "string|size:10",
      password: "required|string|min:6",
      documents: "array",
      types: "array",
      "location.type": "string",
      "location.gps.lat": "integer",
      "location.gps.lon": "integer",
      "supported_channels": "array",
      "endpoints": "required|array"
    };

    validator(req.body, validationRule, {}, (err: any, status: boolean) => {
      if (!status) {
        logger.error("Register validation failed ", err);
        res.status(412)
          .send({
            success: false,
            message: "Validation failed",
            data: err
          });
      } else {
        next();
      }
    });
  }

  login = (req: Request, res: Response, next: any) => {
    const validationRule = {
      username: "required|string",
      password: "required|string",
    };

    validator(req.body, validationRule, {}, (err: any, status: boolean) => {
      if (!status) {
        res.status(412)
          .send({
            success: false,
            message: "Validation failed",
            data: err
          });
      } else {
        next();
      }
    });
  }

  update = (req: Request, res: Response, next: any) => {
    const validationRule = {
      id: "required|integer|same:authClient.id",
      name: "string",
      email: "email",
      type: "string",
      phone: "string|size:10",
      documents: "array",
      "location.type": "string",
      "location.gps.lat": "integer",
      "location.gps.lon": "integer",
      "supported_channels": "array",
      "endpoints": "array"
    };

    const body = {
      ...req.body,
      authClient: req.headers["authenticated-client"]
    };
    validator(body, validationRule, {}, (err: any, status: boolean) => {
      if (!status) {
        logger.error("Register validation failed ", err);
        res.status(412)
          .send({
            success: false,
            message: "Validation failed",
            data: err
          });
      } else {
        next();
      }
    });
  }

  refreshAccessToken = (req: Request, res: Response, next: any) => {
    const validationRule = {
      refresh_token: "required|string"
    };

    validator(req.body, validationRule, {}, (err: any, status: boolean) => {
      if (!status) {
        res.status(412)
          .send({
            success: false,
            message: "Validation failed",
            data: err
          });
      } else {
        next();
      }
    });
  }
}

export default new Validation();
