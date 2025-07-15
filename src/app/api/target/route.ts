import CONNECT_TO_DB from "@/lib/connectToDb";
import { MONTHS } from "@/lib/constants";
import { isAuth } from "@/lib/isAuth";
import { targetSchema } from "@/lib/schema";
import Market from "@/models/market";
import Target from "@/models/target";
import mongoose from "mongoose";
import { Types } from "mongoose";

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
        const parseResult = targetSchema.safeParse(json);

        if (!parseResult.success) {
            return Response.json(
                {
                    message: "Validation failed",
                    errors: parseResult.error.flatten(),
                },
                { status: 400 }
            );
        }

        const data = parseResult.data;

        // 📌 Ensure market exists
        const market = await Market.findById(data.market);
        if (!market) {
            return Response.json(
                { message: "Invalid market ID" },
                { status: 400 }
            );
        }

        // 🧠 Attempt to create target
        const target = await Target.create({
            ...data,
            market: new mongoose.Types.ObjectId(market._id),
        });

        return Response.json(
            {
                target,
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
 * GET ALL TARGETS
 */

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const matchStage: Record<string, any> = {};

        const market = searchParams.get("market");
        const monthParam = searchParams.get("month");
        const yearParam = searchParams.get("year");

        if (market && Types.ObjectId.isValid(market)) {
            matchStage.market = new Types.ObjectId(market);
        }

        if (monthParam) {
            const month = parseInt(monthParam);
            if (month >= 0 && month <= 11) matchStage.month = month;
            else
                return Response.json(
                    { message: "Invalid month" },
                    { status: 400 }
                );
        }

        if (yearParam) {
            const year = parseInt(yearParam);
            if (year >= 2000 && year <= 2100) matchStage.year = year;
            else
                return Response.json(
                    { message: "Invalid year" },
                    { status: 400 }
                );
        }

        const results = await Target.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: "markets",
                    localField: "market",
                    foreignField: "_id",
                    as: "marketDetails",
                },
            },
            { $unwind: "$marketDetails" },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                    },
                    districts: {
                        $push: {
                            _id: "$_id",
                            market: "$marketDetails.name",
                            targetValue: "$targetValue",
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.year",
                    months: {
                        $push: {
                            month: "$_id.month",
                            districts: "$districts",
                        },
                    },
                },
            },

            // ✅ Sort months array by month number ascending
            {
                $set: {
                    months: {
                        $sortArray: {
                            input: "$months",
                            sortBy: { month: 1 },
                        },
                    },
                },
            },

            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    months: 1,
                },
            },
            { $sort: { year: -1 } },
        ]);
        const allYears = await Target.distinct("year");
        return Response.json(
            { results, years: allYears.sort((a, b) => b - a) },
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

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return Response.json(
                { message: "Target ID is required", success: false },
                { status: 400 }
            );
        }

        const body = await req.json();
        const parse = targetSchema.partial().safeParse(body);

        if (!parse.success) {
            return Response.json(
                {
                    success: false,
                    message: "Validation error",
                    errors: parse.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const updated = await Target.findByIdAndUpdate(
            id,
            { targetValue: parse.data.targetValue },
            { new: true }
        );

        if (!updated) {
            return Response.json(
                { message: "Target not found", success: false },
                { status: 404 }
            );
        }

        return Response.json(
            {
                message: "Target updated successfully",
                success: true,
                target: updated,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("PUT /api/target error:", error);
        return Response.json(
            { message: "Something went wrong", success: false },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return Response.json(
                { message: "Target ID is required", success: false },
                { status: 400 }
            );
        }

        const deleted = await Target.findByIdAndDelete(id);

        if (!deleted) {
            return Response.json(
                { message: "Target not found", success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { message: "Target deleted successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /api/target error:", error);
        return Response.json(
            { message: "Something went wrong", success: false },
            { status: 500 }
        );
    }
}
