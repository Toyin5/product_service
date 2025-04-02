import { Router } from "express";
import { authenticateUser } from "../middlewares/auth";
import {
  addProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products";
import { addProductValidation } from "../validations/products";
import validateSchema from "../middlewares/validate";

const productRouter = Router();

productRouter.post(
  "/add",
  validateSchema(addProductValidation),
  authenticateUser,
  addProduct
);

productRouter.patch(
  "/:id",
  validateSchema(addProductValidation),
  authenticateUser,
  updateProduct
);

productRouter.delete("/:id", authenticateUser, deleteProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", authenticateUser, getProduct);

export { productRouter };
