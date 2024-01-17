import { Client, Product } from "@prisma/client";
import { Prisma } from "../../../../prisma";

/**
 * CREATE SALE
 */

export const POST = async (req: Request) => {
    try {
        const { client, product, qty, rate, payment } = await req.json();

        if (!client || !product || !qty || !payment) {
            return Response.json(
                {
                    message: "All fields are required.",
                    success: false,
                },
                { status: 400 }
            );
        }

        const isClientExist = await Prisma.client.findUnique({
            where: {
                id: client,
            },
        });

        if (!isClientExist) {
            return Response.json(
                {
                    message: "invalid client id",
                    success: false,
                },
                { status: 400 }
            );
        }
        const isProductExist = await Prisma.product.findUnique({
            where: {
                id: product,
            },
        });
        if (!isProductExist) {
            return Response.json(
                {
                    message: "invalid product id",
                    success: false,
                },
                { status: 400 }
            );
        }
        const sale = await Prisma.sale.create({
            data: {
                client,
                product: isProductExist.id,
                name: isProductExist.name,
                qty: Number(qty),
                rate: rate ? Number(rate) : isProductExist.price,
                payment: Number(payment),
            },
        });

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
            { sale, message: "sale created", success: true },
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
        const sales = await Prisma.sale.findMany();
        if (!sales) {
            return Response.json("something went wrong while fetching sales", {
                status: 500,
            });
        }
        return Response.json(
            { sales, message: "sales fetched", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return Response.json("Internal error", { status: 500 });
    }
};
/**
 * UPDATE SALE
 */

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
            return Response.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const { client, product, qty, rate, payment } = await req.json();

        if (!(client || product || qty || rate || payment)) {
            return Response.json(
                { message: "one field is required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Prisma.sale.findUnique({
            where: {
                id,
            },
        });

        if (!isExist) {
            return Response.json(
                { message: "invalid sale id", success: false },
                { status: 400 }
            );
        }

        let isClientExist: Client | null = null;
        if (client) {
            isClientExist = await Prisma.client.findUnique({
                where: {
                    id: client,
                },
            });
            if (!isClientExist) {
                return Response.json(
                    {
                        message: "invalid client id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        }

        let isProductExist: Product | null = null;
        if (product) {
            isProductExist = await Prisma.product.findUnique({
                where: {
                    id: product,
                },
            });
            if (!isProductExist) {
                return Response.json(
                    {
                        message: "invalid product id",
                        success: false,
                    },
                    { status: 400 }
                );
            }
        }

        const sale = await Prisma.sale.update({
            where: {
                id,
            },
            data: {
                product: isProductExist ? isProductExist.id : isExist.product,
                name: isProductExist?.name
                    ? isProductExist?.name
                    : isExist.name,
                client: isClientExist ? isClientExist.id : isExist.client,
                qty: qty ? Number(qty) : isExist.qty,
                rate: rate ? Number(rate) : isExist.rate,
                payment: payment ? Number(payment) : isExist.payment,
            },
        });

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
        console.log(error);
        return Response.json(
            error?.meta && error?.meta?.message ? error.meta.message : error,
            { status: error?.meta ? 400 : 500 }
        );
    }
};

/**
 * DELETE SALE
 */

export const DELETE = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return Response.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const sale = await Prisma.sale.delete({
            where: {
                id,
            },
        });

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
        return Response.json(
            error?.meta && error?.meta?.cause
                ? error?.meta?.cause
                : "internal error",
            { status: error?.meta && error?.meta?.cause ? 400 : 500 }
        );
    }
};
