import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface MarketI extends Document {
    name: string;
    district: string;
    target: number;
}

const MarketSchema = new Schema<MarketI>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        district: {
            type: String,
            required: true,
        },
        target: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

MarketSchema.plugin(mongoose_aggregate_paginate_v2);

const Market =
    mongoose.models.Market || mongoose.model<MarketI>("Market", MarketSchema);

export default Market;
