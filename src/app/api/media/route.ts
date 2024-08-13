import { NextResponse } from "next/server";
import { DELETE_IMG, UPLOAD_TO_CLOUDINARY } from "@/lib/cloudinary";
import { Carousel } from "@/models/carousel";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const assets = await Carousel.find();
        return Response.json(assets, {
            status: 200,
        });
    } catch (err) {
        console.log("GET ALL ASSETS");
        return Response.json(err, { status: 500 });
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const data = await request.formData();
        const file = data.get("file") as File;
        const results = await UPLOAD_TO_CLOUDINARY(file);
        const img = await Carousel.create({
            imageUrl: results.secure_url,
            publicId: results.public_id,
        });
        return NextResponse.json(img, { status: 201 });
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
    try {
        const result = await DELETE_IMG(publicId);
        await Carousel.deleteOne({
            publicId,
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
    } catch (error) {
        return NextResponse.json(
            { message: "Somethinge went wrong." },
            { status: 500 }
        );
    }
}
