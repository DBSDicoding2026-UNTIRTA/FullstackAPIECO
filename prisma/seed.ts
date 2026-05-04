import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function seedAdmin(): Promise<void> {
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

  console.log("✅ Admin seeded");
}