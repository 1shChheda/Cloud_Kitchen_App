import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";


export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {

    const { name, ownerName, foodType, pincode, address, phone, email, password  } = <CreateVendorInput>req.body;

    return res.status(201).json({ name, ownerName, foodType, pincode, address, phone, email, password });

}

export const GetAllVendors = async (req: Request, res: Response, next: NextFunction) => {

}
export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {

}