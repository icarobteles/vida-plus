"use server";

import { prisma } from "@/lib/prisma";
import { requireRole, requireSession } from "@/lib/session";
import { appointmentSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

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

  try {
    await prisma.appointment.create({
      data: {
        patientId,
        professionalId: parsed.data.professionalId,
        scheduledAt: new Date(parsed.data.scheduledAt),
        notes: parsed.data.notes,
      },
    });
  } catch {
    return { error: "Erro ao criar agendamento. Verifique os dados." };
  }

  revalidatePath("/agendamentos");
  return { success: true };
}

export async function completeAppointment(id: string) {
  const user = await requireRole(["PROFESSIONAL"]);

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return { error: "Consulta não encontrada." };
    if (appointment.professionalId !== user.id)
      return { error: "Sem permissão." };
    if (appointment.status !== "SCHEDULED")
      return { error: "Somente consultas agendadas podem ser concluídas." };

    await prisma.appointment.update({
      where: { id },
      data: { status: "COMPLETED" },
    });
  } catch {
    return { error: "Erro ao concluir consulta." };
  }

  revalidatePath("/agendamentos");
  return { success: true };
}

export async function cancelAppointment(id: string) {
  const user = await requireSession();

  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return { error: "Consulta não encontrada." };
    if (appointment.status !== "SCHEDULED")
      return { error: "Somente consultas agendadas podem ser canceladas." };

    if (user.role === "PATIENT" && appointment.patientId !== user.patientId) {
      return { error: "Sem permissão." };
    }
    if (
      user.role === "PROFESSIONAL" &&
      appointment.professionalId !== user.id
    ) {
      return { error: "Sem permissão." };
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  } catch {
    return { error: "Erro ao cancelar consulta." };
  }

  revalidatePath("/agendamentos");
  return { success: true };
}
