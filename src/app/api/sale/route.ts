import Client from "@/models/client";
import Product from "@/models/product";
import Sale from "@/models/sale";
import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import { salesSchema } from "@/lib/schema";
import { z } from "zod";
import { ProductTypeExtended } from "@/lib/types";

CONNECT_TO_DB();

/**
 * CREATE SALE
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
        const data: z.infer<typeof salesSchema> = await req.json();
        const { success } = salesSchema.safeParse({
            ...data,
            date: new Date(data.date),
        });

        if (!success) {
            return Response.json(
                {
                    message: "All fields are required.",
                    success: false,
                },
                { status: 400 }
            );
        }

        let isClientExist;
        try {
            isClientExist = await Client.findById(data?.client);
            if (!isClientExist) {
                return Response.json(
                    {
                        message: "invalid client id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        } catch (error) {
            return Response.json(
                {
                    message: "invalid client id",
                    success: false,
                },
                { status: 400 }
            );
        }

        let isProductExist: ProductTypeExtended | null;
        try {
            isProductExist = await Product.findById(data.product);
            if (!isProductExist) {
                return Response.json(
                    {
                        message: "invalid product id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        } catch (error) {
            return Response.json(
                {
                    message: "invalid product id",
                    success: false,
                },
                { status: 400 }
            );
        }

        const sale = await Sale.create({ ...data, name: isProductExist?.name });

        const modifiedSaleObject = {
            ...sale._doc,
            client: isClientExist,
            product: isProductExist,
        };

        if (!sale) {
            return Response.json(
                {
                    message: "something went wrong while creating sale.",
                    success: false,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                sale: modifiedSaleObject,
                message: "sale created",
                success: true,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return Response.json("Internal error", { status: 500 });
    }
};

/**
 * GET ALL SALE
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

        const { searchParams } = new URL(req.url);

        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date | undefined = !!searchParams.get("to")
            ? new Date(searchParams?.get("to")!)
            : new Date();

        const client = searchParams.get("client") || "all";
        const product = searchParams.get("product") || "all";
        const page = Number(searchParams.get("page")) || 1;
        const per_page = Number(searchParams.get("view")) || 200;

        const sales = await Sale.find({
            $and: [
                from
                    ? {
                          date: {
                              $gte: from,
                          },
                      }
                    : {},

                {
                    date: {
                        $lte: to,
                    },
                },
                client !== "all" ? { client } : {},
                product !== "all" ? { product } : {},
            ],
        })
            .populate("client product")
            .sort({ date: -1 })
            .limit(per_page)
            .skip(per_page * (page - 1));

        const total = await Sale.countDocuments({
            $and: [
                from
                    ? {
                          date: {
                              $gte: from,
                          },
                      }
                    : {},

                {
                    date: {
                        $lte: to,
                    },
                },
                client !== "all" ? { client: client } : {},
                product !== "all" ? { product: product } : {},
            ],
        });

        if (!sales) {
            return Response.json("something went wrong while fetching sales", {
                status: 500,
            });
        }

        return Response.json(
            { sales, total, message: "sales fetched", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log("Sale get", error);
        return Response.json("Internal error", { status: 500 });
    }
};
/**
 * UPDATE SALE
 */

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
            return Response.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const data: z.infer<typeof salesSchema> = await req.json();
        const { success } = salesSchema.safeParse({
            ...data,
            date: new Date(data.date),
        });

        if (!success) {
            return Response.json(
                {
                    message: "All fields are required.",
                    success: false,
                },
                { status: 400 }
            );
        }
        const isExist = await Sale.findById(id);

        if (!isExist) {
            return Response.json(
                { message: "invalid sale id", success: false },
                { status: 400 }
            );
        }

        let isClientExist;
        try {
            isClientExist = await Client.findById(data?.client);
            if (!isClientExist) {
                return Response.json(
                    {
                        message: "invalid client id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        } catch (error) {
            return Response.json(
                {
                    message: "invalid client id",
                    success: false,
                },
                { status: 400 }
            );
        }

        let isProductExist: ProductTypeExtended | null;
        try {
            isProductExist = await Product.findById(data.product);
            if (!isProductExist) {
                return Response.json(
                    {
                        message: "invalid product id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        } catch (error) {
            return Response.json(
                {
                    message: "invalid product id",
                    success: false,
                },
                { status: 400 }
            );
        }

        const sale = await Sale.findByIdAndUpdate(
            id,
            {
                ...data,
                name: isProductExist.name,
            },
            { new: true }
        ).populate("client product");

        if (!sale) {
            return Response.json("Error while updating sale", {
                status: 500,
            });
        }

        return Response.json(
            { sale, message: "sale updated", success: true },
            { status: 201 }
        );
    } catch (error: any) {
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};

/**
 * DELETE SALE
 */

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
            return Response.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const sale = await Sale.findByIdAndDelete(id);

        if (!sale) {
            return Response.json(
                { message: "invalid id", success: false },
                { status: 400 }
            );
        }
        return Response.json(
            { sale, message: "sale deleted.", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return Response.json(error.name, { status: error.name ? 400 : 500 });
    }
};
