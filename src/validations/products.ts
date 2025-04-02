import { object, string, number, array, boolean } from "zod";

export const addProductValidation = object({
  body: object({
    name: string({ required_error: "Product name is required" }),
    description: string(),
    price: number().min(0, "Price must be a positive number"),
    tags: array(string()).nonempty("At least one tag is required"),
    stockQuantity: number().min(0, "Stock quantity must be a positive number"),
    imageUrl: string().url("Image URL must be a valid URL").optional(),
    isAvailable: boolean().optional().default(true), // Default value
  }),
});
