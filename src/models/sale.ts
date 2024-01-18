import mongoose, { Schema } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface SaleI {
    client: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    name: string;
    qty: Number;
    rate: Number;
    payment: Number;
}
const SalesSchema = new Schema<SaleI>(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        payment: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

SalesSchema.plugin(mongoose_aggregate_paginate_v2);

const Sale = mongoose.models.Sale || mongoose.model<SaleI>("Sale", SalesSchema);
export default Sale;
