class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  description?: object;
  constructor(message: string, statusCode: number, description?: object) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.description = description;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
