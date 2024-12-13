import prisma from "../utils/prismaClient";

export const fetchAllCategoriesAndProducts = async (search: string) => {
  const categories = await prisma.category.findMany({
    where: {
      name: {
        contains: search,
      },
    },
  });

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search,
      },
    },
  });
  return { categories, products };
};
