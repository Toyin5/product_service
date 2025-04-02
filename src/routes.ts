import express from "express";
import { authRateLimiter, rateLimiter } from "./config/security";
import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/products";

const router = express.Router();

router.use("/auth", authRateLimiter, authRouter);
router.use("/products", rateLimiter, productRouter);

export default router;
