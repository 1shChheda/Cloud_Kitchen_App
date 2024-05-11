import mongoose, { Document, Schema } from 'mongoose';

export interface OfferDoc extends Document {
    offerType: string; // Vendor / Generic
    vendors: [any]; // array of vendorIds that the offer applies to
    title: string; // "Get 50% Off upto INR 200"
    description: string; // any descp. / Terms & Conditions
    minValue: number; // min order amt. to avail the offer
    offerAmount: number; // 200
    startValidity: Date;
    endValidity: Date;
    promocode: string; // NEWUSER200
    promoType: string; // specific to: USER, BANK, CARD, ALL
    bank: [any]; // if promoType: Bank, then which banks its applicable for
    bins: [any];
    pincode: string;
    isActive: boolean;
}

const OfferSchema = new Schema ({
    offerType: { type: String, required: true },
    vendors: [
        {
            type: mongoose.SchemaTypes.ObjectId, ref: 'vendor'
        }
    ],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date },
    endValidity: { type: Date },
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    banks: [
        { type: String }
    ],
    bins: [
        { type: Number }
    ],
    pincode: { type: String, required: true },
    isActive: Boolean,
    
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

const Offer = mongoose.model<OfferDoc>('offer', OfferSchema);

export { Offer };