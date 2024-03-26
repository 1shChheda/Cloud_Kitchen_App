import mongoose, { Document, Schema, Model } from "mongoose";

// The `VendorDoc` interface defines the structure of a vendor document in the MongoDB database. 
interface VendorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    // foods: any

}


// The `VendorSchema` defines the structure and validation rules for the vendor documents in the MongoDB collection.
const VendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    // foods: [{
    //     type: mongoose.SchemaTypes.ObjectId,
    //     ref: 'food'
    // }]
}, {
    toJSON: {
        // mongoose will call this function to allow you to transform the "returned object" (so we can handle what data is going to be sent in response)
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

// The `Vendor` model is created using Mongoose's mongoose.model method. It's responsible for interacting with the MongoDB collection named 'Vendor' based on the `VendorSchema`. 
// This model allows you to perform operations such as querying, inserting, updating, and deleting documents in the 'Vendor' collection.
const Vendor = mongoose.model<VendorDoc>('Vendor', VendorSchema);

    // `<VendorDoc>` is used as a type assertion or type casting. 
    // It tells TypeScript that the Vendor model is expected to return documents that match the structure defined in the VendorDoc interface. 

export { Vendor };