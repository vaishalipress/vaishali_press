import { NextResponse } from "next/server";
import { Prisma } from "../../../../prisma";

/**
 * REGISTER Product
 */
export const POST = async (req: Request) => {
    try {
        /**
         * To create Product
         * get - name , rate
         * name must be unique
         * create Product
         */

        const { name, rate } = await req.json();

        if (!name || !rate) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Prisma.product.findUnique({
            where: {
                name,
            },
        });

        if (isExist) {
            return NextResponse.json(
                { message: "Product already exist with same name" },
                { status: 400 }
            );
        }

        const Product = await Prisma.product.create({
            data: {
                name,
                rate,
            },
        });

        if (!Product) {
            return NextResponse.json("Error while creating Product", {
                status: 500,
            });
        }

        return NextResponse.json(
            { Product, message: "Product registered" },
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
        const products = await Prisma.product.findMany();

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
        /**
         * To update Product
         * get - name or rate
         * name must be unique
         * create Product
         */
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const { name, rate } = await req.json();

        if (!(name || rate)) {
            return NextResponse.json(
                { message: "name or rate required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!isExist) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }

        const Product = await Prisma.product.update({
            where: {
                id,
            },
            data: {
                name,
                rate,
            },
        });

        if (!Product) {
            return NextResponse.json("Error while updating Product", {
                status: 500,
            });
        }

        return NextResponse.json(
            { Product, message: "Product updated" },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            error?.meta && error?.meta?.target
                ? "product already exist with same name"
                : "internal error",
            { status: error?.meta && error?.meta?.target ? 400 : 500 }
        );
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

        const product = await Prisma.product.delete({
            where: {
                id,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { product, message: "product deleted." },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            error?.meta && error?.meta?.cause
                ? error?.meta?.cause
                : "internal error",
            { status: error?.meta && error?.meta?.cause ? 400 : 500 }
        );
    }
};
