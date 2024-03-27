import { Request, Response, NextFunction } from 'express';
import { VendorLoginInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateToken, SetTokenCookie, ValidatePassword } from '../utility';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = <VendorLoginInput>req.body;

        const existingVendor = await FindVendor('', email);

        if (!existingVendor) {
            return res.status(409).json({ message: "Login Credentials Invalid" });
        }

        // validate password
        const validation = await ValidatePassword(password, existingVendor.password);
        if (validation) {

            const token = await GenerateToken({
                _id: existingVendor._id,
                email: existingVendor.email,
                name: existingVendor.name,
                foodTypes: existingVendor.foodType
            });

            // Send JWT token in a HTTP-only cookie
            SetTokenCookie(res, token);

            return res.json({ message: "Login Successful", existingVendor });
        } else {
            return res.json({
                message:
                    "Invalid Password! Try Again"
            });
        }
    } catch (error) {
        console.error("Error login verify vendor:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}
