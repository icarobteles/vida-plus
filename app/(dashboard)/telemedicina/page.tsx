import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { TelemedicinaClient } from "./telemedicina-client";

export default async function TelemedicinaPage() {
  const user = await requireRole(["PATIENT", "PROFESSIONAL"]);

  const where =
    user.role === "PATIENT" && user.patientId
      ? { patientId: user.patientId, status: "SCHEDULED" as const }
      : user.role === "PROFESSIONAL"
        ? { professionalId: user.id, status: "SCHEDULED" as const }
        : { status: "SCHEDULED" as const };

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { select: { name: true } },
      professional: { select: { name: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  const appointmentOptions = appointments.map((a) => ({
    id: a.id,
    patientName: a.patient.name,
    professionalName: a.professional.name,
    scheduledAt: a.scheduledAt.toISOString(),
  }));

  return (
    <TelemedicinaClient
      userName={user.name}
      userRole={user.role}
      appointments={appointmentOptions}
    />
  );
}
