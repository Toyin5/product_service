import request from "supertest";
import app from "../../src/app";
import UserModel from "../../src/models/UserModel";
import { jest } from "@jest/globals";

describe("User Signup (Mocked DB)", () => {
  beforeEach(() => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should successfully sign up a new user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "securepassword123",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Registration successful");
  }, 10000);

  it("should not allow duplicate emails", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValue({
      email: "test@example.com",
    });

    const response = await request(app).post("/api/v1/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "test@example.com",
      password: "securepassword123",
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already exists");
  }, 10000);
});
