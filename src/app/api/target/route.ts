import CONNECT_TO_DB from "@/lib/connectToDb";
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
        // 🔐 Authentication
        const isauth = await isAuth();
        if (!isauth) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);

        // 🧾 Filters
        const market = searchParams.get("market");
        const monthParam = searchParams.get("month");
        const yearParam = searchParams.get("year");

        const filter: Record<string, any> = {};

        if (market && Types.ObjectId.isValid(market)) {
            filter.market = market;
        }

        if (monthParam) {
            const month = parseInt(monthParam);
            if (month >= 0 && month <= 11) {
                filter.month = month;
            } else {
                return Response.json(
                    { message: "Invalid month" },
                    { status: 400 }
                );
            }
        }

        if (yearParam) {
            const year = parseInt(yearParam);
            if (year >= 2000 && year <= 2100) {
                filter.year = year;
            } else {
                return Response.json(
                    { message: "Invalid year" },
                    { status: 400 }
                );
            }
        }

        // 🔃 Sorting
        const sortBy = searchParams.get("sortBy") || "year"; // default: year
        const order = searchParams.get("order") === "asc" ? 1 : -1; // default: desc

        const validSortFields = ["month", "year", "targetValue", "createdAt"];
        const sortField = validSortFields.includes(sortBy) ? sortBy : "year";

        // 📦 Query targets
        const targets = await Target.find(filter)
            .sort({ [sortField]: order })
            .populate("market", "name district") // Optional: include market info
            .lean();

        return Response.json({ success: true, targets }, { status: 200 });
    } catch (error) {
        console.error("Error fetching all targets:", error);
        return Response.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
};
