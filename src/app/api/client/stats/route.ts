import CONNECT_TO_DB from "@/lib/connectToDb";
import Client from "@/models/client";

CONNECT_TO_DB();
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date | undefined = !!searchParams.get("to")
            ? new Date(searchParams?.get("to")!)
            : new Date();

        const clientStats = await Client.aggregate([
            {
                $lookup: {
                    from: "sales",
                    foreignField: "client",
                    localField: "_id",
                    as: "sales",
                    pipeline: [
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
                            $addFields: {
                                amount: {
                                    $multiply: ["$rate", "$qty"],
                                },
                            },
                        },
                    ],
                },
            },

            {
                $project: {
                    name: 1,
                    market: 1,
                    district: 1,
                    sales: {
                        $size: "$sales",
                    },
                    amount: {
                        $sum: "$sales.amount",
                    },
                },
            },
        ]).sort({
            amount: "descending",
        });

        return Response.json(clientStats, {
            status: 200,
        });
    } catch (error) {
        console.log("PRODUCT STATS ", error);
        return Response.json("Internal Error", { status: 500 });
    }
};
