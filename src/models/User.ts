import mongoose, { Document, Schema } from "mongoose";
import { OrderDoc } from "./Order";

export interface UserDoc extends Document {
    email: string;
    password: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
    orders: [OrderDoc]
}

const UserSchema = new Schema ({
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: Number, default: null },
    otp_expiry: { type: Date, default: null },
    lat: { type: Number },
    lng: { type: Number },
    orders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'order'
    }]
}, {
    toJSON: {
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

const User = mongoose.model<UserDoc>('user', UserSchema);

export { User };
