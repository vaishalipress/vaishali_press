import CONNECT_TO_DB from "@/lib/connectToDb";
import Product from "@/models/product";

CONNECT_TO_DB();
export const dynamic = "force-dynamic";
export const GET = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        let from: Date | undefined = !!searchParams.get("from")
            ? new Date(searchParams.get("from")!)
            : undefined;
        let to: Date | undefined = !!searchParams.get("to")
            ? new Date(searchParams?.get("to")!)
            : new Date();

        const productStats = await Product.aggregate([
            {
                $lookup: {
                    from: "sales",
                    foreignField: "product",
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
                    price: 1,
                    sales: {
                        $sum: "$sales.qty",
                    },
                    amount: {
                        $sum: "$sales.amount",
                    },
                },
            },
        ]).sort({
            sales: "descending",
        });

        return Response.json(productStats, {
            status: 200,
        });
    } catch (error) {
        console.log("PRODUCT STATS ", error);
        return Response.json("Internal Error", { status: 500 });
    }
};
