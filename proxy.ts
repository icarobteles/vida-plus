import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { Role } from "@/app/generated/prisma/client";

const { auth } = NextAuth(authConfig);

const roleRoutes: Record<string, Role[]> = {
  "/pacientes": ["ADMIN"],
  "/agendamentos": ["PATIENT", "ADMIN", "PROFESSIONAL"],
  "/telemedicina": ["PATIENT", "PROFESSIONAL"],
};

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/prontuario")) {
    const role = req.auth?.user?.role;
    if (role !== "ADMIN" && role !== "PATIENT" && role !== "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  for (const [route, roles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      const userRole = req.auth?.user?.role as Role | undefined;
      if (!userRole || !roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/pacientes/:path*",
    "/agendamentos/:path*",
    "/prontuario/:path*",
    "/telemedicina/:path*",
  ],
};
