import { DashboardShell } from "@/components/dashboard-shell";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
