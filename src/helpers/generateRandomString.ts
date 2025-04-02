import { randomBytes } from "crypto";

const generateRandomString = () => {
  return randomBytes(32).toString("hex");
};

export default generateRandomString;
