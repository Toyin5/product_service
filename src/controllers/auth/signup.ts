import { Request, Response } from "express";
import { createTokens } from "../../services/auth";
import { accessTokenConfig, refreshTokenConfig } from "../../config/default";
import UserModel from "../../models/UserModel";
import logger from "../../utils/logger";
import { catchAsync } from "../../middlewares/catchAsync";

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  logger.info("User signup data", { firstName, lastName, email, password });

  const userExists = await UserModel.findOne({ email: email });
  if (userExists) {
    return res.status(409).json({
      status: 409,
      message: "User already exists",
    });
  }

  const user = await UserModel.create({
    email,
    firstName,
    lastName,
    password,
  });

  const { accessToken, refreshToken } = createTokens(user._id);
  res.cookie(
    accessTokenConfig.cookieName,
    accessToken,
    accessTokenConfig.cookieOptions
  );
  res.cookie(
    refreshTokenConfig.cookieName,
    refreshToken,
    refreshTokenConfig.cookieOptions
  );

  return res.status(201).json({
    status: 201,
    message: "Registration successful",
  });
});
