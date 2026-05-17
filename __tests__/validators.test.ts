import { describe, it, expect } from "vitest";
import { isValidCpf, patientSchema } from "@/lib/validators";

describe("isValidCpf", () => {
  it("aceita CPF válido", () => {
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejeita CPF inválido", () => {
    expect(isValidCpf("11111111111")).toBe(false);
  });
});

describe("patientSchema", () => {
  it("rejeita cadastro sem CPF válido", () => {
    const result = patientSchema.safeParse({
      name: "Teste Silva",
      cpf: "",
      birthDate: "1990-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("aceita paciente com dados válidos", () => {
    const result = patientSchema.safeParse({
      name: "Maria Souza",
      cpf: "52998224725",
      birthDate: "1990-01-01",
    });
    expect(result.success).toBe(true);
  });
});
