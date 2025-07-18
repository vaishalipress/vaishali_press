import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface ClientI extends Document {
    name: string;
    district: string;
    market: string;
    mobile?: string;
}

const clientSchema = new Schema<ClientI>(
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

        market: {
            type: String,
        },
        mobile: {
            type: String,
        },
    },
    { timestamps: true }
);

clientSchema.plugin(mongoose_aggregate_paginate_v2);

const Client =
    mongoose.models.Client || mongoose.model<ClientI>("Client", clientSchema);

export default Client;
