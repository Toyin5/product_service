import { Router } from "express";
import validateSchema from "../middlewares/validate";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validations/auth";
import { signUp, signin, signout } from "../controllers";
import { authenticateUser } from "../middlewares/auth";

const authRouter = Router();

authRouter.post("/login", validateSchema(loginUserValidation), signin);
authRouter.post("/register", validateSchema(registerUserValidation), signUp);
authRouter.delete("/logout", authenticateUser, signout);

export { authRouter };
