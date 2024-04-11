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
exports.EditUserProfile = exports.GetUserProfile = exports.RequestOtp = exports.UserVerify = exports.UserLogin = exports.UserSignup = void 0;
const class_transformer_1 = require("class-transformer"); // to help us convert the plain (literal) object to class (constructor) object
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const utility_1 = require("../utility");
const models_1 = require("../models");
// Basic Signup/Login/Auth Workflow in my head:
// In user signup, I want it such that user is just able to create an account using email, phone number, and password. (not verified yet) (we may also send email to his email address, stating "thank you for registering with us" or something) (otp and expiryDateTime are null).
// As soon as the signup is successful, we send the response "Account created successfully. Please login to continue.", 
// User will be redirected to the login page, so that he can enter login credentials (email, password), if the credentials are correct (that is password is correct) then he is sent an OTP on the registered phone number. (so, we have to save the otp and expiryDateTime into the user's DB info accordingly). Also, when the login credentials are correct, the user is still "not verified", but we generate the token (saving user info _id, email, verified as Payload) and save the authToken into a cookie. [ Why? so we can identify the user correctly on the OTP Screen ]
// Then, on another controller, we verify the OTP, where we use the "req.user" (saved in cookie) to check if user.otp == enteredOtp.
// If he enters correct OTP, we update the token info "verified: true", and successfully be authenticated. also saving this updation into the cookie and user DB.
// To check for OTP expiry date check when verifying the OTP. if the expiry time has passed, then follow the following procedure:
// If he enters the wrong otp, or the otp expires, then we can give him another controller option to "RequestNewOtp", where we generate a new OTP, update it in DB, and all that blah..blah..blah process.
// Note: I want the authToken verification such that the user can access the dashboard and other user routes only if "verified = true" is mentioned in the authToken of cookie. if the verifies field is false, then the routes shouldn't be accessible, even if the token is present.
// Also, this "OTP verification" is a One-Time-Thing. 
// once "verified = true", We simply just authenticate using Login Page (email, password, NO OTP)
const UserSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateUserInputs, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(userInputs, { validationError: { target: true } });
        if (inputErrors.length > 0) {
            return res.status(400).json(inputErrors);
        }
        // now, if no validation error occurs, we proceed with our Signup
        const { email, phone, password } = userInputs;
        // THREE(3) scenarios:
        // 1) User Exists & isVerified -> We cannot create same user again
        const existingUser = yield models_1.User.findOne({ email });
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.verified) {
            return res.status(409).json({ message: "User already exists with this Email" });
        }
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.EncryptedPassword)(password, salt);
        // 2) User Exists & isNOTVerified -> We cannot create same user again BUT, we update any new info he tries to enter (He might want to change the phone number, or password...But since we're creating the user already, we simply need to update these new details into the UserDoc)
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.verified) === false) {
            yield models_1.User.findOneAndUpdate({ email }, {
                password: userPassword,
                salt,
                phone,
            });
            return res.status(201).json({ message: "User Info Updated!. Please login to continue." });
        }
        // 3) User DoesNotExist & isCompletelyNew -> Create New User
        if (!existingUser) {
            const result = yield models_1.User.create({
                email,
                password: userPassword,
                salt,
                phone,
                verified: false, // user is not verified
                firstName: '',
                lastName: '',
                address: '',
                lat: 0,
                lng: 0
            });
            // extra feature: send email to the user for account creation confirmation
            return res.status(201).json({ message: "Account created successfully. Please login to continue." });
        }
    }
    catch (error) {
        console.error("Error user Signup:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.UserSignup = UserSignup;
const UserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield models_1.User.findOne({ email });
        if (!existingUser) {
            return res.status(409).json({ message: "Login Credentials Invalid" });
        }
        // validate password
        const validation = yield (0, utility_1.ValidatePassword)(password, existingUser.password);
        if (validation) {
            const token = yield (0, utility_1.GenerateUserToken)({
                _id: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified
            });
            // Send JWT token in a HTTP-only cookie
            (0, utility_1.SetTokenCookie)(res, token);
            // if the user has not verified his PhoneNo, then conduct the OTP verification thing (OTP Screen), else No Need! (direct Dashboard Screen)
            if (!existingUser.verified) {
                const { otp, expiryDateTime } = yield (0, utility_1.GenerateOtp)();
                yield models_1.User.findOneAndUpdate({ email }, {
                    otp,
                    otp_expiry: expiryDateTime,
                    verified: existingUser.verified
                });
                // await onRequestOTP(otp, existingUser.phone); // for twilio SMS service
                let loginResponse = { message: "OTP Sent to registered Mobile Number!" };
                return res.status(200).json(loginResponse);
            }
            else {
                let loginResponse = { message: "Login Successful! Proceed to User Dashboard" };
                return res.status(200).json(loginResponse);
            }
        }
        else {
            return res.status(401).json({
                message: "Invalid Password! Try Again"
            });
        }
    }
    catch (error) {
        console.error("Error user Login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.UserLogin = UserLogin;
const UserVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Login Error. Try Login again" });
        }
        const existingUser = yield models_1.User.findOne({ _id: user._id });
        const { otp } = req.body;
        if (!otp) {
            return res.status(400).json({ message: "Please provide OTP" });
        }
        // check OTP validity (including expiry)
        if (existingUser) {
            const now = new Date();
            if (now > existingUser.otp_expiry) {
                return res.status(400).json({ message: "OTP Expired. Please request a new one." });
            }
            if (otp !== existingUser.otp) {
                return res.status(400).json({ message: "Incorrect OTP!" });
            }
            // update user to verified
            yield models_1.User.findOneAndUpdate({ _id: user._id }, { verified: true });
            // set "verified: true"
            const token = yield (0, utility_1.GenerateUserToken)({
                _id: existingUser._id,
                email: existingUser.email,
                verified: true
            });
            (0, utility_1.SetTokenCookie)(res, token);
            return res.status(200).json({ message: "User Verification successful!" });
        }
    }
    catch (error) {
        console.error("Error user Verification:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.UserVerify = UserVerify;
const RequestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) {
        console.error("Error user Requesting Otp:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.RequestOtp = RequestOtp;
const GetUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }
        const profile = yield models_1.User.findById(user._id);
        if (!profile) {
            return res.status(404).json({ message: "User Information not found" });
        }
        return res.status(200).json({ profile });
    }
    catch (error) {
        console.error("Error getting user Profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.GetUserProfile = GetUserProfile;
const EditUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "User Information not found" });
        }
        const profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditUserProfileInputs, req.body);
        const profileErrors = yield (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } });
        if (profileErrors.length > 0) {
            return res.status(400).json(profileErrors);
        }
        const { firstName, lastName, address } = profileInputs;
        const profile = yield models_1.User.findById(user._id);
        if (!profile) {
            return res.status(404).json({ message: "User Information not found" });
        }
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;
        const result = yield profile.save();
        return res.status(200).json({ message: "User Profile Updated Successfully!", result });
    }
    catch (error) {
        console.error("Error updating user Profile:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.EditUserProfile = EditUserProfile;
//# sourceMappingURL=UserController.js.map