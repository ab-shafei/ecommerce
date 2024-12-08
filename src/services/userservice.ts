import { AppError } from "../middlewares/AppError";
import prisma from "../utils/prismaClient";

export const modifyUser = async (
  id: string,
  data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return await prisma.user.update({ where: { id }, data });
};

export const removeUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  await prisma.user.delete({ where: { id } });
};
