import mongoose, { Schema } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface MarketI {
    name: string;
    district: string;
}

const MarketSchema = new Schema<MarketI>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        district: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

MarketSchema.plugin(mongoose_aggregate_paginate_v2);

const Market =
    mongoose.models.Market || mongoose.model<MarketI>("Market", MarketSchema);

export default Market;
