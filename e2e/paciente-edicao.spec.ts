import { expect, test } from "@playwright/test";

test("admin edita dados de um paciente existente", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  await page.goto("/pacientes");
  await expect(page.getByText("Lista de pacientes")).toBeVisible();

  const row = page.getByRole("row").filter({ hasText: "Maria Oliveira" });
  await expect(row).toBeVisible();
  await row.locator("button").first().click();

  await expect(
    page.getByRole("heading", { name: "Editar paciente" }),
  ).toBeVisible({ timeout: 5000 });

  await page.getByLabel("Telefone").fill("(11) 99999-0000");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByText("Paciente atualizado")).toBeVisible({
    timeout: 10000,
  });
});
