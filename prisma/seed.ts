import prisma from "@/lib/prisma";

async function main(): Promise<void> {
  try {
    await prisma.user.upsert({
      where: {
        email: "memoriesendx@gmail.com",
      },
      update: {
        name: "Memories End XYZ",
        role: "ADMIN",
        points: 0,
        level: 1,
        password: null,
      },
      create: {
        email: "memoriesendx@gmail.com",
        name: "Memories End XYZ",
        role: "ADMIN",
        points: 0,
        level: 1,
        password: null,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  throw error;
});