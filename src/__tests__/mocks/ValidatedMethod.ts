import { IValidatedMethod } from "../../types";

export class ValidatedMethod implements IValidatedMethod {
  private dataToRepsond = {};

  constructor(dataToRepsond: any) {
    this.dataToRepsond = dataToRepsond;
  }

  public call(...args: any[]) {
    const cb = args[args.length - 1];

    // Pretend we are doing something
    process.nextTick(() => {
      cb(this.dataToRepsond);
    });
  }

  public run(...args: any[]) {
    const cb = args[args.length - 1];

    return cb(this.dataToRepsond);
  }

  public _execute(context: any, ...args: any[]) {
    throw new Error("Method not implemented.");
  }
}