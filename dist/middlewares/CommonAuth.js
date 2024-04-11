"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenVerify = exports.OTPTokenVerify = exports.VendorTokenVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// Note: I tried to use "req.user" (alongside "next()") under TokenVerify under PasswordUtil.ts. But, It still didnt recognize "user" there. 
// Meaning, we could only use "req.user" (alongside "next()") here, where we've mentioned the above code tp resolve the error
const VendorTokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.user = decoded; // attach user object to request for further processing
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});
exports.VendorTokenVerify = VendorTokenVerify;
const OTPTokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.user = decoded; // attach user object to request for further processing
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});
exports.OTPTokenVerify = OTPTokenVerify;
const UserTokenVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (!decoded.verified) {
            return res.status(401).json({ message: "User not verified" });
        }
        req.user = decoded; // attach user object to request for further processing
        next();
    }
    catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});
exports.UserTokenVerify = UserTokenVerify;
//# sourceMappingURL=CommonAuth.js.map