import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import Sale from "@/models/sale";

export const dynamic = "force-dynamic";

CONNECT_TO_DB();

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

        // const sales = await Sale.aggregate([
        //     {
        //         $match: {
        //             date: from
        //                 ? {
        //                       $lte: to,
        //                       $gte: from,
        //                   }
        //                 : {
        //                       $lte: to,
        //                   },
        //         },
        //     },
        //     {
        //         $lookup: {
        //             from: "clients",
        //             foreignField: "_id",
        //             localField: "client",
        //             as: "client",
        //         },
        //     },
        //     {
        //         $group: {
        //             _id: {
        //                 district: "$client.district",
        //                 market: "$client.market",
        //                 product: "$name",
        //             },

        //             // Product stats
        //             totalQtySold: {
        //                 $sum: "$qty",
        //             },
        //             avgPrice: {
        //                 $avg: "$rate",
        //             },
        //         },
        //     },
        //     {
        //         // Block
        //         $group: {
        //             _id: {
        //                 district: "$_id.district",
        //                 market: "$_id.market",
        //             },
        //             totalQtySold: {
        //                 $sum: "$totalQtySold",
        //             },
        //             totalProduct: {
        //                 $count: {},
        //             },

        //             productStats: {
        //                 $push: {
        //                     name: "$_id.product",
        //                     totalQtySold: "$totalQtySold",
        //                     avgPrice: "$avgPrice",
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         //  District
        //         $group: {
        //             _id: "$_id.district",
        //             district: {
        //                 $first: "$_id.district",
        //             },
        //             totalQtySold: {
        //                 $sum: "$totalQtySold",
        //             },

        //             markets: {
        //                 $push: {
        //                     name: {
        //                         $first: "$_id.market",
        //                     },
        //                     totalQtySold: "$totalQtySold",
        //                     products: "$productStats",
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         $addFields: {
        //             _id: {
        //                 $first: "$_id",
        //             },
        //             district: {
        //                 $first: "$district",
        //             },
        //         },
        //     },
        // ]).sort({
        //     totalQtySold: -1,
        // });

        const sales = await Sale.aggregate([
            {
                $match: {
                    date: from
                        ? {
                              $lte: to,
                              $gte: from,
                          }
                        : {
                              $lte: to,
                          },
                },
            },
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
                        product: "$name",
                        district: "$client.district",
                        market: "$client.market",
                    },
                    sales: { $sum: "$qty" },
                },
            },
            {
                $group: {
                    _id: {
                        product: "$_id.product",
                        district: "$_id.district",
                    },
                    sales: { $sum: "$sales" },
                    markets: {
                        $push: {
                            market: {
                                $first: "$_id.market",
                            },
                            sales: "$sales",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.product",
                    totalSales: {
                        $sum: "$sales",
                    },
                    stats: {
                        $push: {
                            district: {
                                $first: "$_id.district",
                            },
                            sales: {
                                $sum: "$sales",
                            },
                            market: "$markets",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    product: "$_id",
                    totalSales: 1,
                    stats: {
                        $sortArray: {
                            input: "$stats",
                            sortBy: { sales: -1 },
                        },
                    },
                },
            },
        ]).sort({ totalSales: -1 });
        return Response.json(sales);
    } catch (error) {
        console.log("Error in ProductStats", error);
        return Response.json(error, { status: 500 });
    }
};
