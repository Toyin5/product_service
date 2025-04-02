import "dotenv/config";
const env = process.env.NODE_ENV ?? "development";
export const accessTokenConfig = {
  duration: "15m",
  cookieName: "product-access_token",
  cookieOptions: {
    maxAge: 300000,
    httpOnly: true,
    secure: env === "production",
  },
};

export const refreshTokenConfig = {
  duration: "30m",
  cookieName: "product-refresh_token",
  cookieOptions: {
    maxAge: 3000000,
    httpOnly: true,
    secure: env === "production",
  },
};
