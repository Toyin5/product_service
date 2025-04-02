import { signJwt, verifyJwt } from "../utils/jwt.utils";
import { accessTokenConfig, refreshTokenConfig } from "../config/default";

export const createTokens = (id: unknown) => {
  const accessToken = signJwt(
    { id },
    { expiresIn: accessTokenConfig.duration }
  );
  const refreshToken = signJwt(
    { id },
    { expiresIn: refreshTokenConfig.duration }
  );

  return { accessToken, refreshToken };
};

export const reissueTokens = async (refreshToken: string) => {
  const { decodedValue, expired } = verifyJwt(refreshToken);

  if (!decodedValue || expired) return null;

  const newTokens = createTokens(decodedValue.id);

  return newTokens;
};
