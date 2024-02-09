import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Client from "@/models/client";

CONNECT_TO_DB();

export const dynamic = "force-dynamic";

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
        const searchParams = new URL(req.url).searchParams;
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        const sales = await Client.aggregate([
            {
                $lookup: {
                    from: "sales",
                    foreignField: "client",
                    localField: "_id",
                    as: "sales",
                    pipeline: [
                        {
                            $match: {
                                createdAt:
                                    from && to
                                        ? {
                                              $lte: new Date(to),
                                              $gte: new Date(from),
                                          }
                                        : {
                                              $lte: new Date(),
                                          },
                            },
                        },
                        {
                            $addFields: {
                                totalAmount: {
                                    $multiply: ["$qty", "$rate"],
                                },
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    totalAmount: {
                        $sum: "$sales.totalAmount",
                    },
                    sales: {
                        $size: "$sales",
                    },
                },
            },
            {
                $group: {
                    _id: {
                        district: "$district",
                        market: "$market",
                    },
                    clients: {
                        $push: "$$ROOT",
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.district",
                    district: {
                        $addToSet: "$_id.district",
                    },
                    totalMarket: {
                        $count: {},
                    },
                    markets: {
                        $push: {
                            market: "$_id.market",
                            totalClient: {
                                $size: "$clients",
                            },
                            totalSale: {
                                $sum: "$clients.sales",
                            },
                            totalAmount: {
                                $sum: "$clients.totalAmount",
                            },
                            clients: "$clients",
                        },
                    },
                },
            },
            {
                $addFields: {
                    district: {
                        $first: "$district",
                    },
                    totalClient: {
                        $sum: "$markets.totalClient",
                    },
                    totalSale: {
                        $sum: "$markets.totalSale",
                    },
                    totalAmount: {
                        $sum: "$markets.totalAmount",
                    },
                },
            },
            {
                $project: {
                    district: 1,
                    totalClient: 1,
                    totalSale: 1,
                    totalAmount: 1,
                    totalMarket: 1,
                    markets: {
                        $sortArray: {
                            input: "$markets",
                            sortBy: { totalAmount: -1 },
                        },
                    },
                },
            },
        ]).sort({
            totalAmount: -1,
        });

        return Response.json(sales);
    } catch (error) {
        console.log("Error in Dashboard");
        return Response.json(error, { status: 500 });
    }
};
