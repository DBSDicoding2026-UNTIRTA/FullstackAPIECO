import type { DefaultSession, DefaultUser } from "next-auth";
import type { Role } from "@/lib/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      username?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: Role;
    username?: string | null;
    age?: number | null;
    password?: string | null;
    points?: number;
    level?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    username?: string | null;
  }
}
