import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { type Error as MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";
import logger from "../utils/logger";
import "dotenv/config";

// Type for custom error with all needed properties
interface CustomError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
  name: string;
  code?: number;
  path?: string;
  value?: any;
  errors?: Record<string, MongoServerError | MongooseError.ValidatorError>; // For ValidationError  stack?: string
  errmsg?: string; // MongoDB error message
  stack?: string;
}

const handleCastErrorDB = (err: MongooseError.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoServerError) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const value = err.message;
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongooseError.ValidationError) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: CustomError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    logger.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "CastError")
      error = handleCastErrorDB(error as unknown as MongooseError.CastError);
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error as unknown as MongoServerError);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(
        error as unknown as MongooseError.ValidationError
      );
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}
