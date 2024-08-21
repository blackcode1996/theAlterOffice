import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token is missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        req.body.authorId = decodedToken.id; 

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is invalid or expired' });
    }
};