import "reflect-metadata";
import * as express from "express";
import { Application } from "express";
import { createConnection, Connection } from "typeorm";
import logger from "./utils/logger";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class App {
  private app: Application
  private port: number
  private server: any
  private connection: Connection

  constructor(appInit: {
    port: number;
    db: {
      host: string;
      port: number;
      user: string;
      password: string;
      name: string;
    };
    middleWares: any;
    controllers: any;
  }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.createConnection(appInit.db);
  }

  private createConnection(db: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  }) {
    createConnection({
      type: "postgres",
      host: db.host,
      port: db.port,
      username: db.user,
      password: db.password,
      database: db.name,
      entities: [
        __dirname + "/entity/*.js",
        __dirname + "/entity/*.ts"
      ],
      synchronize: true,
      logging: false,
    })
      .then(connection => {
        this.connection = connection;
        logger.debug("Database connection established");
      });
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  }

  public async start() {
    while (!this.connection) {
      await wait(200);
    }

    this.server = this.app.listen(this.port, () => {
      logger.info(`App is listening on the http://localhost:${this.port}`);
    });

    return "Server is ready";
  }

  public stop() {
    this.server.close();
    return "Stopped";
  }
}

export default App;
