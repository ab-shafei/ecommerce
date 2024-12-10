import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

import { users } from "./seedData";
async function main() {
  for (let user of users) {
    const user1 = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        role: user.role as Role,
      },
    });
    console.log({ user1 });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
