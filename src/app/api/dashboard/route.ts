import CONNECT_TO_DB from "@/lib/connectToDb";
import Client from "@/models/client";

CONNECT_TO_DB();

export const dynamic = "force-dynamic";

export const GET = async (req: Request) => {
    try {
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
                                dues: {
                                    $subtract: [
                                        { $multiply: ["$qty", "$rate"] },
                                        "$payment",
                                    ],
                                },
                            },
                        },
                    ],
                },
            },
            {
                $addFields: {
                    totalSale: {
                        $size: "$sales",
                    },
                    totalAmount: {
                        $sum: "$sales.totalAmount",
                    },
                    totalDues: {
                        $sum: "$sales.dues",
                    },
                    totalPayment: {
                        $sum: "$sales.payment",
                    },
                },
            },
            {
                $group: {
                    _id: {
                        district: "$district",
                        block: "$block",
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
                    totalBlock: {
                        $count: {},
                    },
                    blocks: {
                        $push: {
                            block: "$_id.block",
                            totalClient: {
                                $size: "$clients",
                            },
                            totalSale: {
                                $sum: "$clients.totalSale",
                            },
                            totalAmount: {
                                $sum: "$clients.totalAmount",
                            },
                            totalDues: {
                                $sum: "$clients.totalDues",
                            },
                            totalPayment: {
                                $sum: "$clients.totalPayment",
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
                        $sum: "$blocks.totalClient",
                    },

                    totalSale: {
                        $sum: "$blocks.totalSale",
                    },
                    totalAmount: {
                        $sum: "$blocks.totalAmount",
                    },
                    totalDues: {
                        $sum: "$blocks.totalDues",
                    },
                    totalPayment: {
                        $sum: "$blocks.totalPayment",
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
