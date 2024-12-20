import { Role } from "@prisma/client";
import {
  object,
  pipe,
  string,
  InferInput,
  email,
  minLength,
  maxLength,
  regex,
  enum as venum,
  required,
  optional,
} from "valibot";

export const CreateUserSchema = object({
  name: string(),
  email: pipe(string("Email is required"), email()),
  password: pipe(
    string("Password is required"),
    minLength(8, "Your password is too short."),
    maxLength(30, "Your password is too long."),
    regex(/[a-z]/, "Your password must contain a lowercase letter."),
    regex(/[A-Z]/, "Your password must contain a uppercase letter."),
    regex(/[0-9]/, "Your password must contain a number.")
  ),
  phoneNumber: pipe(
    string("Enter phone number"),
    regex(/^01\d{9}/, "Phone number must be 11 numbers starting with 01")
  ),
  role: optional(venum(Role, "Invalid Rule")),
});

export const CreateUserRequestSchema = object({
  body: CreateUserSchema,
});

export type CreateUserType = InferInput<typeof CreateUserSchema>;
