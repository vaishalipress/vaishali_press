import Client from "@/models/client";
import { NextResponse } from "next/server";
import CONNECT_TO_DB from "@/lib/connectToDb";

CONNECT_TO_DB();
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

        const client = await Client.create({
            name,
            district,
            block,
            mobile,
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
        const clients = await Client.find();
        // const clients = await Client.create([
        //     {
        //         name: "aditya",
        //         district: "muzaffarpur",
        //         block: "marwan",
        //         mobile: "000000",
        //     },
        //     {
        //         name: "rohit",
        //         district: "muzaffarpur",
        //         block: "marwan",
        //         mobile: "000000",
        //     },
        //     {
        //         name: "abhisek",
        //         district: "muzaffarpur",
        //         block: "marwan",
        //         mobile: "000000",
        //     },
        //     {
        //         name: "vivek",
        //         district: "patna",
        //         block: "danapur",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "suraj",
        //         district: "patna",
        //         block: "danapur",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "aman",
        //         district: "patna",
        //         block: "danapur",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "vishal",
        //         district: "patna",
        //         block: "fatuha",
        //         mobile: "000123456789000",
        //     },
        //     {
        //         name: "golu",
        //         district: "patna",
        //         block: "fatuha",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "vicky",
        //         district: "patna",
        //         block: "fatuha",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "manish",
        //         district: "muzaffarpur",
        //         block: "kanti",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "karan",
        //         district: "muzaffarpur",
        //         block: "kanti",
        //         mobile: "123456789",
        //     },
        //     {
        //         name: "ajeet",
        //         district: "muzaffarpur",
        //         block: "kanti",
        //         mobile: "123456789",
        //     },
        // ]);

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

        const client = await Client.findByIdAndDelete(id);

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
        return NextResponse.json("internal error", { status: 500 });
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
        const isExist = await Client.findById(id);

        if (!isExist) {
            return NextResponse.json(
                { message: "invalid id" },
                { status: 400 }
            );
        }

        const client = await Client.findByIdAndUpdate(
            id,
            {
                name: name ? name : isExist.name,
                district: district ? district : isExist.district,
                block: block ? block : isExist.block,
                mobile: mobile ? mobile : isExist.mobile,
            },
            { new: true }
        );

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
        return NextResponse.json("internal error", {
            status: 500,
        });
    }
};
