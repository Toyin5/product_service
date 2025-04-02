import { Request, Response } from "express";
import UserModel from "../../models/UserModel";
import { accessTokenConfig, refreshTokenConfig } from "../../config/default";
import { createTokens } from "../../services/auth";
import { catchAsync } from "../../middlewares/catchAsync";

export const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(404).json({ err: "User not found" });
  }
  const isValidPassword = await user.verifyPassword(password);

  if (!isValidPassword) {
    return res.status(401).json({ err: "Incorrect password" });
  }
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

  return res.status(200).json({
    message: "Login successful",
  });
});
