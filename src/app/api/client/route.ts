import { NextResponse } from "next/server";
import { Prisma } from "../../../../prisma";

/**
 * REGISTER CLIENT
 */
export const POST = async (req: Request) => {
    try {
        /**
         * To create client
         * get - name , district , block , mobile
         * create client
         */

        const { name, district, block, mobile } = await req.json();

        if (!name || !district || !block || !mobile) {
            return NextResponse.json(
                { message: "all fields are required.", success: false },
                { status: 400 }
            );
        }

        const client = await Prisma.client.create({
            data: {
                name,
                district,
                block,
                mobile,
            },
        });

        if (!client) {
            return NextResponse.json("Error while creating client", {
                status: 500,
            });
        }

        return NextResponse.json(
            { client, message: "client registered" },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            error?.meta && error?.meta?.cause
                ? error?.meta?.cause
                : "internal error",
            { status: error?.meta && error?.meta?.cause ? 400 : 500 }
        );
    }
};

/**
 * GET ALL CLIENT
 */

export const GET = async (req: Request) => {
    try {
        const clients = await Prisma.client.findMany();

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
        console.log(error);
        return NextResponse.json("Internal error", { status: 500 });
    }
};

/**
 * Delete client
 */
export const DELETE = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const client = await Prisma.client.delete({
            where: {
                id,
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { client, message: "client deleted." },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            error?.meta && error?.meta?.cause
                ? error?.meta?.cause
                : "internal error",
            { status: error?.meta && error?.meta?.cause ? 400 : 500 }
        );
    }
};
/**
 * update client
 */
export const PUT = async (req: Request) => {
    try {
        /**
         * To update Product
         * get - name or rate
         * name must be unique
         * create Product
         */
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "id required.", success: false },
                { status: 400 }
            );
        }

        const { name, district, block, mobile } = await req.json();

        if (!(name || district || block || mobile)) {
            return NextResponse.json(
                { message: "field is required.", success: false },
                { status: 400 }
            );
        }
        const isExist = await Prisma.client.findUnique({
            where: {
                id,
            },
        });

        if (!isExist) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }

        const client = await Prisma.client.update({
            where: {
                id,
            },
            data: {
                name,
                district,
                block,
                mobile,
            },
        });

        if (!client) {
            return NextResponse.json("Error while updating client", {
                status: 500,
            });
        }

        return NextResponse.json(
            { client, message: "client updated" },
            { status: 201 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            error?.meta && error?.meta?.target
                ? "product already exist with same name"
                : "internal error",
            { status: error?.meta && error?.meta?.target ? 400 : 500 }
        );
    }
};
