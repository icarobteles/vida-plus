import type { NextAuthConfig } from "next-auth";
import type { SessionUser } from "@/lib/auth-types";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.patientId = user.patientId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as SessionUser).id = token.sub!;
        (session.user as SessionUser).role = token.role as SessionUser["role"];
        (session.user as SessionUser).patientId = token.patientId as
          | string
          | undefined;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
