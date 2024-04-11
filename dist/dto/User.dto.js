"use strict";
// This time, i'm using "Class" instead of interface.....Why? (Refer Vendor.dto.ts comments)
// Also, not using "constructor", so, we need to "disable" "strictPropertyInitialization" in `tsconfig.json` file (reason mentioned in that file itself)
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserProfileInputs = exports.UserLoginInputs = exports.CreateUserInputs = void 0;
const class_validator_1 = require("class-validator");
class CreateUserInputs {
}
exports.CreateUserInputs = CreateUserInputs;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address!' }),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone number cannot be empty' }),
    (0, class_validator_1.Length)(10, 10, { message: 'Invalid Phone Number!' }),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty' }),
    (0, class_validator_1.Length)(6, 12, { message: 'Password needs to be 6 to 12 characters long' }),
    __metadata("design:type", String)
], CreateUserInputs.prototype, "password", void 0);
class UserLoginInputs {
}
exports.UserLoginInputs = UserLoginInputs;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid email address!' }),
    __metadata("design:type", String)
], UserLoginInputs.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password cannot be empty' }),
    (0, class_validator_1.Length)(6, 12, { message: 'Password needs to be 6 to 12 characters long' }),
    __metadata("design:type", String)
], UserLoginInputs.prototype, "password", void 0);
class EditUserProfileInputs {
}
exports.EditUserProfileInputs = EditUserProfileInputs;
__decorate([
    (0, class_validator_1.Length)(3, 16, { message: 'firstName needs to be Atleast 3 characters Long' }),
    __metadata("design:type", String)
], EditUserProfileInputs.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 16, { message: 'lastName needs to be Atleast 3 characters Long' }),
    __metadata("design:type", String)
], EditUserProfileInputs.prototype, "lastName", void 0);
//# sourceMappingURL=User.dto.js.map