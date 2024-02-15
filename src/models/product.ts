import mongoose, { Schema } from "mongoose";
import mongoose_aggregate_paginate_v2 from "mongoose-aggregate-paginate-v2";

export interface ProductI {
    name: string;
    price: number;
}

const ProductSchema = new Schema<ProductI>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoose_aggregate_paginate_v2);

const Product =
    mongoose.models.Product ||
    mongoose.model<ProductI>("Product", ProductSchema);

export default Product;
