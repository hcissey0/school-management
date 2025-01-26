import { Staff, Student, User } from "@prisma/client";
import NextAuth, { type DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession['user'];
  };
}
