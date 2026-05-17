import { test, expect } from "@playwright/test";

test("login do paciente redireciona para o dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/Olá/)).toBeVisible();
});
