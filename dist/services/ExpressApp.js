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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("../routes");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images'))); // help us access image files from our server
    app.use((0, cookie_parser_1.default)());
    app.use('/admin', routes_1.AdminRoute);
    app.use('/vendor', routes_1.VendorRoute);
    app.use('/user', routes_1.UserRoute);
    app.use(routes_1.ShoppingRoute);
    return app;
});
// What's happening?
// inside the above fn, we're taking "app" as a dependecy from outside
// we're executing all the express related stuff inside this fn
// & then we're returning back the "app"
//# sourceMappingURL=ExpressApp.js.map