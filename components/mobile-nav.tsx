"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Role } from "@/app/generated/prisma/client";

const links = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "PATIENT", "PROFESSIONAL"] as Role[] },
  { href: "/pacientes", label: "Pacientes", roles: ["ADMIN"] as Role[] },
  { href: "/agendamentos", label: "Agendamentos", roles: ["PATIENT", "ADMIN"] as Role[] },
  { href: "/prontuario", label: "Prontuário", roles: ["PATIENT", "PROFESSIONAL", "ADMIN"] as Role[] },
  { href: "/telemedicina", label: "Telemedicina", roles: ["PATIENT", "PROFESSIONAL"] as Role[] },
];

export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const visible = links.filter((l) => l.roles.includes(role));

  return (
    <Sheet>
      <SheetTrigger
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <SheetHeader>
          <SheetTitle>MedFlow</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-2">
          {visible.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
