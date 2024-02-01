import mongoose, { Schema } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface ClientI {
    name: string;
    district: string;
    block: string;
    market?: string;
    mobile?: string;
}

const clientSchema = new Schema<ClientI>(
    {
        name: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        block: {
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
