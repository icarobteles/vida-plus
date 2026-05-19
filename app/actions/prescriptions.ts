"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { prescriptionSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createPrescription(formData: FormData) {
  const user = await requireRole(["PROFESSIONAL"]);

  const raw = {
    medication: formData.get("medication") as string,
    dosage: formData.get("dosage") as string,
    instructions: formData.get("instructions") as string,
  };

  const parsed = prescriptionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const patientId = formData.get("patientId") as string;
  if (!patientId) return { error: "Paciente é obrigatório." };

  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) return { error: "Paciente não encontrado." };

    await prisma.prescription.create({
      data: {
        patientId,
        professionalId: user.id,
        medication: parsed.data.medication,
        dosage: parsed.data.dosage,
        instructions: parsed.data.instructions,
      },
    });
  } catch {
    return { error: "Erro ao emitir receita." };
  }

  revalidatePath(`/receitas`);
  return { success: true };
}
