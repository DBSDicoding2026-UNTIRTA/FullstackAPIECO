import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { z } from "zod";

import type { Role } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

const DEFAULT_ROLE: Role = "USER";

const userSessionSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
} as const;

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Email atau password tidak valid.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsedCredentials.data.email,
          },
          select: {
            ...userSessionSelect,
            password: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Email atau password salah.");
        }

        const passwordMatches = await bcrypt.compare(
          parsedCredentials.data.password,
          user.password,
        );

        if (!passwordMatches) {
          throw new Error("Email atau password salah.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      const identifier = user?.id ?? token.id ?? token.sub;

      if (user) {
        token.id = user.id ?? token.sub ?? token.id;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = user.image ?? token.picture;
      }

      const dbUser =
        identifier != null
          ? await prisma.user.findFirst({
              where: {
                OR: [{ id: identifier }, ...(email ? [{ email }] : [])],
              },
              select: userSessionSelect,
            })
          : null;

      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name ?? token.name;
        token.email = dbUser.email;
        token.picture = dbUser.image ?? token.picture;
        token.role = dbUser.role;
      } else if (!token.role) {
        token.role = DEFAULT_ROLE;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? "";
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.picture ?? session.user.image;
        session.user.role = token.role ?? DEFAULT_ROLE;
      }

      return session;
    },
  },
};