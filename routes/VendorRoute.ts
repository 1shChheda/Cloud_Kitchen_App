import express, { Request, Response, NextFunction } from "express";
import { getVendorProfile, updateVendorProfile, updateVendorService, VendorLogin } from "../controllers";

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Vendor" });

});

router.post('/login', VendorLogin);
router.get('/profile', getVendorProfile);
router.patch('/profile', updateVendorProfile);
router.patch('/service', updateVendorService);

export { router as VendorRoute };