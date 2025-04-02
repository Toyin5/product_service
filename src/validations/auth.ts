import { object, string } from "zod";

export const loginUserValidation = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export const registerUserValidation = object({
  body: object({
    firstName: string(),
    lastName: string(),
    email: string({
      required_error: "Email is required",
    }).email("Enter a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password too short - 6 chars minimum"),
  }),
});
