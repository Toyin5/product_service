import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import requestsLogger from "./utils/requestsLogger";
import { deserializeUser } from "./middlewares/auth";
import routes from "./routes";
import { rateLimiter } from "./config/security";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import { catchAsync } from "./middlewares/catchAsync";

const app = express();

app.use(rateLimiter);
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(requestsLogger);
app.use(deserializeUser);

app.use("/health", (req, res) => {
  res.status(200).json({ message: "Breathing... 🌬" });
});
app.use("/api/v1", routes);

app.use(globalErrorHandler);
export default app;
