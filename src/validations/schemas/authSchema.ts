import {
  object,
  pipe,
  string,
  InferInput,
  email,
  regex,
  minLength,
  maxLength,
} from "valibot";

export const RegisterSchema = object({
  name: string(),
  email: pipe(string(), email()),
  password: pipe(
    string(),
    minLength(8, "Your password is too short."),
    maxLength(30, "Your password is too long."),
    regex(/[a-z]/, "Your password must contain a lowercase letter."),
    regex(/[A-Z]/, "Your password must contain a uppercase letter."),
    regex(/[0-9]/, "Your password must contain a number.")
  ),
  phoneNumber: pipe(
    string("Enter phone number"),
    regex(/^01\d{9}$/, "Phone number must be 11 numbers starting with 01")
  ),
});

export const ResetPasswordSchema = object({
  name: string(),
  email: pipe(string(), email()),
  password: pipe(
    string(),
    minLength(8, "Your password is too short."),
    maxLength(30, "Your password is too long."),
    regex(/[a-z]/, "Your password must contain a lowercase letter."),
    regex(/[A-Z]/, "Your password must contain a uppercase letter."),
    regex(/[0-9]/, "Your password must contain a number.")
  ),
  phoneNumber: pipe(
    string("Enter phone number"),
    regex(/^01\d{9}$/, "Phone number must be 11 numbers starting with 01")
  ),
});

export const RegisterRequestSchema = object({
  body: RegisterSchema,
});

export type RegisterType = InferInput<typeof RegisterSchema>;
