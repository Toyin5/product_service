import { Request, Response } from "express";
import ProductModel from "../../models/ProductModel";
import AppError from "../../utils/appError";
import { catchAsync } from "../../middlewares/catchAsync";

export const getProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = res.locals.user.id;

  const product = await ProductModel.findOne({ _id: id, ownerId: userId });

  if (!product) {
    throw new AppError(
      "Product not found or you don't have permission to access it",
      404
    );
  }

  return res.status(200).json(product);
});
