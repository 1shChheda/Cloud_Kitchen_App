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
exports.SetTokenCookie = exports.GenerateToken = exports.GenerateUserToken = exports.ValidatePassword = exports.EncryptedPassword = exports.GenerateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// Password Encryption & Decryption
// generate a Salt
// encrypt the password using the salt
// use the same salt to decrypt the password during user Auth
const GenerateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    return yield bcrypt_1.default.genSalt(saltRounds);
});
exports.GenerateSalt = GenerateSalt;
const EncryptedPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.EncryptedPassword = EncryptedPassword;
const ValidatePassword = (enteredPassword, savedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(enteredPassword, savedPassword);
});
exports.ValidatePassword = ValidatePassword;
// specially for generating UserToken, 
// since I tried using AuthPayload, but didnt work well alongside VendorPayload
// thus, I created a separate UserPayload itself, for User stuff
const GenerateUserToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET, { expiresIn: '1d' });
});
exports.GenerateUserToken = GenerateUserToken;
// vendor stuff can continue using "AuthPayload" and corresponding Functions where AuthPayload is used.
const GenerateToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign(payload, config_1.JWT_SECRET, { expiresIn: '1d' });
});
exports.GenerateToken = GenerateToken;
const SetTokenCookie = (res, token) => {
    // Send JWT token in a HTTP-only cookie
    // HTTP-only cookies cannot be accessed by client-side JavaScript, which adds an extra layer of security.
    return res.cookie("authToken", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // Max age in milliseconds (1 day)
};
exports.SetTokenCookie = SetTokenCookie;
//# sourceMappingURL=PasswordUtil.js.map