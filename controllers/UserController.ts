import { Request, Response, NextFunction } from "express";
import { plainToClass } from 'class-transformer'; // to help us convert the plain (literal) object to class (constructor) object
import { validate } from 'class-validator';
import { CreateUserInputs } from "../dto";
import { EncryptedPassword, GenerateSalt } from "../utility";
import { User } from "../models";

export const UserSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInputs = plainToClass(CreateUserInputs, req.body);

        const inputErrors = await validate(userInputs, { validationError: { target: true } });

        if (inputErrors.length > 0) {
            return res.status(400).json(inputErrors);
        }

        // now, if no validation error occurs, we proceed with our Signup
        const { email, phone, password } = userInputs;

        const salt = await GenerateSalt();
        const userPassword = await EncryptedPassword(password, salt);

        const result = await User.create({
            email,
            password: userPassword,
            salt,
            phone,
            verified: false, // user is not verified
            otp: null, // no otp initially
            otp_expiry: null, // no otp expiry initially
            firstName: '',
            lastName: '',
            address: '',
            lat: 0,
            lng: 0
        });

        // extra feature: send email to the user for account creation confirmation

        return res.status(201).json({ message: "Account created successfully. Please login to continue." });

    } catch (error) {
        console.error("Error user Signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error("Error user Login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const UserVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error("Error user Verification:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error("Error user Requesting Otp:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
        console.error("Error getting user Profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}