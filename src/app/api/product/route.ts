import { NextResponse } from "next/server";
import CONNECT_TO_DB from "@/lib/connectToDb";
import Product from "@/models/product";
import { isAuth } from "@/lib/isAuth";
import { productSchema } from "@/lib/schema";
import { z } from "zod";
CONNECT_TO_DB();
/**
 * REGISTER Product
 */
export const POST = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const data: z.infer<typeof productSchema> = await req.json();
        const { success } = productSchema.safeParse({
            ...data,
            price: data.price,
        });

        if (!success) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Product.findOne({
            name: {
                $regex: data.name.trim(), $options: "i"
            },
        });

        if (isExist) {
            return NextResponse.json(
                { message: "Product already exist with same name" },
                { status: 400 }
            );
        }

        const product = await Product.create({
            name: data.name.toLowerCase(),
            price: data.price,
        });

        if (!product) {
            return NextResponse.json("Error while creating Product", {
                status: 500,
            });
        }

        return NextResponse.json(
            { product, message: "Product registered", success: true },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json("Internal error", { status: 500 });
    }
};

/**
 * GET ALL PRODUCT
 */

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const products = await Product.find().sort({ createdAt: -1 });

        if (!products) {
            return NextResponse.json(
                {
                    message: "No Product or something went wrong.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { products, message: "products fetched" },
            { status: 200 }
        );
    } catch (error) {
        console.log("product get", error);
        return NextResponse.json("Internal error", { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const data: z.infer<typeof productSchema> = await req.json();
        const { success } = productSchema.safeParse({
            ...data,
            price: data.price,
        });

        if (!success) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Product.findById(id);

        if (!isExist) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }


        const isExistWithData = await Product.find({
            $nor: [{ _id: isExist._id }],
            name: {
                $regex: data.name.trim(), $options: "i"
            },

        })


        if (isExistWithData?.[0]) {
            return NextResponse.json(
                { message: "product already exists with same name.", success: false },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name: data.name.toLowerCase(),
                price: data.price,
            },
            { new: true }
        );

        if (!product) {
            return NextResponse.json("Error while updating Product", {
                status: 500,
            });
        }


        return NextResponse.json(
            { product, message: "Product updated", success: true },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error)
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { product, message: "product deleted.", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};
