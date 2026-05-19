import {
  appointmentSchema,
  isValidCpf,
  loginSchema,
  medicalRecordSchema,
  patientSchema,
  prescriptionSchema,
  professionalSchema,
} from "@/lib/validators";
import { describe, expect, it } from "vitest";

describe("isValidCpf", () => {
  it("aceita CPF válido", () => {
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita CPF com todos os dígitos iguais", () => {
    expect(isValidCpf("11111111111")).toBe(false);
  });

  it("rejeita CPF com dígito verificador errado", () => {
    expect(isValidCpf("52998224720")).toBe(false);
  });

  it("rejeita CPF com menos de 11 dígitos", () => {
    expect(isValidCpf("1234567")).toBe(false);
  });

  it("aceita CPF com pontuação", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
  });
});

describe("patientSchema", () => {
  const valid = {
    name: "Maria Souza",
    cpf: "52998224725",
    birthDate: "1990-01-01",
  };

  it("aceita paciente com dados válidos", () => {
    expect(patientSchema.safeParse(valid).success).toBe(true);
  });

  it("aceita paciente com campos opcionais", () => {
    const result = patientSchema.safeParse({
      ...valid,
      phone: "(11) 99999-0000",
      email: "maria@test.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita nome curto", () => {
    const result = patientSchema.safeParse({ ...valid, name: "Ma" });
    expect(result.success).toBe(false);
  });

  it("rejeita CPF vazio", () => {
    const result = patientSchema.safeParse({ ...valid, cpf: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita CPF inválido", () => {
    const result = patientSchema.safeParse({ ...valid, cpf: "00000000000" });
    expect(result.success).toBe(false);
  });

  it("rejeita sem data de nascimento", () => {
    const result = patientSchema.safeParse({ ...valid, birthDate: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = patientSchema.safeParse({ ...valid, email: "invalido" });
    expect(result.success).toBe(false);
  });

  it("aceita e-mail vazio", () => {
    const result = patientSchema.safeParse({ ...valid, email: "" });
    expect(result.success).toBe(true);
  });
});

describe("appointmentSchema", () => {
  it("aceita agendamento válido", () => {
    const result = appointmentSchema.safeParse({
      professionalId: "abc123",
      scheduledAt: "2026-06-01T10:00",
    });
    expect(result.success).toBe(true);
  });

  it("aceita agendamento com observações", () => {
    const result = appointmentSchema.safeParse({
      professionalId: "abc123",
      scheduledAt: "2026-06-01T10:00",
      notes: "Primeira consulta",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita sem profissional", () => {
    const result = appointmentSchema.safeParse({
      professionalId: "",
      scheduledAt: "2026-06-01T10:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita sem data", () => {
    const result = appointmentSchema.safeParse({
      professionalId: "abc123",
      scheduledAt: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("medicalRecordSchema", () => {
  it("aceita registro clínico válido", () => {
    const result = medicalRecordSchema.safeParse({
      type: "Consulta",
      description: "Paciente sem queixas.",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita tipo vazio", () => {
    const result = medicalRecordSchema.safeParse({
      type: "",
      description: "Texto",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita descrição curta", () => {
    const result = medicalRecordSchema.safeParse({
      type: "Exame",
      description: "Ok",
    });
    expect(result.success).toBe(false);
  });
});

describe("prescriptionSchema", () => {
  it("aceita receita válida", () => {
    const result = prescriptionSchema.safeParse({
      medication: "Amoxicilina 500mg",
      dosage: "1 comprimido a cada 8h",
      instructions: "Tomar com água",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita sem medicamento", () => {
    const result = prescriptionSchema.safeParse({
      medication: "",
      dosage: "1x ao dia",
      instructions: "Jejum",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita sem posologia", () => {
    const result = prescriptionSchema.safeParse({
      medication: "Paracetamol",
      dosage: "",
      instructions: "Se dor",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita sem instruções", () => {
    const result = prescriptionSchema.safeParse({
      medication: "Ibuprofeno",
      dosage: "1x ao dia",
      instructions: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("professionalSchema", () => {
  it("aceita profissional válido", () => {
    const result = professionalSchema.safeParse({
      name: "Dr. João",
      email: "joao@vida.plus",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("aceita sem senha (edição)", () => {
    const result = professionalSchema.safeParse({
      name: "Dr. João",
      email: "joao@vida.plus",
      password: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita nome curto", () => {
    const result = professionalSchema.safeParse({
      name: "Dr",
      email: "dr@test.com",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = professionalSchema.safeParse({
      name: "Dr. João",
      email: "invalido",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita senha curta", () => {
    const result = professionalSchema.safeParse({
      name: "Dr. João",
      email: "joao@test.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("aceita login válido", () => {
    const result = loginSchema.safeParse({
      email: "admin@vida.plus",
      password: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({
      email: "invalido",
      password: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita senha vazia", () => {
    const result = loginSchema.safeParse({
      email: "admin@vida.plus",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
