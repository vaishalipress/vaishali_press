import { NextResponse } from "next/server";
import CONNECT_TO_DB from "@/lib/connectToDb";
import Product from "@/models/product";
CONNECT_TO_DB();
/**
 * REGISTER Product
 */
export const POST = async (req: Request) => {
    try {
        const { name, price } = await req.json();

        if (!name || !price) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Product.findOne({
            name,
        });

        if (isExist) {
            return NextResponse.json(
                { message: "Product already exist with same name" },
                { status: 400 }
            );
        }

        const product = await Product.create({
            name,
            price: Number(price),
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
        console.log(error);
        return NextResponse.json("Internal error", { status: 500 });
    }
};

export const PUT = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const { name, price } = await req.json();

        if (!(name || price)) {
            return NextResponse.json(
                { message: "name or price required.", success: false },
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

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name: name ? name : isExist.name,
                price: price ? Number(price) : isExist.price,
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
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};

export const DELETE = async (req: Request) => {
    try {
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
