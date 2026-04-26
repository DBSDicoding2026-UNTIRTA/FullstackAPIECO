import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    age?: number | null;
    password?: string | null;
    points?: number;
    level?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}