import {
  object,
  string,
  optional,
  InferInput,
  pipe,
  regex,
  boolean,
} from "valibot";

export const AddAddressSchema = object({
  name: string("Invalid name"),
  phoneNumber: pipe(
    string("Enter phone number"),
    regex(/^01\d{9}$/, "Phone number must be 11 numbers starting with 01")
  ),
  city: string("Invalid city"),
  region: string("Invalid region"),
  addressLine1: string("Invalid addressLine1"),
  addressLine2: optional(string("Invalid addressLine2")),
  isDefault: optional(boolean("Invalid isDefault")),
});
export const UpdateAddressSchema = object({
  name: optional(string("Invalid name")),
  phoneNumber: optional(
    pipe(
      string("Enter phone number"),
      regex(/^01\d{9}$/, "Phone number must be 11 numbers starting with 01")
    )
  ),
  city: optional(string("Invalid city")),
  region: optional(string("Invalid region")),
  addressLine1: optional(string("Invalid addressLine1")),
  addressLine2: optional(string("Invalid addressLine2")),
  isDefault: optional(boolean("Invalid isDefault")),
});

export const AddAddressRequestSchema = object({
  body: AddAddressSchema,
});
export const UpdateAddressRequestSchema = object({
  body: AddAddressSchema,
});

export type AddAddressType = InferInput<typeof AddAddressRequestSchema>;
export type UpdateAddressType = InferInput<typeof UpdateAddressRequestSchema>;
