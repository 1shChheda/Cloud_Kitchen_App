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
exports.GetVendorById = exports.GetAllVendors = exports.CreateVendor = exports.FindVendor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const FindVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    // Here, in Arguments, we're taking "id" as a `string` OR ` ` `undefined`, and an "OPTIONAL" (`?`) arg of email string
    // First, we'll check if email is provided in args
    // if provided, we'll use "email" to search for Vendor
    // else, if not provided, we'll use "id" as searching parameter
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findById(id);
    }
});
exports.FindVendor = FindVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body;
        // const existingVendor = await Vendor.findOne({ email: email }); // Instead of using this, use:
        const existingVendor = yield (0, exports.FindVendor)('', email);
        if (existingVendor !== null) {
            return res.status(409).json({ message: "Vendor already exists with this Email" });
        }
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.EncryptedPassword)(password, salt);
        const createVendor = yield models_1.Vendor.create({
            name: name,
            ownerName: ownerName,
            foodType: foodType,
            pincode: pincode,
            address: address,
            phone: phone,
            email: email,
            password: userPassword,
            salt: salt,
            rating: 0,
            serviceAvailable: false,
            coverImages: [],
            foods: []
        });
        return res.status(201).json({ message: "New Vendor Added!", createVendor });
    }
    catch (error) {
        console.error("Error adding vendor:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.CreateVendor = CreateVendor;
const GetAllVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield models_1.Vendor.find();
        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: "Vendor data Unavailable" });
        }
        return res.status(200).json(vendors);
    }
    catch (error) {
        console.error("Error fetching vendors:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.GetAllVendors = GetAllVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        // const vendor = await Vendor.findById(vendorId); // Instead of using this, use:
        const vendor = yield (0, exports.FindVendor)(vendorId);
        if (vendor == null) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        return res.status(200).json(vendor);
    }
    catch (error) {
        console.error("Error fetching vendor by id:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map