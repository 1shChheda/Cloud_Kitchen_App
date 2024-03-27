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
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const vendorDetails = await FindVendor(user._id);
        if (!vendorDetails) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }
        return res.status(200).json(vendorDetails);

    } catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const updateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone } = req.body;

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const existingVendor = await FindVendor(user._id);
        if (!existingVendor) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }

        // to update only the fields that are present in the request body
        if (name) existingVendor.name = name;
        if (ownerName) existingVendor.ownerName = ownerName;
        if (foodType) existingVendor.foodType = foodType;
        if (pincode) existingVendor.pincode = pincode;
        if (address) existingVendor.address = address;
        if (phone) existingVendor.phone = phone;

        const savedResult = await existingVendor.save();

        return res.status(200).json(savedResult);

    } catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// think of a on/off switch provided to vendor, to Unable/Disable Services (So, when we suggest Vendors, we only suggest Vendors who have their Services On)
export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone } = req.body;

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const existingVendor = await FindVendor(user._id);
        if (!existingVendor) {
            return res.status(404).json({ message: "No such Vendor Exists!" });
        }

        // to switch services On/Off
        existingVendor.serviceAvailable = !existingVendor.serviceAvailable;

        const savedResult = await existingVendor.save();

        return res.status(200).json(savedResult);

    } catch (error) {
        console.error("Error fetching vendor info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
