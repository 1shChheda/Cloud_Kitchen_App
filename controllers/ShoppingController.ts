import { Request, Response, NextFunction } from 'express';
import { Vendor } from '../models';

export const getFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;

        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([[ 'rating', 'descending' ]]) // This sorts the results in descending order based on the rating field
            .populate('foods') // It replaces the `foods` field, which typically contains only references to food documents, with the actual `food documents` themselves.

        if (result.length == 0) {
            return res.status(404).json({ message: "No Food Available" });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching food info:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;

        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([[ 'rating', 'descending' ]])
            .limit(10) // to display TOP "10" Restaurants

        if (result.length == 0) {
            return res.status(404).json({ message: "No Restaurants Available" });
        }

        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching top restaurants:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;

        
    } catch (error) {

    }
}
export const searchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}
export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {

    }
}