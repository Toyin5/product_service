import { Request, Response } from "express";
import ProductModel from "../../models/ProductModel";
import { catchAsync } from "../../middlewares/catchAsync";
import AppError from "../../utils/appError";

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = res.locals.user.id;
  if (!id) {
    throw new AppError("Product ID is required", 400);
  }
  // Delete the product and check if it existed
  const product = await ProductModel.findOneAndDelete({
    _id: id,
    ownerId: userId,
  });
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return res.status(200).json({ message: "Product deleted successfully" });
});
