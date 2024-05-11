import express from "express";
import { AddToCart, CreateOrder, DeleteCart, EditUserProfile, GetCart, GetOrderById, GetOrders, GetUserProfile, RequestOtp, UserLogin, UserSignup, UserVerify, VerifyOffer } from "../controllers";
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
router.patch('/profile', UserTokenVerify, EditUserProfile);

// Order
router.post('/create-order', UserTokenVerify, CreateOrder);
router.get('/orders', UserTokenVerify, GetOrders);
router.get('/order/:id', UserTokenVerify, GetOrderById);

// Apply Offer
router.get('/offer/verify/:id', UserTokenVerify, VerifyOffer);

// Cart
router.post('/cart', UserTokenVerify, AddToCart);
router.get('/cart', UserTokenVerify, GetCart);
router.delete('/cart', UserTokenVerify, DeleteCart);


export { router as UserRoute };