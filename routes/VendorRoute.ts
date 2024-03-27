import express, { Request, Response, NextFunction } from "express";
import { getVendorProfile, updateVendorProfile, updateVendorService, VendorLogin } from "../controllers";
import { TokenVerify } from "../middlewares";

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vendor" });

});

router.post('/login', VendorLogin);
router.get('/profile', TokenVerify, getVendorProfile);
router.patch('/profile', TokenVerify, updateVendorProfile);
router.patch('/service', TokenVerify, updateVendorService);

export { router as VendorRoute };