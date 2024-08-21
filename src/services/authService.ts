import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.modal';
import dotenv from 'dotenv';
import { AppError, handleError } from '../middleware/errorHandler';
import { NextFunction } from 'express';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

export const registerUser = async (userData: any, next: NextFunction) => {
  try {
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const user = await User.create(userData);

    return {
        _id:user._id,
        username: user.username
    }
  } catch (error) {
    const handledError = handleError(error);
    return next(handledError);
  }
};


export const loginUser = async (username: string, password: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  return {
    token,
    userDetails: {
      _id: user._id,
      username: user.username,
    },
  };
};