"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession, requireRole } from "@/lib/session";
import { appointmentSchema } from "@/lib/validators";

export async function createAppointment(formData: FormData) {
  const user = await requireRole(["PATIENT", "ADMIN"]);

  const raw = {
    professionalId: formData.get("professionalId") as string,
    scheduledAt: formData.get("scheduledAt") as string,
    notes: (formData.get("notes") as string) || undefined,
  };

  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  let patientId = formData.get("patientId") as string | null;
  if (user.role === "PATIENT") {
    if (!user.patientId) return { error: "Perfil de paciente não vinculado." };
    patientId = user.patientId;
  }
  if (!patientId) return { error: "Paciente é obrigatório." };

  await prisma.appointment.create({
    data: {
      patientId,
      professionalId: parsed.data.professionalId,
      scheduledAt: new Date(parsed.data.scheduledAt),
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/agendamentos");
  return { success: true };
}

export async function completeAppointment(id: string) {
  const user = await requireRole(["PROFESSIONAL"]);
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) return { error: "Consulta não encontrada." };
  if (appointment.professionalId !== user.id) return { error: "Sem permissão." };
  if (appointment.status !== "SCHEDULED") return { error: "Somente consultas agendadas podem ser concluídas." };

  await prisma.appointment.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  revalidatePath("/agendamentos");
  return { success: true };
}

export async function cancelAppointment(id: string) {
  const user = await requireSession();
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true },
  });
  if (!appointment) return { error: "Consulta não encontrada." };

  if (
    user.role === "PATIENT" &&
    appointment.patientId !== user.patientId
  ) {
    return { error: "Sem permissão." };
  }

  await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/agendamentos");
  return { success: true };
}
