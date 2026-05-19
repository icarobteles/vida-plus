import { test, expect } from "@playwright/test";

test("admin cadastra paciente com CPF válido", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/pacientes");
  await page.getByText("Novo paciente").click();
  await page.getByLabel("Nome completo").fill("Teste E2E Paciente");
  await page.getByLabel("CPF").fill("28625587896");
  await page.getByLabel("Data de nascimento").fill("1995-06-20");
  await page.getByRole("button", { name: "Cadastrar" }).click();
  await expect(page.getByText("Teste E2E Paciente")).toBeVisible();
});
