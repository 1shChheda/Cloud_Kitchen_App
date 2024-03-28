import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import fs from "fs";
import { addFood, getFoods, getVendorProfile, updateVendorProfile, updateVendorService, VendorLogin } from "../controllers";
import { TokenVerify } from "../middlewares";

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        const imagesDir = 'images'; // define the directory path
        // checking if the directory exists, if not, create it
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir);
        }
        callback(null, imagesDir); // use the directory path
    },
    filename: function (req, file, callback) {
        callback(null, `${new Date().toISOString()}_${file.originalname}`);
    }
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vendor" });

});

router.post('/login', VendorLogin);
router.get('/profile', TokenVerify, getVendorProfile);
router.patch('/profile', TokenVerify, updateVendorProfile);
router.patch('/service', TokenVerify, updateVendorService);

router.post('/food', TokenVerify, images, addFood);
router.get('/foods', TokenVerify, getFoods);

export { router as VendorRoute };