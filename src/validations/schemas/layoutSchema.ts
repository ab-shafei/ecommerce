import {
  object,
  pipe,
  string,
  optional,
  InferInput,
  email,
  regex,
} from "valibot";

export const ChangeLayoutSchema = object({
  title: optional(string()),
  paragraph: optional(string()),
  color1: optional(string()),
  color2: optional(string()),
  color3: optional(string()),
  returnPolicy: optional(string()),
  privacyPolicy: optional(string()),
  termsAndConditions: optional(string()),
  aboutUs: optional(string()),
  contactEmail: optional(pipe(string(), email())),
  contactPhoneNumber: optional(
    pipe(
      string("Enter phone number"),
      regex(/^01\d{9}$/, "Phone number must be 11 numbers starting with 01")
    )
  ),
});

export const ChangeLayoutRequestSchema = object({
  body: ChangeLayoutSchema,
});

export type ChangeLayoutType = InferInput<typeof ChangeLayoutSchema>;
