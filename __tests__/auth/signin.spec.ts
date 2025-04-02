import request from "supertest";
import app from "../../src/app";
import UserModel from "../../src/models/UserModel";
import { jest } from "@jest/globals";

describe("User Signin", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully authenticate a user", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      _id: "mockUserId",
      email: "test@example.com",
      password: "hashedpassword",
      verifyPassword: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "securepassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined(); // Ensure cookies are set
  }, 10000);

  it("should return 404 for a non-existent user", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404);
    expect(response.body.err).toBe("User not found");
  });

  it("should return 401 for incorrect password", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      _id: "mockUserId",
      email: "test@example.com",
      password: "hashedpassword",
      verifyPassword: jest
        .fn<() => Promise<boolean>>()
        .mockResolvedValue(false),
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body.err).toBe("Incorrect password");
  }, 10000);
});
