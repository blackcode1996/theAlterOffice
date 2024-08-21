import { NextFunction, Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { AppError } from '../middleware/errorHandler';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUser(req.body, next);
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const { token, userDetails } = await loginUser(username, password);

    res.status(200).json({ token, userDetails });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    } else if (error instanceof Error) {
      return next(new AppError(error.message, 400));
    } else {
      return next(new AppError('An unknown error occurred', 500));
    }
  }
};
