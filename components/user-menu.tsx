"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SessionUser } from "@/lib/auth-types";

const roleLabels: Record<SessionUser["role"], string> = {
  ADMIN: "Administrador",
  PATIENT: "Paciente",
  PROFESSIONAL: "Profissional",
};

export function UserMenu({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium">{user.name}</p>
        <Badge variant="secondary" className="text-xs">
          {roleLabels[user.role]}
        </Badge>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </div>
  );
}
