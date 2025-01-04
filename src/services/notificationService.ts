import { AppError } from "../middlewares/AppError";
import { sendNotification } from "../utils/mail";
import prisma from "../utils/prismaClient";

export const subscribe = async (userId: string, productId: string) => {
  const existingSubscription = await prisma.productNotification.findFirst({
    where: { userId, productId, notified: false },
  });

  if (existingSubscription) {
    throw new AppError(200, "You are already subscribed for notifications.");
  }

  // Add subscription
  const notification = await prisma.productNotification.create({
    data: { userId, productId },
  });

  return notification;
};

export const notifyUsers = async (productId: string) => {
  try {
    const notifications = await prisma.productNotification.findMany({
      where: { productId, notified: false },
      include: { user: true, product: true },
    });

    if (notifications.length === 0) return;

    // Notify each user
    for (const notification of notifications) {
      const mailOptions = {
        from: `"E-Commerce App" ${process.env.EMAIL}`,
        to: notification.user.email,
        subject: "Product Back in Stock",
        text: `The product "${notification.product.name}" is back in stock!`,
      };
      await sendNotification(mailOptions);

      // Mark as notified
      await prisma.productNotification.update({
        where: { id: notification.id },
        data: { notified: true },
      });
    }
  } catch (error) {
    console.error("Error notifying users:", error);
  }
};
