"use client";

import type { Role } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Calendar,
  FileText,
  LayoutDashboard,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "PATIENT", "PROFESSIONAL"],
  },
  {
    href: "/pacientes",
    label: "Pacientes",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/profissionais",
    label: "Profissionais",
    icon: Stethoscope,
    roles: ["ADMIN"],
  },
  {
    href: "/agendamentos",
    label: "Agendamentos",
    icon: Calendar,
    roles: ["PATIENT", "ADMIN", "PROFESSIONAL"],
  },
  {
    href: "/prontuario",
    label: "Prontuário",
    icon: FileText,
    roles: ["PATIENT", "PROFESSIONAL", "ADMIN"],
  },
  {
    href: "/receitas",
    label: "Receitas",
    icon: FileText,
    roles: ["PROFESSIONAL"],
  },
  {
    href: "/telemedicina",
    label: "Telemedicina",
    icon: Video,
    roles: ["PATIENT", "PROFESSIONAL"],
  },
  {
    href: "/relatorios",
    label: "Relatórios",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
];

export function AppSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const visible = links.filter((l) => l.roles.includes(role));

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Activity className="h-7 w-7 text-primary" />
        <div>
          <p className="font-semibold leading-tight">MedFlow</p>
          <p className="text-xs text-muted-foreground">VidaPlus SGHSS</p>
        </div>
      </div>
      <nav aria-label="Menu principal" className="flex flex-1 flex-col gap-1 p-4">
        {visible.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
