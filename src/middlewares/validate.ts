import { NextFunction, query, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";
import AppError from "../utils/appError";

const validateSchema =
  (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError("Validation failed", 400, error.errors);
      }
    }
  };

export default validateSchema;
