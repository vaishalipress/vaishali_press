import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isAuth) {
            return Response.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const searchParams = new URL(req.url).searchParams;
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const sales = await Sale.aggregate([
            {
                $lookup: {
                    from: "clients",
                    foreignField: "_id",
                    localField: "client",
                    as: "client",
                },
            },
            {
                $group: {
                    _id: {
                        district: "$client.district",
                        block: "$client.block",
                        product: "$name",
                    },

                    // Product stats
                    totalQtySold: {
                        $sum: "$qty",
                    },
                    avgPrice: {
                        $avg: "$rate",
                    },
                },
            },
            {
                // Block
                $group: {
                    _id: {
                        district: "$_id.district",
                        block: "$_id.block",
                    },
                    totalQtySold: {
                        $sum: "$totalQtySold",
                    },
                    totalProduct: {
                        $count: {},
                    },

                    productStats: {
                        $push: {
                            name: "$_id.product",
                            totalQtySold: "$totalQtySold",
                            avgPrice: "$avgPrice",
                        },
                    },
                },
            },
            {
                //  District
                $group: {
                    _id: "$_id.district",
                    district: {
                        $first: "$_id.district",
                    },
                    totalQtySold: {
                        $sum: "$totalQtySold",
                    },

                    blocks: {
                        $push: {
                            name: {
                                $first: "$_id.block",
                            },
                            totalQtySold: "$totalQtySold",
                            products: "$productStats",
                        },
                    },
                },
            },
            {
                $addFields: {
                    _id: {
                        $first: "$_id",
                    },
                    district: {
                        $first: "$district",
                    },
                },
            },
        ]).sort({
            totalQtySold: -1,
        });
        return Response.json(sales);
    } catch (error) {
        console.log("Dashboard", error);
        return Response.json(error, { status: 500 });
    }
};
