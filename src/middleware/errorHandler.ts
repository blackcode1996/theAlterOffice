import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Custom AppError class
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error: unknown): AppError => {

  if (error instanceof AppError) {
    return error;
  }

  if (error && typeof error === 'object' && (error as any).code === 11000) {
    return new AppError('User already registered', 409);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new AppError('Validation error occurred', 400);
  }

  if (error instanceof mongoose.Error && (error as any).name === 'MongoNetworkError') {
    return new AppError('Database connection error', 503);
  }

  if (error instanceof Error && error.name === 'JsonWebTokenError') {
    return new AppError('Invalid token, please log in again', 401);
  }

  if (error instanceof Error && error.name === 'TokenExpiredError') {
    return new AppError('Your session has expired, please log in again', 401);
  }

  if (error instanceof Error && error.message.includes('Too many requests')) {
    return new AppError('Too many requests, please try again later', 429);
  }

  if (error instanceof Error && error.message.includes('Not Found')) {
    return new AppError('Resource not found', 404);
  }

  return new AppError('An unknown error occurred', 500, false);
};


export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.isOperational) {
    console.error('Unexpected error:', err);
  }

  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
