import { Request, Response, NextFunction } from 'express';
import { CreateFoodInputs, VendorLoginInput } from '../dto';
import { FindVendor } from './AdminController';
import { GenerateToken, SetTokenCookie, ValidatePassword } from '../utility';
import { Food, Order } from '../models';

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

            return res.status(200).json({ message: "Login Successful", existingVendor });
        } else {
            return res.status(401).json({
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

export const updateCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = req.user;
        
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        
        
        const vendor = await FindVendor(user._id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor does not exist!" });
        }

        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);

        vendor.coverImages.push(...images);

        const savedResult = await vendor.save();

        return res.status(201).json({ message: "Cover Images Updated!", savedResult });
        

    } catch (error) {
        console.error("Error updating coverImages:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// think of a on/off switch provided to vendor, to Unable/Disable Services (So, when we suggest Vendors, we only suggest Vendors who have their Services On)
export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
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


export const addFood = async (req: Request, res: Response, next: NextFunction) => {

    try{
        const user = req.user;
        
        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        
        const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;
        
        const vendor = await FindVendor(user._id);
        if (!vendor) {
            return res.status(404).json({ message: "Vendor does not exist!" });
        }

        const files = req.files as [Express.Multer.File];
        const images = files.map((file: Express.Multer.File) => file.filename);

        const createFood = await Food.create({
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
        const savedResult = await vendor.save();

        return res.json({ message: "New Food Added!", savedResult });
        

    } catch (error) {
        console.error("Error adding food:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}

export const getFoods = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }
        const foods = await Food.find({ vendorId: user._id });
        if (foods.length == 0) {
            return res.status(404).json({ message: "No Food Item found!" });
        }

        return res.status(200).json(foods);

    } catch (error) {
        console.error("Error adding food:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const orders = await Order.find({ vendorId: user._id }).populate('items.food');

        if (orders.length == 0) {
            return res.status(404).json({ message: "No Orders Yet!" });
        }

        return res.status(200).json(orders);

    } catch (error) {
        console.log("Error getting vendor orders: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const orderId = req.params.id;
        if (!orderId) {
            return res.status(404).json({ message: "No OrderId provided!" });
        }

        const order = await Order.findById(orderId).populate('items.food');

        if (!order) {
            return res.status(404).json({ message: "No Such Order Exists!" });
        }

        return res.status(200).json(order);

    } catch (error) {
        console.log("Error getting order details: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const processOrder = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = req.user;

        if (!user) {
            return res.status(404).json({ message: "Vendor Information not found" });
        }

        const orderId = req.params.id;
        if (!orderId) {
            return res.status(404).json({ message: "No OrderId provided!" });
        }

        const { status, remarks, time } = req.body;

        const order = await Order.findById({ _id: orderId }).populate('items.food');

        order.orderStatus = status;
        order.remarks = remarks;

        if (time) {
            order.readyTime = time;
        }

        const orderResult = await order.save();
        return res.status(200).json(orderResult);

    } catch (error) {
        console.log("Error getting processing order: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}