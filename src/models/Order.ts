import mongoose, { Document, Schema } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string;
    vendorId: string;
    items: [any]; // [ { food, qty: XX } ]
    totalAmount: number;
    orderDate: Date;
    paymentOption: string; // COD, Credit Card, Wallet
    paymentResponse: string; // { status: true, response: bank response }
    orderStatus: string; // waiting, accepted, rejected, under-process, ready
    remarks: string;
    deliveryId: string;
    appliedOffers: boolean;
    offerId: string;
    readyTime: number;
}

const OrderSchema = new Schema ({
    orderId: { type: String, required: true },
    vendorId: { type: String, required: true },
    items: [
        {
            food: { type: mongoose.SchemaTypes.ObjectId, ref: 'food', required: true },
            qty: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderDate: { type: Date },
    paymentOption: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    appliedOffers: { type: Boolean },
    offerId: { type: String },
    readyTime: { type: Number }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});

const Order = mongoose.model<OrderDoc>('order', OrderSchema);

export { Order };