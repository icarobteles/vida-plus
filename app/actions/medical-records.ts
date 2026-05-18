"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { medicalRecordSchema } from "@/lib/validators";

export async function createMedicalRecord(formData: FormData) {
  const user = await requireRole(["PROFESSIONAL"]);

  const raw = {
    type: formData.get("type") as string,
    description: formData.get("description") as string,
  };

  const parsed = medicalRecordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const patientId = formData.get("patientId") as string;
  if (!patientId) return { error: "Paciente é obrigatório." };

  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patient) return { error: "Paciente não encontrado." };

  await prisma.medicalRecord.create({
    data: {
      patientId,
      professionalId: user.id,
      type: parsed.data.type,
      description: parsed.data.description,
    },
  });

  revalidatePath(`/prontuario/${patientId}`);
  return { success: true };
}
