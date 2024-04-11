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
exports.getFoods = exports.addFood = exports.updateVendorService = exports.updateCoverImage = exports.updateVendorProfile = exports.getVendorProfile = exports.VendorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const VendorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingVendor = yield (0, AdminController_1.FindVendor)('', email);
        if (!existingVendor) {
            return res.status(409).json({ message: "Login Credentials Invalid" });
        }
        // validate password
        const validation = yield (0, utility_1.ValidatePassword)(password, existingVendor.password);
        if (validation) {
            const token = yield (0, utility_1.GenerateToken)({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodTypes: existingVendor.foodType
            });
            // Send JWT token in a HTTP-only cookie
            (0, utility_1.SetTokenCookie)(res, token);
            return res.status(200).json({ message: "Login Successful", existingVendor });
        }
        else {
            return res.status(401).json({
                message: "Invalid Password! Try Again"
            });
        }
    }
    catch (error) {
        console.error("Error login verify vendor:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.VendorLogin = VendorLogin;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const vendorDetails = yield (0, AdminController_1.FindVendor)(user._id);
        if (!vendorDetails) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }
        return res.status(200).json(vendorDetails);
    }
    catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pincode, address, phone } = req.body;
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (!existingVendor) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }
        // to update only the fields that are present in the request body
        if (name)
            existingVendor.name = name;
        if (ownerName)
            existingVendor.ownerName = ownerName;
        if (foodType)
            existingVendor.foodType = foodType;
        if (pincode)
            existingVendor.pincode = pincode;
        if (address)
            existingVendor.address = address;
        if (phone)
            existingVendor.phone = phone;
        const savedResult = yield existingVendor.save();
        return res.status(200).json(savedResult);
    }
    catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor does not exist!" });
        }
        const files = req.files;
        const images = files.map((file) => file.filename);
        vendor.coverImages.push(...images);
        const savedResult = yield vendor.save();
        return res.status(201).json({ message: "Cover Images Updated!", savedResult });
    }
    catch (error) {
        console.error("Error updating coverImages:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateCoverImage = updateCoverImage;
// think of a on/off switch provided to vendor, to Unable/Disable Services (So, when we suggest Vendors, we only suggest Vendors who have their Services On)
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const existingVendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (!existingVendor) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }
        // to switch services On/Off
        existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
        const savedResult = yield existingVendor.save();
        return res.status(200).json(savedResult);
    }
    catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateVendorService = updateVendorService;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const { name, description, category, foodType, readyTime, price } = req.body;
        const vendor = yield (0, AdminController_1.FindVendor)(user._id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor does not exist!" });
        }
        const files = req.files;
        const images = files.map((file) => file.filename);
        const createFood = yield models_1.Food.create({
            vendorId: vendor._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            rating: 0,
            images: images
        });
        vendor.foods.push(createFood);
        const savedResult = yield vendor.save();
        return res.json({ message: "New Food Added!", savedResult });
    }
    catch (error) {
        console.error("Error adding food:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const foods = yield models_1.Food.find({ vendorId: user._id });
        if (foods.length == 0) {
            return res.status(404).json({ message: "No Food Item found!" });
        }
        return res.status(200).json(foods);
    }
    catch (error) {
        console.error("Error adding food:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFoods = getFoods;
//# sourceMappingURL=VendorController.js.map