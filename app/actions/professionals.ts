"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { professionalSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";

export async function createProfessional(formData: FormData) {
  await requireRole(["ADMIN"]);

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = professionalSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) return { error: "E-mail já cadastrado." };

  const password = parsed.data.password || "123456";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: "PROFESSIONAL",
    },
  });

  revalidatePath("/profissionais");
  return { success: true };
}

export async function updateProfessional(id: string, formData: FormData) {
  await requireRole(["ADMIN"]);

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: (formData.get("password") as string) || "",
  };

  const parsed = professionalSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing && existing.id !== id) return { error: "E-mail já cadastrado por outro usuário." };

  const data: { name: string; email: string; passwordHash?: string } = {
    name: parsed.data.name,
    email: parsed.data.email,
  };

  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  }

  await prisma.user.update({ where: { id }, data });

  revalidatePath("/profissionais");
  return { success: true };
}

export async function deleteProfessional(id: string) {
  await requireRole(["ADMIN"]);

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "PROFESSIONAL") return { error: "Profissional não encontrado." };

  await prisma.user.delete({ where: { id } });

  revalidatePath("/profissionais");
  return { success: true };
}
