import CONNECT_TO_DB from "@/lib/connectToDb";
import Sale from "@/models/sale";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

export const GET = async (req: Request) => {
    try {
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

                    // stats
                    totalQtySold: {
                        $sum: "$qty",
                    },
                    avgPrice: {
                        $avg: "$rate",
                    },
                    totalSellAmount: {
                        $sum: {
                            $multiply: ["$qty", "$rate"],
                        },
                    },
                },
            },
            {
                $group: {
                    _id: {
                        district: "$_id.district",
                        block: "$_id.block",
                    },
                    totalQtySold: {
                        $sum: "$totalQtySold",
                    },
                    totalSellAmount: {
                        $sum: "$totalSellAmount",
                    },
                    productStats: {
                        $push: {
                            name: "$_id.product",
                            totalQtySold: "$totalQtySold",
                            avgPrice: "$avgPrice",
                            totalSellAmount: "$totalSellAmount",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.district",
                    district: {
                        $first: "$_id.district",
                    },
                    totalQtySold: {
                        $sum: "$totalQtySold",
                    },
                    totalSellAmount: {
                        $sum: "$totalSellAmount",
                    },
                    blocks: {
                        $push: {
                            name: {
                                $first: "$_id.block",
                            },
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
            totalSellAmount: -1,
        });
        return Response.json(sales);
    } catch (error) {
        console.log("Dashboard", error);
        return Response.json(error, { status: 500 });
    }
};
