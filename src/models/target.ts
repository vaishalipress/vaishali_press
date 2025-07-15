import mongoose, { Schema, Document } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface TargetI extends Document {
    market: mongoose.Types.ObjectId; // reference to Market
    month: number; // 1 = Jan, 12 = Dec
    year: number;
    targetValue: number; // you can adjust fields as needed
}

const TargetSchema = new Schema<TargetI>(
    {
        market: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Market",
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 0,
            max: 11,
        },
        year: {
            type: Number,
            required: true,
        },
        targetValue: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// 🔐 Ensure unique Target per (market + month + year)
TargetSchema.index({ market: 1, month: 1, year: 1 }, { unique: true });
TargetSchema.plugin(mongoose_aggregate_paginate_v2)

const Target =
    mongoose.models.Target || mongoose.model<TargetI>("Target", TargetSchema);

export default Target;
