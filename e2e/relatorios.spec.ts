import { test, expect } from "@playwright/test";

test("admin acessa página de relatórios com métricas", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.goto("/relatorios");
  await expect(page.getByText("Relatórios")).toBeVisible();
  await expect(page.getByText("Pacientes")).toBeVisible();
  await expect(page.getByText("Profissionais")).toBeVisible();
  await expect(page.getByText("Consultas — Resumo")).toBeVisible();
});
