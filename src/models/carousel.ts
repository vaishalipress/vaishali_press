import mongoose, { Schema } from "mongoose";

export interface CarouselI {
    imageUrl: string;
    publicId: string;
    createdAt: Date;
    updatedAt: Date;
}

const CarouselSchema = new Schema<CarouselI>(
    {
        imageUrl: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const Carousel =
    mongoose.models.Carousel || mongoose.model("Carousel", CarouselSchema);
