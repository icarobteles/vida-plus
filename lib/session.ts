import { auth } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth-types";
import { redirect } from "next/navigation";
import type { Role } from "@/app/generated/prisma/client";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user as SessionUser;
}

export async function requireRole(roles: Role[]) {
  const user = await requireSession();
  if (!roles.includes(user.role)) redirect("/dashboard");
  return user;
}
