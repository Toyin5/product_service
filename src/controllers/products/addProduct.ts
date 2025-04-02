import { Request, Response } from "express";
import ProductModel, { ProductDocument } from "../../models/ProductModel";
import AppError from "../../utils/appError";
import { catchAsync } from "../../middlewares/catchAsync";
export const addProduct = catchAsync(async (req: Request, res: Response) => {
  const { name, price, description, stockQuantity, tags } =
    req.body as ProductDocument;
  const userId = res.locals.user.id;
  console.log("User ID", res.locals);

  if (!name || !price || !description) {
    throw new AppError("All fields are required", 400);
  }
  const product = new ProductModel({
    name,
    price,
    description,
    stockQuantity,
    tags,
    ownerId: userId,
  });
  await product.save();

  return res.status(201).json(product);
});
