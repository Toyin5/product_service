import { Request, Response } from "express";
import ProductModel from "../../models/ProductModel";
import AppError from "../../utils/appError";
import { catchAsync } from "../../middlewares/catchAsync";

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const userId = res.locals.user.id; // Assuming you have user ID in res.locals

  //check if the product exists and belongs to the user
  const product = await ProductModel.findOne({ _id: id, ownerId: userId });
  if (!product) {
    throw new AppError(
      "Product not found or you don't have permission to update it",
      404
    );
  }

  // Find the product by ID and update it
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators
  });

  if (!updatedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json(updatedProduct);
});
