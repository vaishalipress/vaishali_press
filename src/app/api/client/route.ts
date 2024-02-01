import Client from "@/models/client";
import { NextResponse } from "next/server";
import CONNECT_TO_DB from "@/lib/connectToDb";
import { isAuth } from "@/lib/isAuth";
import { clientSchema } from "@/lib/schema";

CONNECT_TO_DB();

/**
 * REGISTER CLIENT
 */

export const POST = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isAuth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const data = await req.json();
        const { success } = clientSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }

        const client = await Client.create({
            ...data,
        });

        if (!client) {
            return NextResponse.json("Error while creating client", {
                status: 500,
            });
        }

        return NextResponse.json(
            { client, message: "client registered", success: true },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json("internal error", {
            status: 500,
        });
    }
};

/**
 * GET ALL CLIENT
 */

export const GET = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isAuth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const clients = await Client.find().sort({
            createdAt: -1,
        });

        if (!clients) {
            return NextResponse.json(
                {
                    message: "No client or something went wrong.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { clients, message: "clients fetched" },
            { status: 200 }
        );
    } catch (error) {
        console.log("Client get", error);
        return NextResponse.json("Internal error", { status: 500 });
    }
};

/**
 * Delete client
 */
export const DELETE = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isAuth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const client = await Client.findByIdAndDelete(id);

        if (!client) {
            return NextResponse.json(
                { message: "invalid id", success: false },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { client, message: "client deleted.", success: true },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json("internal error", { status: 500 });
    }
};
/**
 * update client
 */
export const PUT = async (req: Request) => {
    try {
        const isauth = await isAuth();
        if (!isAuth) {
            return NextResponse.json(
                { message: "Unauthorized" },
                {
                    status: 401,
                }
            );
        }
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const data = await req.json();
        const { success } = clientSchema.safeParse(data);

        if (!success) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }

        const isExist = await Client.findById(id);

        if (!isExist) {
            return NextResponse.json(
                { message: "invalid id", success: false },
                { status: 400 }
            );
        }

        const client = await Client.findByIdAndUpdate(
            id,
            {
                ...data,
            },
            { new: true }
        );

        if (!client) {
            return NextResponse.json("Error while updating client", {
                status: 500,
            });
        }

        return NextResponse.json(
            { client, message: "client updated", success: true },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json("internal error", {
            status: 500,
        });
    }
};
