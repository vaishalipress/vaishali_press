import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import { districtTargetSchemaPartial } from "@/lib/schema";
import Market from "@/models/market";
import { PipelineStage } from "mongoose";

interface MongoError extends Error {
    code?: number;
}

CONNECT_TO_DB();

/**
 * CREATE TARGET
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

        // 🧾 Parse and validate request body
        const json = await req.json();
        const parseResult = districtTargetSchemaPartial.safeParse(json);

        if (!parseResult.success) {
            return Response.json(
                {
                    message: "Validation failed",
                    errors: parseResult.error.flatten(),
                },
                { status: 400 }
            );
        }

        const updates = parseResult?.data?.markets;

        const bulkOps = updates.map(({ _id, target }) => ({
            updateOne: {
                filter: { _id },
                update: { $set: { target } },
            },
        }));

        await Market.bulkWrite(bulkOps);

        return Response.json(
            {
                message: "target created",
                success: true,
            },
            { status: 201 }
        );
    } catch (error) {
        // ❌ Handle duplicate key error
        if ((error as MongoError)?.code === 11000) {
            return Response.json(
                {
                    message:
                        "Target already exists for this market/month/year.",
                    success: false,
                },
                { status: 409 }
            );
        }

        console.error("Server Error:", error);
        return Response.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
};

/**
 * GET ALL TARGETS BY DISTRICT
 */

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const pipeline: PipelineStage[] = [];
        // group data based on district
        pipeline.push({
            $group: {
                _id: "$district",
                totalTarget: { $sum: "$target" },
                markets: {
                    $push: {
                        _id: "$_id",
                        name: "$name",
                        target: "$target",
                    },
                },
            },
        });

        // Sort markets array within each district
        pipeline.push({
            $set: {
                markets: {
                    $sortArray: {
                        input: "$markets",
                        sortBy: { target: -1 }, // descending target
                    },
                },
            },
        });

        // project data
        pipeline.push({
            $project: {
                _id: 0,
                district: "$_id",
                totalTarget: 1,
                markets: 1,
            },
        });

        pipeline.push({
            $sort: {
                totalTarget: -1,
            },
        });

        const results = await Market.aggregate(pipeline);

        return Response.json(
            {
                results,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching targets:", error);
        return Response.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
};
