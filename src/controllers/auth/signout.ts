import { Request, Response } from "express";
import { accessTokenConfig, refreshTokenConfig } from "../../config/default";
import { catchAsync } from "../../middlewares/catchAsync";
export const signout = catchAsync(async (_: Request, res: Response) => {
  res.clearCookie(accessTokenConfig.cookieName);
  res.clearCookie(refreshTokenConfig.cookieName);

  return res.send("successfully logged out");
});
