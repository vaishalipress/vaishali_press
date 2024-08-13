import {
    v2 as cloudinary,
    UploadApiErrorResponse,
    UploadApiResponse,
} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_API,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const UPLOAD_TO_CLOUDINARY = async (
    file: File
): Promise<UploadApiResponse | UploadApiErrorResponse> => {
    const fileBuffer = await file.arrayBuffer();
    var mime = file.type;
    var encoding = "base64";
    var base64Data = Buffer.from(fileBuffer).toString("base64");
    var fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    try {
        const uploadToCloudinary = (): Promise<
            UploadApiResponse | UploadApiErrorResponse
        > => {
            return new Promise((resolve, reject) => {
                var result = cloudinary.uploader
                    .upload(fileUri, {
                        invalidate: true,
                        folder: "vaishali-press",
                    })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        };

        const result = await uploadToCloudinary();

        return result;
    } catch (error) {
        console.log("server err", error);
        return error as UploadApiErrorResponse;
    }
};

export const DELETE_IMG = async (publicId: string) => {
    const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
        resource_type: "image",
    });

    return result;
};
