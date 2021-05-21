import { PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV, } from "./utils/secrets";
import App from "./app";
import middleware from "./middleware";
import * as controllers from "./controllers";

const app = new App({
  port: +PORT,
  db: {
    host: DB_HOST,
    port: +DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    name: DB_NAME,
  },
  controllers: controllers.default,
  middleWares: middleware,
});

if (NODE_ENV !== "test") app.start();

export default app;
