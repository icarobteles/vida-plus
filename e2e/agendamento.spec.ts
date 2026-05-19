import { test, expect } from "@playwright/test";

test("paciente agenda consulta", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/agendamentos");
  await page.getByText("Agendar consulta").click();

  const future = new Date();
  future.setDate(future.getDate() + 7);
  const value = future.toISOString().slice(0, 16);

  await page.locator('[id="scheduledAt"]').fill(value);
  await page.getByRole("combobox").first().click();
  await page.getByRole("option").first().click();
  await page.getByRole("button", { name: "Confirmar agendamento" }).click();
  await expect(page.getByText("Agendada")).toBeVisible();
});
