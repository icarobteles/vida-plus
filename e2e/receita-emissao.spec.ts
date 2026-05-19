import { expect, test } from "@playwright/test";

test("profissional emite receita digital para paciente", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  await page.goto("/receitas");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { name: "Receitas Digitais" }),
  ).toBeVisible();

  await page.getByText("Nova receita").click();
  await expect(
    page.getByRole("heading", { name: "Emitir receita digital" }),
  ).toBeVisible({ timeout: 10000 });

  await page.waitForLoadState("networkidle");
  const combobox = page.getByRole("combobox");
  await expect(combobox).toBeVisible();
  await combobox.click();
  await page.getByRole("option").first().click();

  await page.getByLabel("Medicamento").fill("Paracetamol 750mg");
  await page.getByLabel("Posologia").fill("1 comprimido a cada 6 horas");
  await page
    .getByLabel("Instruções")
    .fill("Tomar por 3 dias em caso de febre ou dor.");

  await page.getByRole("button", { name: "Emitir receita" }).click();
  await expect(page.getByText("Receita emitida com sucesso")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText("Paracetamol 750mg")).toBeVisible();
});
