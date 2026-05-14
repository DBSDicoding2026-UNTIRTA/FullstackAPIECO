import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export async function seedAdmin(): Promise<void> {
  const admins = [
    {
      email: "memoriesendx@gmail.com",
      name: "Dafa Rizqy",
    },
    {
      email: "lutfilawliet2.0@gmail.com",
      name: "Muhamad Lutfi",
    },
    {
      email: "nenih170805@gmail.com",
      name: "Dafa Rizqy",
    },
    {
      email: "3337230019@untirta.ac.id",
      name: "Nurul Santi Hafifah",
    },
    {
      email: "sxrahaulia@gmail.com",
      name: "Sarah Aulia Rahmah",
    },
    {
      email: "sirrulfatih471@gmail.com",
      name: "Sirrul Fatih Ahdiat",
    },
    {
      email: "fatalaguna6@gmail.com",
      name: "Guna Fatala",
    },
  ];

  for (const admin of admins) {
    await prisma.user.upsert({
      where: {
        email: admin.email,
      },
      update: {
        name: admin.name,
        role: "ADMIN",
        points: 0,
        level: 1,
        password: null,
      },
      create: {
        email: admin.email,
        name: admin.name,
        role: "ADMIN",
        points: 0,
        level: 1,
        password: null,
      },
    });
  }

  console.log("✅ All admins seeded");
}

seedAdmin()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });