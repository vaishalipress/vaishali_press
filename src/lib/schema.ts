import * as z from "zod";

export const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const clientSchema = z.object({
    name: z
        .string({ required_error: "name is required." })
        .min(3, { message: "name must be atleat 3 characters" }),
    district: z
        .string({ required_error: "district is required." })
        .min(3, { message: "district is required." }),

    block: z
        .string({ required_error: "block is required." })
        .min(3, { message: "block is required." }),
    mobile: z
        .string({ required_error: "Please Enter mobile number" })
        .trim()
        .regex(phoneRegex, "Invalid mobile number")
        .min(10, { message: "Invalid mobile number" })
        .max(10, { message: "Invalid mobile number" }),
});

export const productSchema = z.object({
    name: z
        .string({ required_error: "name is required." })
        .min(3, { message: "name must be atleast length of 3" }),

    price: z
        .number({ required_error: "price is required." })
        .min(1, { message: "name must be greater than 0" }),
});

export const salesSchema = z.object({
    client: z
        .string({ required_error: "client is required." })
        .min(2, { message: "client is required." }),
    product: z
        .string({ required_error: "product is required." })
        .min(2, { message: "product is required." }),
    name: z
        .string({ required_error: "name is required." })
        .min(3, { message: "name must be atleast length of 3" }),
    qty: z
        .number({ required_error: "qty is required." })
        .min(1, { message: "qty must be greater than 0" }),
    rate: z
        .number({ required_error: "rate is required." })
        .min(1, { message: "rate must be greater than 0" }),
    payment: z
        .number({ required_error: "payment is required." })
        .min(1, { message: "payment must be greater than 0" }),
});
