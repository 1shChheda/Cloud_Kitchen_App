import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from '../models'
import { EncryptedPassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
    // Here, in Arguments, we're taking "id" as a `string` OR ` ` `undefined`, and an "OPTIONAL" (`?`) arg of email string

    // First, we'll check if email is provided in args
    // if provided, we'll use "email" to search for Vendor
    // else, if not provided, we'll use "id" as searching parameter

    if (email) {
        return await Vendor.findOne({ email: email });
    } else {
        return await Vendor.findById(id);
    }

}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, ownerName, foodType, pincode, address, phone, email, password  } = <CreateVendorInput>req.body;
    
        // const existingVendor = await Vendor.findOne({ email: email }); // Instead of using this, use:
        const existingVendor = await FindVendor('', email);
    
        if (existingVendor !== null) {
            return res.status(409).json({ message: "Vendor already exists with this Email" })
        }
    
        const salt = await GenerateSalt();
        const userPassword = await EncryptedPassword(password, salt);
    
        const createVendor = await Vendor.create({ 
            name: name, 
            ownerName: ownerName, 
            foodType: foodType,
            pincode: pincode, 
            address: address, 
            phone: phone, 
            email: email, 
            password: userPassword,
            salt: salt,
            rating: 0,
            serviceAvailable: false,
            coverImages: [],
            foods: []
        });
    
        return res.status(201).json({ message: "New Vendor Added!", createVendor });

    } catch (error) {
        console.error("Error adding vendor:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }


}


export const GetAllVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await Vendor.find();

        if (!vendors || vendors.length === 0) {
            return res.status(404).json({ message: "Vendor data Unavailable" });
        }

        return res.status(200).json(vendors);
    } catch (error) {
        console.error("Error fetching vendors:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.params.id;
        // const vendor = await Vendor.findById(vendorId); // Instead of using this, use:
        const vendor = await FindVendor(vendorId);
        
        if (vendor == null) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        return res.status(200).json(vendor);

    } catch (error) {
        console.error("Error fetching vendor by id:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
