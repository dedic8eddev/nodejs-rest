import * as bodyParser from "body-parser";
import * as express from "express";

import { logger } from "./logger";
import { RestConfigClass } from "./restConfig";

const RestApp = express();

RestApp.use(bodyParser.json());
RestApp.use(bodyParser.urlencoded({ extended: true }));

const RestConfig = new RestConfigClass(RestApp, logger);

export {
  RestApp,
  RestConfig,
  RestConfigClass
}