import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthPayload, VendorPayload } from '../dto';
import { JWT_SECRET } from '../config';
// Password Encryption & Decryption
// generate a Salt
// encrypt the password using the salt
// use the same salt to decrypt the password during user Auth

export const GenerateSalt = async () => {
    const saltRounds = 10;
    return await bcrypt.genSalt(saltRounds);
}

export const EncryptedPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
}

export const GenerateToken = async (payload: VendorPayload) => {
    return await jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: '1d' }
    );
}

export const SetTokenCookie = (res: Response, token: string) => {

    // Send JWT token in a HTTP-only cookie
    // HTTP-only cookies cannot be accessed by client-side JavaScript, which adds an extra layer of security.
    return res.cookie('authToken', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Max age in milliseconds (1 day)
};

