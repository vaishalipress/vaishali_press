import Client from "@/models/client";
import Product from "@/models/product";
import Sale from "@/models/sale";
import CONNECT_TO_DB from "@/lib/connectToDb";

CONNECT_TO_DB();

/**
 * CREATE SALE
 */
export const POST = async (req: Request) => {
    try {
        const { client, product, qty, rate, payment } = await req.json();

        if (!client || !product || !qty) {
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
            isClientExist = await Client.findById(client);
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

        let isProductExist;
        try {
            isProductExist = await Product.findById(product);
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
        if (!isProductExist) {
            return Response.json(
                {
                    message: "invalid product id",
                    success: false,
                },
                { status: 400 }
            );
        }
        const sale = await Sale.create({
            client: isClientExist._id,
            product: isProductExist.id,
            name: isProductExist.name,
            qty: Number(qty),
            rate: rate ? Number(rate) : isProductExist.price,
            payment: payment ? Number(payment) : 0,
        });

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
        const sales = await Sale.find()
            .populate("client product")
            .sort({ createdAt: -1 });
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
        console.log("Sale get", error);
        return Response.json("Internal error", { status: 500 });
    }
};
/**
 * UPDATE SALE
 */

export const PUT = async (req: Request) => {
    try {
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
        const isExist = await Sale.findById(id);

        if (!isExist) {
            return Response.json(
                { message: "invalid sale id", success: false },
                { status: 400 }
            );
        }

        let isClientExist = null;
        if (client) {
            isClientExist = await Client.findById(client);
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

        let isProductExist = null;
        if (product) {
            isProductExist = await Product.findById(product);
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

        const sale = await Sale.findByIdAndUpdate(
            id,
            {
                product: isProductExist ? isProductExist._id : isExist.product,
                name: isProductExist?.name
                    ? isProductExist?.name
                    : isExist.name,
                client: isClientExist ? isClientExist._id : isExist.client,
                qty: qty ? Number(qty) : isExist.qty,
                rate: rate ? Number(rate) : isExist.rate,
                payment: payment ? Number(payment) : isExist.payment,
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
