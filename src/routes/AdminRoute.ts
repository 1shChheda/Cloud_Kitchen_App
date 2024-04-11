import express, { Request, Response, NextFunction } from 'express';
import { CreateVendor, GetAllVendors, GetVendorById } from '../controllers';

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {

    res.json({ message: "Hello from Admin" });

});

router.post('/vendor', CreateVendor);
router.get('/vendors', GetAllVendors);
router.get('/vendor/:id', GetVendorById);

export { router as AdminRoute };