import { DashboardShell } from "@/components/dashboard-shell";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession();

  const now = new Date();
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const where =
    user.role === "PATIENT" && user.patientId
      ? { patientId: user.patientId, status: "SCHEDULED" as const, scheduledAt: { gte: now, lte: in48h } }
      : user.role === "PROFESSIONAL"
        ? { professionalId: user.id, status: "SCHEDULED" as const, scheduledAt: { gte: now, lte: in48h } }
        : user.role === "ADMIN"
          ? { status: "SCHEDULED" as const, scheduledAt: { gte: now, lte: in48h } }
          : undefined;

  const upcoming = where
    ? await prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { name: true } },
          professional: { select: { name: true } },
        },
        orderBy: { scheduledAt: "asc" },
        take: 10,
      })
    : [];

  const notifications = upcoming.map((a) => {
    const diffMs = a.scheduledAt.getTime() - now.getTime();
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const timeStr = diffH > 0 ? `em ${diffH}h ${diffM}min` : `em ${diffM}min`;

    return {
      id: a.id,
      title: user.role === "PATIENT"
        ? `Consulta com ${a.professional.name}`
        : `Consulta — ${a.patient.name}`,
      description: new Date(a.scheduledAt).toLocaleString("pt-BR"),
      time: timeStr,
    };
  });

  return (
    <DashboardShell user={user} notifications={notifications}>
      {children}
    </DashboardShell>
  );
}
