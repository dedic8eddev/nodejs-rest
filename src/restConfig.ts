import * as Ajv from "ajv";
import * as express from "express";
import { Logger } from "winston";
import { IConfig, INextFunction, IOptions, IRequest, IResponse, IValidatedMethod } from "./types";

/**
 * Main Rest Configuration class
 */
export class RestConfigClass {
  /**
   * Winston logger instance
   */
  public logger: Logger;

  private Meteor: any;
  /**
   * Express app instance
   */
  private RestApp: express.Express;

  private validator: Ajv.Ajv;
  /**
   * Internal routers
   */
  private routers = {};
  /**
   * Applied middlewares
   */
  private middlewares = {};
  /**
   * Builds Rest Config instance
   * @param RestApp Express app instance
   * @param validator Validator instance
   */
  constructor(RestApp: express.Express, logger: Logger) {
    this.RestApp = RestApp;
    this.logger = logger;
    this.validator = new Ajv();

    logger.debug("Rest instance built");
  }

  /**
   * Build and return new express router
   * @param routerId New Router id: v1, v2
   * @param path Router prefix path: /v1, /v2
   * @param options additional options
   */
  public buildRouter(routerId: string, path: string, options?: express.RouterOptions) {
    const router = express.Router(options);
    this.RestApp.use(path, router);

    this.routers[routerId] = router;

    this.logger.debug(`Built new Router ${routerId} on ${path} path`);
    return router;
  }

  /**
   * Returns Router
   * @param routerId Router id 
   */
  public getRouter(routerId: string) {
    return this.routers[routerId];
  }

  /**
   * Returns Meteor instance
   */
  public getMeteor() {
    return this.Meteor;
  }

  /**
   * Setup Meteor instance
   * @param Meteor Meteor instance
   */
  public setMeteor(Meteor: any) {
    this.Meteor = Meteor;
  }

  /**
   * Add validated method to the route
   * @param routerId Router Instance Id
   * @param httpMethod HTTP Method to handle: GET, POST....
   * @param path Route
   * @param validatedMethod Validated Method instance
   * @param options Additional options
   */
  public addValidatedMethod(validatedMethod: IValidatedMethod, options: IOptions) {
    const {
      routerId,
      httpMethod,
      path,
      request = {},
      response = {}
    } = options;

    const router = this.getRouter(routerId);
    const Meteor = this.getMeteor();

    if (!Meteor) {
      throw new Error("Meteor instance is not setup: call RestConfig.setMeteor(Meteor) before creating any routes");
    }
    if (!router) {
      throw new Error(`Router ${routerId} not found: call buildRouter() before addValidatedMethod()`);
    }
    const method = router[httpMethod.toLowerCase()];

    if (!method) {
      throw new Error(`HTTP Method ${httpMethod} not found in router`);
    }

    const self = this;
    function routeProcessor(req: IRequest, res: IResponse, next: INextFunction) {
      const body = req[request.bodySrc || "body"];

      if (request.schema) {
        const result = self.validator.validate(request.schema, body);

        if (!result) {
          res.status(500);

          self.logger.error("Request validation exception");
          self.logger.error(JSON.stringify(self.validator.errors))
          res.send({
            error: "Request validation exception"
          });
          return;
        }
      }

      const sendError = (error: any) => {
        res.status(500);
        res.send(error);
      };

      const validateSchemaAndSend = (result: any) => {
        if (response.schema) {
          const responseValidation = self.validator.validate(response.schema, result)
          if (responseValidation) {
            res.send(result)
          } else {
            self.logger.error("Response validation error");
            self.logger.error(JSON.stringify(self.validator.errors))

            res.status(500);
            res.send({
              error: "Response validation error"
            });
          }
        } else {
          res.send(result);
        }
      };

      try {
        // need execute to provide custom context
        const context = req.context;

        function callback(err?: Error, result: any = {}) {

          if (self.isNativePromise(result)){
            result.then( (myRes: any) => {
              if (myRes.error){
                sendError(myRes.error);
              }else{
                validateSchemaAndSend(myRes);
              }
            }).catch( (myErr: any) => {
              sendError(myErr.message);
            });
          } else{
            if (err) {
              sendError(err.message);
            } else if (result.error) {
              sendError(result);
            } else {
              validateSchemaAndSend(result);
            }
          }

        };

        if (context) {
          try {
            const result = validatedMethod.run.bind(context)(body, callback);
            callback(undefined, result);
          } catch (ex) {
            callback(ex, undefined);
          }
        } else {
          validatedMethod.call(body, callback);
        }
      } catch (ex) {
        res.status(500);
        res.send({
          error: ex.message
        });
      }
    }

    method.call(router, path, Meteor.bindEnvironment(routeProcessor));
  }

  /**
   * Register new middleware
   * @param name middleware name
   * @param middleware middleware function
   */
  public addMiddleware(name: string, middleware: any) {
    const Meteor = this.getMeteor();

    if (!Meteor) {
      throw new Error("Meteor instance is not setup: call RestConfig.setMeteor(Meteor) before adding middlewares");
    }

    this.middlewares[name] = Meteor.bindEnvironment(middleware);
  }

  /**
   * Apply new configuration to the route
   * @param configObj Configuration object
   */
  public config(configObj: IConfig) {
    if (configObj.middleware) {
      this.logger.debug(`Applying middleware ${configObj.middleware} on ${configObj.routerId}/${configObj.method}:${configObj.route}`);

      this.applyMiddleware(configObj);
    }
  }

  private applyMiddleware(configObj: IConfig) {
    const router = this.getRouter(configObj.routerId);
    const middleware = this.middlewares[configObj.middleware || ""];

    if (router) {
      router.use(configObj.route, (req: IRequest, res: IResponse, next: INextFunction) => {
        middleware(req, res).then((context: any) => {
          req.context = context;
          next();
        }, (ex: Error) => {
          res.status(500);
          res.send({
            error: ex.message
          })
        });
      });
    }
  }

  private isNativePromise(p:any) {
    return p && typeof p.constructor === "function"
      && Function.prototype.toString.call(p.constructor).replace(/\(.*\)/, "()")
      === Function.prototype.toString.call(/*native object*/Function)
        .replace("Function", "Promise") // replacing Identifier
        .replace(/\(.*\)/, "()"); // removing possible FormalParameterList 
  }
}