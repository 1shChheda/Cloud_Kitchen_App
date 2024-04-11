import { Request, Response, NextFunction } from 'express';
import { FoodDoc, Vendor } from '../models';

export const getFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;

        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']]) // This sorts the results in descending order based on the rating field
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
            .sort([['rating', 'descending']])
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
        const result = await Vendor.find({ pincode, serviceAvailable: true })
            .populate('foods')

        if (result.length == 0) {
            return res.status(404).json({ message: "No Restaurants Available" });
        }

        let foodResults: any = [];
        result.map(vendor => {
            const foods = vendor.foods as [FoodDoc]// to ensure the resulting food data follows the "FoodDoc" model

            // now, to check for food items < 30min
            foodResults.push(...foods.filter(food => food.readyTime <= 30));
        });

        return res.status(200).json(foodResults);

    } catch (error) {
        console.error("Error fetching food under 30 mins:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const searchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode;

        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate('foods')

        if (result.length == 0) {
            return res.status(404).json({ message: "No Food Available" });
        }

        let foodResults: any = [];
        result.map(vendor => foodResults.push(...vendor.foods));

        return res.status(200).json(foodResults);
    } catch (error) {
        console.error("Error fetching food search:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getRestaurantById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const result = await Vendor.findById(id).populate('foods')
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error fetching RestaurantById:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}