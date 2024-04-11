import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER } from "../config";

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

export const GenerateOtp = async () => {
    // Generate a random number btwn. 100000 and 999999
    // Thus, OTP is a 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);


    let expiryDateTime = new Date();
    expiryDateTime.setTime(new Date().getTime() + (15 * 60 * 1000)); // expiry: 15 minutes (in milliseconds)

    return { otp, expiryDateTime }
}

// to send OTP on registered mobile number
export const onRequestOTP = async (otp: number, toPhoneNum: string) => {
    let msgOptions = {
        from: TWILIO_FROM_NUMBER,
        to: toPhoneNum,
        body: `\nYour Cuisine App verification code is: ${otp}\nOTP valid for 15 mins only`
    };

    return await client.messages.create(msgOptions)
}