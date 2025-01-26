import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrId: { label: "Email or ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        if (!credentials?.emailOrId || !credentials?.password) {
          return null;
        }
        
        
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials?.emailOrId as string },
              { loginId: credentials?.emailOrId as string },
            ],
          },
          include: {
            staff: true,
            student: true,
          }
        });
        
        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          ...user,
          password: undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user = token.user as User & AdapterUser
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

export const { auth, handlers, signIn, signOut} = NextAuth(authOptions);
