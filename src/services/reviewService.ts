import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/AppError";

const prisma = new PrismaClient();

export const addReview = async ({
  userId,
  productId,
  rating,
  comment,
}: {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
}) => {
  const order = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        customerId: userId,
        status: "DELIVERED", // Only allow reviews for delivered orders
      },
    },
  });

  if (!order) {
    throw new AppError(400, "You can only review products you have purchased.");
  }

  const review = await prisma.review.upsert({
    where: {
      productId_userId: {
        productId,
        userId,
      },
    },
    update: {
      rating,
      comment,
      status: "PENDING",
    },
    create: {
      userId,
      productId,
      rating,
      comment,
      status: "PENDING",
    },
  });

  return {
    message: "Review submitted successfully!",
    review,
  };
};

export const moderateReview = async ({
  reviewId,
  status,
}: {
  reviewId: number;
  status: "APPROVED" | "REJECTED";
}) => {
  // Update review status
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status },
  });

  return {
    message: `Review ${status.toLowerCase()} successfully!`,
    review,
  };
};

export const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      user: {
        select: { name: true }, // Show the reviewer's name
      },
    },
  });

  return {
    reviews,
  };
};

export const getAllProductReviews = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      productId,
      status: "APPROVED",
    },
    include: {
      user: {
        select: { name: true }, // Show the reviewer's name
      },
    },
  });

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length ||
    0;

  return {
    reviews,
    averageRating: averageRating.toFixed(1),
    totalReviews: reviews.length,
  };
};
