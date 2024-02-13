import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { DELETE_FILE, UPLOAD_TO_CLOUDINARY } from "@/lib/cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export async function GET() {
    try {
        const assets = await cloudinary.api.resources({
            type: "upload",
            prefix: "vaishali-press", // add your folder
        });

        if (assets?.resources) {
            return Response.json(assets?.resources);
        } else {
            return Response.json(
                {
                    message: "Something went wrong while fetching assets",
                },
                { status: 500 }
            );
        }
    } catch (err) {
        console.log("GET ALL ASSETS");
        return Response.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const data = await request.formData();
        const file = data.get("file") as File;
        const results = await UPLOAD_TO_CLOUDINARY(file);

        return NextResponse.json(results, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "some error occured while uploading" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId") as string;

    const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: "image",
    });
    if (result?.result) {
        return NextResponse.json(
            { message: "Image deleted", success: true },
            { status: 200 }
        );
    }
    return NextResponse.json(
        { message: "Somethinge went wrong." },
        { status: 500 }
    );
}
