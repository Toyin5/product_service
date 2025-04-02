import { NextFunction, Request, Response } from "express";
import { accessTokenConfig, refreshTokenConfig } from "../config/default";
import { verifyJwt } from "../utils/jwt.utils";
import { reissueTokens } from "../services/auth";
import logger from "../utils/logger";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[accessTokenConfig.cookieName];
  const refreshToken = req.cookies[refreshTokenConfig.cookieName];

  if (!accessToken || !refreshToken) return next();

  const { decodedValue, expired } = verifyJwt(accessToken);
  if (decodedValue) {
    res.locals.user = decodedValue;

    return next();
  }

  if (expired && refreshToken) {
    const newTokens = await reissueTokens(refreshToken);
    if (newTokens) {
      res.cookie(
        accessTokenConfig.cookieName,
        newTokens.accessToken,
        accessTokenConfig.cookieOptions
      );
      res.cookie(
        refreshTokenConfig.cookieName,
        newTokens.refreshToken,
        refreshTokenConfig.cookieOptions
      );
      const { decodedValue } = verifyJwt(newTokens.accessToken);
      res.locals.user = decodedValue;
    } else {
      res.locals.user = null;
    }
  }

  return next();
};

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;
  if (!user)
    return res
      .status(401)
      .send(
        "Authentication required to access this resource. Pls log in again"
      );

  return next();
};
