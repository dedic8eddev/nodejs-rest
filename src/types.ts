import { NextFunction, Request, Response } from "express";

export interface IValidatedMethod {
  call(...args: any[]): any;
  run(...args: any[]): any;
  _execute(context: any, ...args: any[]): any;
}

export type HttpMethods = "get" | "post" | "put" | "patch" | "delete" | "copy" | "head" | "options" | "link" | "unlink" | "purge" | "lock" | "unlock" | "propfind" | "view";

export interface ICollectionSchema {
  clean(arg: any): any;
  validate(arg: any): any;
}

export interface IConfig {
  routerId: string;
  route: string;
  method: string;
  middleware?: string;
}

export interface IRequest extends Request {
  context?: any;
}

export interface IOptions {
  routerId: string,
  httpMethod: HttpMethods,
  path: string,

  request?: {
    bodySrc?: string,
    schema?: object
  },
  response?: {
    schema?: object
  }
}

export type IResponse = Response;

export type INextFunction = NextFunction;