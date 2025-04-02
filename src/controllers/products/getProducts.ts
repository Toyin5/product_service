import { Request, Response } from "express";
import ProductModel from "../../models/ProductModel";
import { catchAsync } from "../../middlewares/catchAsync";

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const userId = res.locals.user.id;
  const products = await ProductModel.find({ ownerId: userId });
  res.status(200).json({ success: true, data: products });
});
