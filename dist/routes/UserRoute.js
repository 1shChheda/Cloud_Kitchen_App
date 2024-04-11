"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.UserRoute = router;
// User Signup
router.post('/signup', controllers_1.UserSignup);
// User Login
router.post('/login', controllers_1.UserLogin);
// User Verify
router.post('/verify', middlewares_1.OTPTokenVerify, controllers_1.UserVerify);
// Otp
router.post('/otp', controllers_1.RequestOtp);
// User Profile
router.get('/profile', middlewares_1.UserTokenVerify, controllers_1.GetUserProfile);
router.patch('/profile', middlewares_1.UserTokenVerify, controllers_1.EditUserProfile);
//# sourceMappingURL=UserRoute.js.map