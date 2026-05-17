import type { Role } from "@/app/generated/prisma/client";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  patientId?: string;
};

declare module "next-auth" {
  interface User {
    role: Role;
    patientId?: string;
  }
  interface Session {
    user: SessionUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: Role;
    patientId?: string;
  }
}
