import express from "express";
import { GetUserProfile, RequestOtp, UserLogin, UserSignup, UserVerify } from "../controllers";

const router = express.Router();

// User Signup
router.post('/signup', UserSignup);

// User Login
router.post('/login', UserLogin);

// User Verify
router.post('/verify', UserVerify);

// Otp
router.post('/otp', RequestOtp);

// User Profile
router.post('/profile', GetUserProfile);


export { router as UserRoute };