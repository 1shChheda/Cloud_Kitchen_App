import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from '../models'
import { EncryptedPassword, GenerateSalt } from "../utility";


export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, ownerName, foodType, pincode, address, phone, email, password  } = <CreateVendorInput>req.body;

    const existingVendor = await Vendor.findOne({ email: email });

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
        coverImages: []
    });

    return res.status(201).json(createVendor);

}

export const GetAllVendors = async (req: Request, res: Response, next: NextFunction) => {

}
export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {

}