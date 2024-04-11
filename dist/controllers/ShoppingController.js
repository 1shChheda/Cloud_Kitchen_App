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
exports.getRestaurantById = exports.searchFoods = exports.getFoodIn30Min = exports.getTopRestaurants = exports.getFoodAvailability = void 0;
const models_1 = require("../models");
const getFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']]) // This sorts the results in descending order based on the rating field
            .populate('foods'); // It replaces the `foods` field, which typically contains only references to food documents, with the actual `food documents` themselves.
        if (result.length == 0) {
            return res.status(404).json({ message: "No Food Available" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching food info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFoodAvailability = getFoodAvailability;
const getTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .limit(10); // to display TOP "10" Restaurants
        if (result.length == 0) {
            return res.status(404).json({ message: "No Restaurants Available" });
        }
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching top restaurants:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode, serviceAvailable: true })
            .populate('foods');
        if (result.length == 0) {
            return res.status(404).json({ message: "No Restaurants Available" });
        }
        let foodResults = [];
        result.map(vendor => {
            const foods = vendor.foods; // to ensure the resulting food data follows the "FoodDoc" model
            // now, to check for food items < 30min
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        });
        return res.status(200).json(foodResults);
    }
    catch (error) {
        console.error("Error fetching food under 30 mins:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFoodIn30Min = getFoodIn30Min;
const searchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate('foods');
        if (result.length == 0) {
            return res.status(404).json({ message: "No Food Available" });
        }
        let foodResults = [];
        result.map(vendor => foodResults.push(...vendor.foods));
        return res.status(200).json(foodResults);
    }
    catch (error) {
        console.error("Error fetching food search:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.searchFoods = searchFoods;
const getRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield models_1.Vendor.findById(id).populate('foods');
        return res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching RestaurantById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=ShoppingController.js.map