import { HttpException } from "@/exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export enum RequestTarget {
  BODY = "body",
  QUERY = "query",
}

const InputValidationMiddleware = (
  type: any,
  target: string = RequestTarget.BODY,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestTarget = target === RequestTarget.QUERY ? req.query : req.body;
    const dto = plainToInstance(type, requestTarget);
    validateOrReject(dto, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted,
    })
    .then(() => {
        req.body = dto;
        next();
      })
      .catch((errors: ValidationError[]) => {
        const message = errors
          .map((error: ValidationError) => Object.values(error.constraints))
          .join(", ");
        next(new HttpException(httpStatus.BAD_REQUEST, message));
      });
  };
};

export default InputValidationMiddleware;
