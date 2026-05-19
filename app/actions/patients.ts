"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { patientSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

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

  try {
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
  } catch {
    return { error: "Erro ao cadastrar paciente." };
  }

  revalidatePath("/pacientes");
  return { success: true };
}

export async function updatePatient(id: string, formData: FormData) {
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

  try {
    const cpfDigits = parsed.data.cpf.replace(/\D/g, "");
    const existing = await prisma.patient.findUnique({
      where: { cpf: cpfDigits },
    });
    if (existing && existing.id !== id)
      return { error: "CPF já cadastrado por outro paciente." };

    await prisma.patient.update({
      where: { id },
      data: {
        name: parsed.data.name,
        cpf: cpfDigits,
        birthDate: new Date(parsed.data.birthDate),
        phone: parsed.data.phone,
        email: parsed.data.email || null,
      },
    });
  } catch {
    return { error: "Erro ao atualizar paciente." };
  }

  revalidatePath("/pacientes");
  return { success: true };
}

export async function deletePatient(id: string) {
  await requireRole(["ADMIN"]);

  try {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return { error: "Paciente não encontrado." };

    await prisma.patient.delete({ where: { id } });
  } catch {
    return { error: "Erro ao excluir paciente." };
  }

  revalidatePath("/pacientes");
  return { success: true };
}
