import mongoose from "mongoose";
import uuid from "uuid";
import connectDB from "../../src/config/database";
import { deleteTestDatabases } from "./cleanup";

const setup = () => {
  beforeEach(async () => {
    await deleteTestDatabases();
    await connectDB(
      process.env
        .MONGO_URI!.split("/")
        .slice(0, -1)
        .concat(`test_${uuid.v4().toString()}`)
        .join("/")
    );
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });
};

module.exports = { setup };
