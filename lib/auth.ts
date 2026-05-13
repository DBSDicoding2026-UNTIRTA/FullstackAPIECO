import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { z } from "zod";

import type { Role } from "@/lib/generated/prisma/client";
import prisma from "@/lib/prisma";

const DEFAULT_ROLE: Role = "USER";
const ADMIN_EMAIL = "memoriesendx@gmail.com";
const MAX_SESSION_IMAGE_LENGTH = 2048;
const BASE64_IMAGE_PATTERN = /^data:image\/(png|jpe?g|webp|gif);base64,/i;

const userSessionSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  image: true,
  avatar: true,
  role: true,
} as const;

function getSafeSessionImage(value: unknown): string | null {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  if (value.length > MAX_SESSION_IMAGE_LENGTH) {
    return null;
  }

  if (BASE64_IMAGE_PATTERN.test(value)) {
    return null;
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
  } catch {
    return null;
  }

  return value;
}

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

        const safeImage = getSafeSessionImage(user.avatar ?? user.image);

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          image: safeImage,
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

      const safeUserImage = getSafeSessionImage(user?.image);

      if (user) {
        token.id = user.id ?? token.sub ?? token.id;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
        token.picture = safeUserImage ?? token.picture;
        token.username = user.username ?? token.username;
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
        const safeDbImage = getSafeSessionImage(dbUser.avatar ?? dbUser.image);
        const safeTokenImage = getSafeSessionImage(token.picture);
        const resolvedImage = safeDbImage ?? safeTokenImage;

        token.id = dbUser.id;
        token.name = dbUser.name ?? token.name;
        token.email = dbUser.email;
        if (resolvedImage) {
          token.picture = resolvedImage;
        } else {
          delete token.picture;
        }
        token.username = dbUser.username ?? token.username;
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
        session.user.username = token.username ?? null;
        session.user.role = token.role ?? DEFAULT_ROLE;
      }

      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id) {
        return;
      }

      const isAdminEmail =
        typeof user.email === "string" &&
        user.email.toLowerCase() === ADMIN_EMAIL;

      await prisma.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            lastLoginAt: new Date(),
            ...(isAdminEmail ? { role: "ADMIN" as Role } : {}),
          },
        })
        .catch(() => {
          // Login should not fail because an audit timestamp failed to persist.
        });
    },
  },
};
