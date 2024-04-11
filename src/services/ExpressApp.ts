import express, { Application } from "express";
import cookieParser from 'cookie-parser';
import path from "path";

import { AdminRoute, ShoppingRoute, VendorRoute, UserRoute } from "../routes";

export default async (app: Application) => {
    
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use('/images', express.static(path.join(__dirname, 'images'))); // help us access image files from our server
    
    app.use(cookieParser());
    
    app.use('/admin', AdminRoute);
    app.use('/vendor', VendorRoute);
    app.use('/user', UserRoute);
    app.use(ShoppingRoute);

    return app;
}

// What's happening?
    // inside the above fn, we're taking "app" as a dependecy from outside
    // we're executing all the express related stuff inside this fn
    // & then we're returning back the "app"