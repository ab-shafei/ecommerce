import { ReviewStatus } from "@prisma/client";
import {
  object,
  pipe,
  string,
  InferInput,
  uuid,
  number,
  enum as venum,
  maxValue,
} from "valibot";

export const AddReviewSchema = object({
  productId: string("Invalid Product ID"),
  rating: pipe(
    number("Invalid Rating Value"),
    maxValue(5, "Rating must be less than or equal to 5")
  ),
  comment: string("Invalid Comment Value"),
});

export const UpdateReviewSchema = object({
  reviewId: string("Invalid Review ID"),
  status: venum(
    ReviewStatus,
    "Invalid Review Status Value (APPROVED | REJECTED)"
  ),
});

export const AddReviewRequestSchema = object({
  body: AddReviewSchema,
});

export const UpdateReviewRequestSchema = object({
  body: UpdateReviewSchema,
});

export const DeleteReviewRequestSchema = object({
  params: object({
    id: pipe(string(), uuid()),
  }),
});

export type AddReviewType = InferInput<typeof AddReviewSchema>;
export type UpdateReviewType = InferInput<typeof UpdateReviewSchema>;
