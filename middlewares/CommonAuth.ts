import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { AuthPayload } from "../dto";
import { JWT_SECRET } from '../config';


// currently, when we wrote "req.user" to store info inside a user object of req, it gave an error, since it didnt recognize "user"
// code to enable "user" inside the Request interface of 'express'
// Extend the Request interface of Express to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

// Note: I tried to use "req.user" (alongside "next()") under TokenVerify under PasswordUtil.ts. But, It still didnt recognize "user" there. 
// Meaning, we could only use "req.user" (alongside "next()") here, where we've mentioned the above code tp resolve the error

export const TokenVerify = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.authToken;

    if(!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = decoded; // attach user object to request for further processing
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
