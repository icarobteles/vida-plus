import { expect, test } from "@playwright/test";

test("profissional conclui uma consulta agendada", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  await page.goto("/agendamentos");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { name: "Agendamentos" }),
  ).toBeVisible();

  const row = page.getByRole("row").filter({ hasText: "Agendada" }).first();
  await expect(row).toBeVisible();
  await row.locator("button").first().click();

  await expect(page.getByText("Consulta concluída")).toBeVisible({
    timeout: 10000,
  });
});
