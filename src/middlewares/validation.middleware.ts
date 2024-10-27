import { HttpException } from "@/exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { validateOrReject, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const InputValidationMiddleware = (
  type: any,
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
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
