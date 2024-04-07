import express from "express";
import { GetUserProfile, RequestOtp, UserLogin, UserSignup, UserVerify } from "../controllers";
import { UserTokenVerify, OTPTokenVerify } from "../middlewares";

const router = express.Router();

// User Signup
router.post('/signup', UserSignup);

// User Login
router.post('/login', UserLogin);

// User Verify
router.post('/verify', OTPTokenVerify, UserVerify);

// Otp
router.post('/otp', RequestOtp);

// User Profile
router.get('/profile', UserTokenVerify, GetUserProfile);


export { router as UserRoute };