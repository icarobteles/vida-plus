"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { patientSchema } from "@/lib/validators";

export async function createPatient(formData: FormData) {
  await requireRole(["ADMIN"]);

  const raw = {
    name: formData.get("name") as string,
    cpf: formData.get("cpf") as string,
    birthDate: formData.get("birthDate") as string,
    phone: (formData.get("phone") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
  };

  const parsed = patientSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.patient.findUnique({
    where: { cpf: parsed.data.cpf.replace(/\D/g, "") },
  });
  if (existing) return { error: "CPF já cadastrado." };

  await prisma.patient.create({
    data: {
      name: parsed.data.name,
      cpf: parsed.data.cpf.replace(/\D/g, ""),
      birthDate: new Date(parsed.data.birthDate),
      phone: parsed.data.phone,
      email: parsed.data.email || null,
    },
  });

  revalidatePath("/pacientes");
  return { success: true };
}
