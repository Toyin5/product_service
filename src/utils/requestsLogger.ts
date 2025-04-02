import "dotenv/config";
import morgan from "morgan";
import logger from "./logger";

const requestsLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    skip: () => {
      const env = process.env.NODE_ENV ?? "development";
      return env !== "development";
    },
    stream: {
      write: (message) => logger.http(message),
    },
  }
);

export default requestsLogger;
