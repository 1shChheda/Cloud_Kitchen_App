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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.GenerateOtp = void 0;
const config_1 = require("../config");
const accountSid = config_1.TWILIO_ACCOUNT_SID;
const authToken = config_1.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const GenerateOtp = () => __awaiter(void 0, void 0, void 0, function* () {
    // Generate a random number btwn. 100000 and 999999
    // Thus, OTP is a 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiryDateTime = new Date();
    expiryDateTime.setTime(new Date().getTime() + (15 * 60 * 1000)); // expiry: 15 minutes (in milliseconds)
    return { otp, expiryDateTime };
});
exports.GenerateOtp = GenerateOtp;
// to send OTP on registered mobile number
const onRequestOTP = (otp, toPhoneNum) => __awaiter(void 0, void 0, void 0, function* () {
    let msgOptions = {
        from: config_1.TWILIO_FROM_NUMBER,
        to: toPhoneNum,
        body: `\nYour Cuisine App verification code is: ${otp}\nOTP valid for 15 mins only`
    };
    return yield client.messages.create(msgOptions);
});
exports.onRequestOTP = onRequestOTP;
//# sourceMappingURL=OtpUtil.js.map